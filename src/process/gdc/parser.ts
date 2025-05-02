import { Constant, GdcFile, Token } from "../../parse/binary/gdc";
import { TokenType } from "../../parse/binary/gdc_tokens";
import { ERR_FAIL_V_MSG } from "../../util/data-reader";
import { get_rule, Precedence } from "./rules";
import { AnnotationInfo_TargetKind, AnnotationNode, ArrayNode, AssertNode, AssignmentNode, AssignmentOperation, AwaitNode, BinaryOpNode, BinaryOpType, BreakNode, BreakpointNode, CallNode, CastNode, ClassMemberSource, ClassNode, ConstantNode, ContinueNode, DictionaryNode, DictionaryNode_Style, EnumNode, EnumValue, ExpressionNode, ForNode, FunctionNode, GetNodeNode, IdentifierNode, IdentifierNode_Source, IfNode, LambdaNode, LiteralNode, MatchBranchNode, MatchNode, Node, ParameterNode, PassNode, PatternNode, PatternNode_Type, PreloadNode, registerAnnotations, ReturnNode, SelfNode, SignalNode, SubscriptNode, SuiteNode, SuiteNode_Local, SuiteNode_Local_Type, TernaryOpNode, Type, TypeNode, TypeTestNode, UnaryOpNode, UnaryOpNode_OpType, VariableNode, VariableNode_PropertyStyle, VariantOperator, WhileNode } from "./type";

function canonicalize_path(path: string): string {
  return path;
}

function is_node_name(type: TokenType): boolean {
  // This is meant to allow keywords with the $ notation, but not as general identifiers.
  switch (type) {
    case TokenType.IDENTIFIER:
    case TokenType.AND:
    case TokenType.AS:
    case TokenType.ASSERT:
    case TokenType.AWAIT:
    case TokenType.BREAK:
    case TokenType.BREAKPOINT:
    case TokenType.CLASS_NAME:
    case TokenType.CLASS:
    case TokenType.CONST:
    case TokenType.CONST_PI:
    case TokenType.CONST_INF:
    case TokenType.CONST_NAN:
    case TokenType.CONST_TAU:
    case TokenType.CONTINUE:
    case TokenType.ELIF:
    case TokenType.ELSE:
    case TokenType.ENUM:
    case TokenType.EXTENDS:
    case TokenType.FOR:
    case TokenType.FUNC:
    case TokenType.IF:
    case TokenType.IN:
    case TokenType.IS:
    case TokenType.MATCH:
    case TokenType.NAMESPACE:
    case TokenType.NOT:
    case TokenType.OR:
    case TokenType.PASS:
    case TokenType.PRELOAD:
    case TokenType.RETURN:
    case TokenType.SELF:
    case TokenType.SIGNAL:
    case TokenType.STATIC:
    case TokenType.SUPER:
    case TokenType.TRAIT:
    case TokenType.UNDERSCORE:
    case TokenType.VAR:
    case TokenType.VOID:
    case TokenType.WHILE:
    case TokenType.WHEN:
    case TokenType.YIELD:
      return true;
    default:
      return false;
  }
}

function is_identifier(type: TokenType): boolean {
  // Note: Most keywords should not be recognized as identifiers.
  // These are only exceptions for stuff that already is on the engine's API.
  switch (type) {
    case TokenType.IDENTIFIER:
    case TokenType.MATCH: // Used in String.match().
    case TokenType.WHEN: // New keyword, avoid breaking existing code.
    // Allow constants to be treated as regular identifiers.
    case TokenType.CONST_PI:
    case TokenType.CONST_INF:
    case TokenType.CONST_NAN:
    case TokenType.CONST_TAU:
      return true;
    default:
      return false;
  }
}
function get_identifier(token: Token): string {
  return token.literal?.toString() as string
}

function vformat(template: string, ...values: any[]) {
  return template.replace(/\%./g, function (match, number) { return typeof values[number] !== 'undefined' ? values[number] : match; });
}

function tryOrThrow<T extends Node>(obj: T | null): T {
  if (obj) return obj;
  throw new Error("obj should not be undefined")
}

function push_error(err: string, ...extras: any) {
  throw new Error(err, { cause: extras });
}

export class Tokenizer {
  current = 0;
  current_line = 1;

  pending_indents = 0;

  last_token_was_newline = false;
  indent_stack: number[] = [];
  indent_stack_stack: number[][] = [];

  multiline_mode = false;

  private tokens: Token[];
  private token_lines: Record<number, number>;
  private token_columns: Record<number, number>

  constructor(gdcFile: GdcFile) {
    this.tokens = gdcFile.tokens;
    this.token_lines = gdcFile.token_lines;
    this.token_columns = gdcFile.token_columns;
  }
  scan(): Token {
    // Add final newline.
    if (this.current >= this.tokens.length && !this.last_token_was_newline) {
      const newline: Token = {
        type: TokenType.NEWLINE,
        start_line: this.current_line
      };
      this.last_token_was_newline = true;
      return newline;
    }

    // Resolve pending indentation change.
    if (this.pending_indents > 0) {
      this.pending_indents--;
      const indent: Token = {
        type: TokenType.INDENT,
        start_line: this.current_line
      }
      return indent;
    } else if (this.pending_indents < 0) {
      this.pending_indents++;
      const dedent: Token = {
        type: TokenType.DEDENT,
        start_line: this.current_line
      }
      return dedent;
    }

    if (this.current >= this.tokens.length) {
      if (this.indent_stack.length) {
        this.pending_indents -= this.indent_stack.length;
        this.indent_stack.length = 0;
        return this.scan();
      }
      const eof: Token = {
        type: TokenType.TK_EOF,
        start_line: this.current_line
      };

      return eof;
    };

    if (!this.last_token_was_newline && this.token_lines[this.current]) {
      this.current_line = this.token_lines[this.current];
      const current_column = this.token_columns[this.current];

      // Check if there's a need to indent/dedent.
      if (!this.multiline_mode) {
        let previous_indent = 0;
        if (this.indent_stack.length) {
          previous_indent = this.indent_stack.slice(-1)[0];
        }
        if (current_column - 1 > previous_indent) {
          this.pending_indents++;
          this.indent_stack.push(current_column - 1);
        } else {
          while (current_column - 1 < previous_indent) {
            this.pending_indents--;
            this.indent_stack.pop();
            if (this.indent_stack.length == 0) {
              break;
            }
            previous_indent = this.indent_stack.slice(-1)[0];
          }
        }

        const newline: Token = {
          type: TokenType.NEWLINE,
          start_line: this.current_line
        }
        this.last_token_was_newline = true;

        return newline;
      }
    }

    this.last_token_was_newline = false;

    const token = this.tokens[this.current++];
    return token;
  }
}


export class BinaryParser {

  head?: ClassNode;
  current_class: ClassNode | null = null;
  current_function: FunctionNode | null = null;
  current_lambda: LambdaNode | null = null;
  current_suite: SuiteNode | null = null;

  index = 0;

  can_break = false;
  can_continue = false;
  in_lambda = false;
  lambda_ended = false;

  annotation_stack: AnnotationNode[] = [];
  multiline_stack: boolean[] = [];

  current!: Token;
  previous!: Token;

  constructor(private tokenizer: Tokenizer, public script_path: string) {
    registerAnnotations();
  }
  /*
  get current(): Token {
    return {
      ... this.tokens[this.index]
    }
  }
  get previous(): Token { return this.tokens[this.index - 1] }
*/
  advance() {
    this.lambda_ended = false;
    this.previous = this.current;
    this.current = this.tokenizer.scan();
    return this.previous;

  }
  match(type: TokenType) {
    if (this.check(type)) {
      this.advance();
      return true;
    }
    return false;
  }
  get is_multiline(): boolean {
    if (this.multiline_stack.length == 0) {
      return false;
    }
    return this.multiline_stack.slice(-1)[0];
  }
  check(type: TokenType) {
    if (type == TokenType.IDENTIFIER) {
      return is_identifier(this.current.type)
    }
    return this.current.type == type;
  }
  consume(p_token_type: TokenType, p_error_message: string) {
    if (this.match(p_token_type)) {
      return true;
    }
    push_error(p_error_message);
    return false;
  }
  is_at_end() {
    return this.check(TokenType.TK_EOF)
  }
  is_statement_end_token(): boolean {
    return this.check(TokenType.NEWLINE) || this.check(TokenType.SEMICOLON) || this.check(TokenType.TK_EOF);
  }
  is_statement_end(): boolean {
    return !!this.lambda_ended || !!this.in_lambda || this.is_statement_end_token();
  }
  end_statement(p_context: string) {
    let found = false;
    while (this.is_statement_end() && !this.is_at_end()) {
      // Remove sequential newlines/semicolons.
      if (this.is_statement_end_token()) {
        // Only consume if this is an actual token.
        this.advance();
      } else if (this.lambda_ended) {
        this.lambda_ended = false; // Consume this "token".
        found = true;
        break;
      } else {
        if (!found) {
          this.lambda_ended = true; // Mark the lambda as done since we found something else to end the statement.
          found = true;
        }
        break;
      }

      found = true;
    }
    if (!found && !this.is_at_end()) {
      push_error(`(Expected end of statement after ${p_context}, found "${this.current.type}" instead.)`);
    }
  }

  push_multiline(p_state: boolean) {
    this.multiline_stack.push(p_state);
    this.tokenizer.multiline_mode = p_state;
    while (this.current.type == TokenType.NEWLINE || this.current.type == TokenType.INDENT || this.current.type == TokenType.DEDENT) {
      this.current = this.tokenizer.scan();
    }
  }
  pop_multiline() {
    this.multiline_stack.pop();
    this.tokenizer.multiline_mode = this.is_multiline;
  }

  parse() {
    this.current = this.tokenizer.scan();
    this.push_multiline(false); // Keep one for the whole parsing.
    this.parse_program();
    this.pop_multiline();
    return this.head;
  }

  parse_program() {
    const head = this.head = new ClassNode();
    this.current_class = head;
    let can_have_class_or_extends = true;

    const PUSH_PENDING_ANNOTATIONS_TO_HEAD = () => {
      if (this.annotation_stack.length) {
        this.annotation_stack.forEach(annot => {
          head.annotations.push(annot);
        });
        this.annotation_stack.length = 0;
      }
    }

    while (!this.is_at_end()) {
      if (this.match(TokenType.ANNOTATION)) {
        const annotation = this.parse_annotation(AnnotationInfo_TargetKind.SCRIPT | AnnotationInfo_TargetKind.CLASS_LEVEL | AnnotationInfo_TargetKind.STANDALONE);
        if (annotation != null) {
          if (annotation.applies_to(AnnotationInfo_TargetKind.CLASS)) {
            // We do not know in.advance what the annotation will be applied to: the `head` class or the subsequent inner class.
            // If we encounter `class_name`, `extends` or pure `SCRIPT` annotation, then it's `head`, otherwise it's an inner class.
            this.annotation_stack.push(annotation);
          } else if (annotation.applies_to(AnnotationInfo_TargetKind.SCRIPT)) {
            PUSH_PENDING_ANNOTATIONS_TO_HEAD();
            if (annotation.name == ("@tool") || annotation.name == ("@icon")) {
              // Some annotations need to be resolved in the parser.
              annotation.apply(this, head, null); // `head.outer == null`.
            } else {
              head.annotations.push(annotation);
            }
          } else if (annotation.applies_to(AnnotationInfo_TargetKind.STANDALONE)) {
            if (this.previous.type != TokenType.NEWLINE) {
              push_error("(Expected newline after a standalone annotation.)");
            }
            if (annotation.name == ("@export_category") || annotation.name == ("@export_group") || annotation.name == ("@export_subgroup")) {
              head.add_member_group(annotation);
              // This annotation must appear after script-level annotations and `class_name`/`extends`,
              // so we stop looking for script-level stuff.
              can_have_class_or_extends = false;
              break;
            } else {
              // For potential non-group standalone annotations.
              push_error("(Unexpected standalone annotation.)");
            }
          } else {
            this.annotation_stack.push(annotation);
            // This annotation must appear after script-level annotations and `class_name`/`extends`,
            // so we stop looking for script-level stuff.
            can_have_class_or_extends = false;
            break;
          }
        }
      } else {
        break;
      }
    }
    while (can_have_class_or_extends) {
      switch (this.current.type) {
        case TokenType.CLASS_NAME:
          this.advance();
          this.parse_class_name();
          break;
        case TokenType.EXTENDS:
          PUSH_PENDING_ANNOTATIONS_TO_HEAD();
          this.advance();
          this.parse_extends();
          this.end_statement("superclass");
          break;
        case TokenType.TK_EOF:
          PUSH_PENDING_ANNOTATIONS_TO_HEAD();
          can_have_class_or_extends = false;
          break;
        // @ts-ignore fallthrough
        case TokenType.LITERAL:
          const literal = this.current.literal as Constant;
          if (literal.type_s == 'STRING') {
            // Allow strings in class body as multiline comments.
            this.advance();
            if (!this.match(TokenType.NEWLINE)) {
              push_error("Expected newline after comment string.");
            }
            break;
          }/* falls through */
        default:
          can_have_class_or_extends = false;
      }
    }
    this.parse_class_body(true);
    if (!this.check(TokenType.TK_EOF)) {
      push_error("Expected end of file.");
    }
  }

  parse_class(_p_is_static: boolean): ClassNode | null {
    const n_class: ClassNode = new ClassNode();

    const previous_class: ClassNode | null = this.current_class;
    this.current_class = n_class;
    n_class.outer = previous_class;

    if (this.consume(TokenType.IDENTIFIER, '(Expected identifier for the class name after "class".)')) {
      n_class.identifier = this.parse_identifier();
      if (n_class.outer) {
        let fqcn = n_class.outer.fqcn;
        if (fqcn.length == 0) {
          fqcn = canonicalize_path(this.script_path);
        }
        n_class.fqcn = fqcn + "::" + n_class.identifier.name;
      } else {
        n_class.fqcn = n_class.identifier.name;
      }
    }

    if (this.match(TokenType.EXTENDS)) {
      this.parse_extends();
    }

    this.consume(TokenType.COLON, '(Expected ":" after class declaration.)');

    const multiline: boolean = this.match(TokenType.NEWLINE);

    if (multiline && !this.consume(TokenType.INDENT, '(Expected indented block after class declaration.)')) {
      this.current_class = previous_class;

      return n_class;
    }

    if (this.match(TokenType.EXTENDS)) {
      if (n_class.extends_used) {
        push_error('(Cannot use "extends" more than once in the same class.)');
      }
      this.parse_extends();
      this.end_statement("superclass");
    }

    this.parse_class_body(multiline);
    if (multiline) {
      this.consume(TokenType.DEDENT, '(Missing unindent at the end of the class body.)');
    }

    this.current_class = previous_class;
    return n_class;
  }

  parse_class_name() {
    const current_class = tryOrThrow(this.current_class);

    if (this.consume(TokenType.IDENTIFIER, "expected identifier for the global class name after 'class_name'")) {
      current_class.identifier = tryOrThrow(this.parse_identifier());
      current_class.fqcn = current_class.identifier.name;
    }

    if (this.match(TokenType.EXTENDS)) {
      // Allow extends on the same line.
      this.parse_extends();
      this.end_statement("superclass");
    } else {
      this.end_statement("class_name statement");
    }
  }
  parse_extends() {
    const current_class = tryOrThrow(this.current_class);
    current_class.extends_used = true;

    if (this.match(TokenType.LITERAL)) {
      const literal = this.previous.literal as Constant;
      if (literal.type_s != 'STRING') {
        push_error(`(Only strings or identifiers can be used after "extends", found "${literal.type_s}" instead.)`);
      }
      current_class.extends_path = literal.val as string;

      if (!this.match(TokenType.PERIOD)) {
        return;
      }
    }

    if (!this.consume(TokenType.IDENTIFIER, '(Expected superclass name after "extends".)')) {
      return;
    }
    current_class.extends.push(this.parse_identifier());

    while (this.match(TokenType.PERIOD)) {
      if (!this.consume(TokenType.IDENTIFIER, '(Expected superclass name after ".".)')) {
        return;
      }
      current_class.extends.push(this.parse_identifier());
    }
  }

  parse_class_member<T extends Exclude<ClassMemberSource, AnnotationNode | EnumValue | undefined>>(p_parse_function: (is_static: boolean) => T | null, p_target: AnnotationInfo_TargetKind, p_member_kind: string, p_is_static: boolean = false) {
    p_parse_function = p_parse_function.bind(this);
    this.advance();

    // Consume annotations.
    const annotations: AnnotationNode[] = [];
    while (this.annotation_stack.length) {
      const last_annotation = this.annotation_stack[this.annotation_stack.length - 1];
      if (last_annotation.applies_to(p_target)) {
        annotations.push(last_annotation);
        this.annotation_stack.pop();
      } else {
        push_error("(Annotation " + last_annotation.name + " cannot be applied to a " + p_member_kind + ".)");
        this.clear_unused_annotations();
      }
    }

    const member = p_parse_function(p_is_static);
    if (member == null) {
      return;
    }
    annotations.forEach(annotation => {
      member.annotations.push(annotation);
    })
    if (member.identifier != null) {
      if (member.identifier.name.length) { // Enums may be unnamed.
        if (this.current_class!.members_indices.has(member.identifier.name)) {
          push_error(`(${p_member_kind.toUpperCase()
            } "${member.identifier.name}" has the same name as a previously declared ${this.current_class!.get_member(member.identifier.name).get_type_name()
            }.)`);
        } else {
          this.current_class!.add_member(member);
        }
      } else {
        this.current_class!.add_member(member);
      }
    }
  }
  parse_class_body(p_is_multiline: boolean) {
    const current_class = tryOrThrow(this.current_class);

    let class_end = false;
    let next_is_static = false;

    while (!class_end && !this.is_at_end()) {
      let token: Token = this.current;
      switch (token.type) {
        case TokenType.VAR:
          this.parse_class_member(this.parse_variable, AnnotationInfo_TargetKind.VARIABLE, "variable", next_is_static);
          if (next_is_static) {
            current_class.has_static_data = true;
          }
          break;
        case TokenType.CONST:
          this.parse_class_member(this.parse_constant, AnnotationInfo_TargetKind.CONSTANT, "constant");
          break;
        case TokenType.SIGNAL:
          this.parse_class_member(this.parse_signal, AnnotationInfo_TargetKind.SIGNAL, "signal");
          break;
        case TokenType.FUNC:
          this.parse_class_member(this.parse_function, AnnotationInfo_TargetKind.FUNCTION, "function", next_is_static);
          break;
        case TokenType.CLASS:
          this.parse_class_member(this.parse_class, AnnotationInfo_TargetKind.CLASS, "class");
          break;
        case TokenType.ENUM:
          this.parse_class_member(this.parse_enum, AnnotationInfo_TargetKind.NONE, "enum");
          break;
        case TokenType.STATIC: {
          this.advance();
          next_is_static = true;
          if (!this.check(TokenType.FUNC) && !this.check(TokenType.VAR)) {
            push_error(`(Expected "func" or "var" after "static".)`);
          }
        } break;
        case TokenType.ANNOTATION: {
          this.advance();

          // Check for class-level and standalone annotations.
          const annotation = this.parse_annotation(AnnotationInfo_TargetKind.CLASS_LEVEL | AnnotationInfo_TargetKind.STANDALONE);
          if (annotation != null) {
            if (annotation.applies_to(AnnotationInfo_TargetKind.STANDALONE)) {
              if (annotation.name == "@export_category" || annotation.name == "@export_group" || annotation.name == "@export_subgroup") {
                current_class.add_member_group(annotation);
              } else {
                // For potential non-group standalone annotations.
                push_error("(Unexpected standalone annotation.)");
              }
            } else { // `AnnotationInfo_TargetKind.CLASS_LEVEL`.
              this.annotation_stack.push(annotation);
            }
          }
          break;
        }
        case TokenType.PASS:
          this.advance();
          this.end_statement(`("pass")`);
          break;
        case TokenType.DEDENT:
          class_end = true;
          break;
        // @ts-ignore
        case TokenType.LITERAL:
          const literal = this.current.literal as Constant;
          if (literal.type_s == "STRING") {
            // Allow strings in class body as multiline comments.
            this.advance();
            if (!this.match(TokenType.NEWLINE)) {
              push_error("Expected newline after comment string.");
            }
            break;
          }
        /* fallthrough */
        default:
          // Display a completion with identifiers.
          push_error("(Unexpected " + this.current.type + " in class body.)");
          this.advance();
          break;
      }
      if (token.type != TokenType.STATIC) {
        next_is_static = false;
      }
      if (!p_is_multiline) {
        class_end = true;
      }
    }
  }

  parse_variable(p_is_static: boolean, p_allow_property = true) {
    const variable = new VariableNode();

    if (!this.consume(TokenType.IDENTIFIER, "(Expected variable name after \"var\".)")) {
      return null;
    }

    variable.identifier = this.parse_identifier();
    variable.export_info.name = variable.identifier.name;
    variable.is_static = p_is_static;

    if (this.match(TokenType.COLON)) {
      if (this.check(TokenType.NEWLINE)) {
        if (p_allow_property) {
          this.advance();
          return this.parse_property(variable, true);
        } else {
          push_error("(Expected type after ':')");
          return null;
        }
      } else if (this.check((TokenType.EQUAL))) {
        // Infer type.
        variable.infer_datatype = true;
      } else {
        if (p_allow_property) {
          if (this.check(TokenType.IDENTIFIER)) {
            // Check if get or set.
            if (get_identifier(this.current) == "get" || get_identifier(this.current) == "set") {
              return this.parse_property(variable, false);
            }
          }
        }

        // Parse type.
        variable.datatype_specifier = this.parse_type();
      }
    }

    if (this.match(TokenType.EQUAL)) {
      // Initializer.
      variable.initializer = this.parse_expression(false);
      if (variable.initializer == null) {
        push_error('(Expected expression for variable initial value after "=".)');
      }
      variable.assignments++;
    }

    if (p_allow_property && this.match(TokenType.COLON)) {
      if (this.match(TokenType.NEWLINE)) {
        return this.parse_property(variable, true);
      } else {
        return this.parse_property(variable, false);
      }
    }

    this.end_statement("variable declaration");

    return variable;
  }
  parse_property(p_variable: VariableNode, p_need_indent: boolean): VariableNode | null {
    if (p_need_indent) {
      if (!this.consume(TokenType.INDENT, '(Expected indented block for property after ":".)')) {
        return null;
      }
    }

    let property: VariableNode = p_variable;

    if (!this.consume(TokenType.IDENTIFIER, '(Expected "get" or "set" for property declaration.)')) {
      return null;
    }

    let _function: IdentifierNode = this.parse_identifier();

    if (this.check(TokenType.EQUAL)) {
      p_variable.property = VariableNode_PropertyStyle.PROP_SETGET;
    } else {
      p_variable.property = VariableNode_PropertyStyle.PROP_INLINE;
      if (!p_need_indent) {
        push_error("Property with inline code must go to an indented block.");
      }
    }

    let getter_used: boolean = false;
    let setter_used: boolean = false;

    // Run with a loop because order doesn't matter.
    for (let i = 0; i < 2; i++) {
      if (_function.name == ("set")) {
        if (setter_used) {
          push_error('(Properties can only have one setter.)');
        } else {
          this.parse_property_setter(property);
          setter_used = true;
        }
      } else if (_function.name == ("get")) {
        if (getter_used) {
          push_error('(Properties can only have one getter.)');
        } else {
          this.parse_property_getter(property);
          getter_used = true;
        }
      } else {
        // TODO: Update message to only have the missing one if it's the case.
        push_error('(Expected "get" or "set" for property declaration.)');
      }

      if (i == 0 && p_variable.property == VariableNode_PropertyStyle.PROP_SETGET) {
        if (this.match(TokenType.COMMA)) {
          // Consume potential newline.
          if (this.match(TokenType.NEWLINE)) {
            if (!p_need_indent) {
              push_error('(Inline setter/getter setting cannot span across multiple lines (use "\\"" if needed).)');
            }
          }
        } else {
          break;
        }
      }

      if (!this.match(TokenType.IDENTIFIER)) {
        break;
      }
      _function = this.parse_identifier();
    }

    if (p_variable.property == VariableNode_PropertyStyle.PROP_SETGET) {
      this.end_statement("property declaration");
    }

    if (p_need_indent) {
      this.consume(TokenType.DEDENT, '(Expected end of indented block for property.)');
    }
    return property;
  }
  parse_property_setter(p_variable: VariableNode): void {
    switch (p_variable.property) {
      case VariableNode_PropertyStyle.PROP_INLINE: {
        const _function: FunctionNode = new FunctionNode();
        const identifier: IdentifierNode = new IdentifierNode();

        identifier.name = "@" + p_variable.identifier!.name + "_setter";
        _function.identifier = identifier;
        _function.is_static = p_variable.is_static;

        this.consume(TokenType.PARENTHESIS_OPEN, '(Expected "(" after "set".)');

        const parameter: ParameterNode = new ParameterNode();
        if (this.consume(TokenType.IDENTIFIER, '(Expected parameter name after "(".)')) {
          p_variable.setter_parameter = this.parse_identifier();
          parameter.identifier = p_variable.setter_parameter;
          _function.parameters_indices.set(parameter.identifier.name, 0);
          _function.parameters.push(parameter);
        }
        this.consume(TokenType.PARENTHESIS_CLOSE, '*(Expected ")" after parameter name.)*');
        this.consume(TokenType.COLON, '*(Expected ":" after ")".)*');

        const previous_function: FunctionNode = this.current_function!;
        this.current_function = _function;
        if (p_variable.setter_parameter != null) {
          const body: SuiteNode = new SuiteNode();
          body.add_local(parameter, _function);
          _function.body = this.parse_suite("setter declaration", body);
          p_variable.setter = _function;
        }
        this.current_function = previous_function;

        break;
      }
      case VariableNode_PropertyStyle.PROP_SETGET:
        this.consume(TokenType.EQUAL, '(Expected "=" after "set")');

        if (this.consume(TokenType.IDENTIFIER, '(Expected setter function name after "=".)')) {
          p_variable.setter = this.parse_identifier();
        }
        break;
      case VariableNode_PropertyStyle.PROP_NONE:
        break; // Unreachable.
    }
  }
  parse_property_getter(p_variable: VariableNode): void {
    switch (p_variable.property) {
      case VariableNode_PropertyStyle.PROP_INLINE: {
        const _function: FunctionNode = new FunctionNode();

        if (this.match(TokenType.PARENTHESIS_OPEN)) {
          this.consume(TokenType.PARENTHESIS_CLOSE, '*(Expected ")" after "get(".)*');
          this.consume(TokenType.COLON, '*(Expected ":" after "get()".)*');
        } else {
          this.consume(TokenType.COLON, '(Expected ":" or "(" after "get".)');
        }

        const identifier: IdentifierNode = new IdentifierNode();

        identifier.name = "@" + p_variable.identifier!.name + "_getter";
        _function.identifier = identifier;
        _function.is_static = p_variable.is_static;

        const previous_function: FunctionNode = this.current_function!;
        this.current_function = _function;

        const body: SuiteNode = new SuiteNode();
        _function.body = this.parse_suite("getter declaration", body);
        p_variable.getter = _function;

        this.current_function = previous_function;

        break;
      }
      case VariableNode_PropertyStyle.PROP_SETGET:
        this.consume(TokenType.EQUAL, '(Expected "=" after "get")');

        if (this.consume(TokenType.IDENTIFIER, '(Expected getter function name after "=".)')) {
          p_variable.getter = this.parse_identifier();
        }
        break;
      case VariableNode_PropertyStyle.PROP_NONE:
        break; // Unreachable.
    }
  }

  parse_constant(_p_is_static: boolean): ConstantNode | null {
    const constant: ConstantNode = new ConstantNode();

    if (!this.consume(TokenType.IDENTIFIER, '(Expected constant name after "const".)')) {
      return null;
    }

    constant.identifier = this.parse_identifier();

    if (this.match(TokenType.COLON)) {
      if (this.check((TokenType.EQUAL))) {
        // Infer type.
        constant.infer_datatype = true;
      } else {
        // Parse type.
        constant.datatype_specifier = this.parse_type();
      }
    }

    if (this.consume(TokenType.EQUAL, '(Expected initializer after constant name.)')) {
      // Initializer.
      constant.initializer = this.parse_expression(false);

      if (constant.initializer == null) {
        push_error('(Expected initializer expression for constant.)');

        return null;
      }
    } else {

      return null;
    }
    this.end_statement("constant declaration");

    return constant;
  }
  parse_parameter(): ParameterNode | null {
    if (!this.consume(TokenType.IDENTIFIER, '(Expected parameter name.)')) {
      return null;
    }

    const parameter: ParameterNode = new ParameterNode();
    parameter.identifier = this.parse_identifier();

    if (this.match(TokenType.COLON)) {
      if (this.check((TokenType.EQUAL))) {
        // Infer type.
        parameter.infer_datatype = true;
      } else {
        // Parse type.

        parameter.datatype_specifier = this.parse_type();
      }
    }

    if (this.match(TokenType.EQUAL)) {
      // Default value.
      parameter.initializer = this.parse_expression(false);
    }
    return parameter;
  }
  parse_signal(_p_is_static: boolean): SignalNode | null {
    const signal: SignalNode = new SignalNode();

    if (!this.consume(TokenType.IDENTIFIER, '(Expected signal name after "signal".)')) {

      return null;
    }

    signal.identifier = this.parse_identifier();

    if (this.check(TokenType.PARENTHESIS_OPEN)) {
      this.push_multiline(true);
      this.advance();
      do {
        if (this.check(TokenType.PARENTHESIS_CLOSE)) {
          // Allow for trailing comma.
          break;
        }

        const parameter: ParameterNode | null = this.parse_parameter();
        if (parameter == null) {
          push_error("Expected signal parameter name.");
          break;
        }
        if (parameter.initializer != null) {
          push_error('(Signal parameters cannot have a default value.)');
        }
        if (signal.parameters_indices.has(parameter.identifier!.name)) {
          push_error(vformat('(Parameter with name "%s" was already declared for this signal.)', parameter.identifier!.name));
        } else {
          signal.parameters_indices.set(parameter.identifier!.name, signal.parameters.length);
          signal.parameters.push(parameter);
        }
      } while (this.match(TokenType.COMMA) && !this.is_at_end());
      this.pop_multiline();
      this.consume(TokenType.PARENTHESIS_CLOSE, '*(Expected closing ")" after signal parameters.)*');
    }

    this.end_statement("signal declaration");

    return signal;
  }
  parse_enum(_p_is_static: boolean): EnumNode | null {
    const enum_node: EnumNode = new EnumNode();
    let named: boolean = false;

    if (this.match(TokenType.IDENTIFIER)) {
      enum_node.identifier = this.parse_identifier();
      named = true;
    }

    this.push_multiline(true);
    this.consume(TokenType.BRACE_OPEN, vformat('(Expected "{" after %s.)', named ? "enum name" : '("enum")'));

    const elements: Map<string, number> = new Map();

    do {
      if (this.check(TokenType.BRACE_CLOSE)) {
        break; // Allow trailing comma.
      }
      if (this.consume(TokenType.IDENTIFIER, '(Expected identifier for enum key.)')) {
        const identifier: IdentifierNode = this.parse_identifier();

        const item = new EnumValue();
        item.identifier = identifier;
        item.parent_enum = enum_node;
        item.line = this.previous.start_line;

        if (elements.has(item.identifier.name)) {
          push_error(vformat('(Name "%s" was already in this enum (at line %d).)', item.identifier.name, elements.get(item.identifier.name)), item.identifier);
        } else if (!named) {
          if (this.current_class!.members_indices.has(item.identifier.name)) {
            push_error(vformat('(Name "%s" is already used as a class %s.)', item.identifier.name, this.current_class!.get_member(item.identifier.name).get_type_name()));
          }
        }

        elements.set(item.identifier.name, item.line);

        if (this.match(TokenType.EQUAL)) {
          const value: ExpressionNode | null = this.parse_expression(false);
          if (value == null) {
            push_error('(Expected expression value after "=".)');
          }
          item.custom_value = value;
        }

        item.index = enum_node.values.length;
        enum_node.values.push(item);
        if (!named) {
          // Add as member of this.current class.
          this.current_class!.add_member(item);
        }
      }
    } while (this.match(TokenType.COMMA));

    this.pop_multiline();
    this.consume(TokenType.BRACE_CLOSE, '(Expected closing "}" for enum.)');

    this.end_statement("enum");

    return enum_node;
  }
  parse_function_signature(p_function: FunctionNode, p_body: SuiteNode, p_type: string): void {
    if (!this.check(TokenType.PARENTHESIS_CLOSE) && !this.is_at_end()) {
      let default_used: boolean = false;
      do {
        if (this.check(TokenType.PARENTHESIS_CLOSE)) {
          // Allow for trailing comma.
          break;
        }
        const parameter: ParameterNode | null = this.parse_parameter();
        if (parameter == null) {
          break;
        }
        if (parameter.initializer != null) {
          default_used = true;
        } else {
          if (default_used) {
            push_error("Cannot have mandatory parameters after optional parameters.");
            continue;
          }
        }
        if (p_function.parameters_indices.has(parameter.identifier!.name)) {
          push_error(vformat('(Parameter with name "%s" was already declared for this %s.)', parameter.identifier!.name, p_type));
        } else {
          p_function.parameters_indices.set(parameter.identifier!.name, p_function.parameters.length);
          p_function.parameters.push(parameter);
          p_body.add_local(parameter, this.current_function);
        }
      } while (this.match(TokenType.COMMA));
    }

    this.pop_multiline();
    this.consume(TokenType.PARENTHESIS_CLOSE, vformat('*(Expected closing ")" after %s parameters.)*', p_type));

    if (this.match(TokenType.FORWARD_ARROW)) {

      p_function.return_type = this.parse_type(true);
      if (p_function.return_type == null) {
        push_error('(Expected return type or "void" after ".".)');
      }
    }

    if (!p_function.source_lambda && p_function.identifier && p_function.identifier.name == '_static_init') {
      if (!p_function.is_static) {
        push_error('(Static constructor must be declared static.)');
      }
      if (p_function.parameters.length != 0) {
        push_error('(Static constructor cannot have parameters.)');
      }
      this.current_class!.has_static_data = true;
    }

    // TODO: Improve token consumption so it synchronizes to a statement boundary. This way we can get into the function body with unrecognized tokens.
    this.consume(TokenType.COLON, vformat('(Expected ":" after %s declaration.)', p_type));
  }
  parse_function(p_is_static: boolean): FunctionNode | null {
    const _function: FunctionNode = new FunctionNode();

    if (!this.consume(TokenType.IDENTIFIER, '(Expected function name after "func".)')) {
      return null;
    }

    const previous_function: FunctionNode | null = this.current_function;
    this.current_function = _function;

    _function.identifier = this.parse_identifier();
    _function.is_static = p_is_static;

    const body: SuiteNode = new SuiteNode();
    const previous_suite: SuiteNode | null = this.current_suite;
    this.current_suite = body;

    this.push_multiline(true);
    this.consume(TokenType.PARENTHESIS_OPEN, '(Expected opening "(" after function name.)');
    this.parse_function_signature(_function, body, "function");

    this.current_suite = previous_suite;
    _function.body = this.parse_suite("function declaration", body);

    this.current_function = previous_function;

    return _function;
  }
  parse_annotation(p_valid_targets: number): AnnotationNode | null {
    const annotation: AnnotationNode = new AnnotationNode()
    annotation.name = this.previous.literal as string;

    if (!annotation.applies_to(p_valid_targets)) {
      if (annotation.applies_to(AnnotationInfo_TargetKind.SCRIPT)) {
        push_error(vformat('(Annotation "%s" must be at the top of the script, before "extends" and "class_name".)', annotation.name));
      } else {
        push_error(vformat('(Annotation "%s" is not allowed in this level.)', annotation.name));
      }
    }

    if (this.check(TokenType.PARENTHESIS_OPEN)) {
      this.push_multiline(true);
      this.advance();

      do {
        if (this.check(TokenType.PARENTHESIS_CLOSE)) {
          break;
        }
        const argument = this.parse_expression(false)
        if (argument == null) {
          push_error("Expected expression as the annotation argument.");
        } else {
          annotation.arguments.push(argument);
        }
      } while (this.match(TokenType.COMMA) && !this.is_at_end())
    }
    this.pop_multiline();
    this.match(TokenType.NEWLINE)
    return annotation;
  }
  clear_unused_annotations() {
    this.annotation_stack.length = 0;
  }
  parse_suite(p_context: string, p_suite: SuiteNode | null = null, p_for_lambda: boolean = false): SuiteNode | null {
    const suite: SuiteNode = p_suite != null ? p_suite : new SuiteNode();
    suite.parent_block = this.current_suite!;
    suite.parent_function = this.current_function;
    this.current_suite = suite;

    if (!p_for_lambda && suite.parent_block != null && suite.parent_block.is_in_loop) {
      // Do not reset to false if true is set before calling this.parse_suite().
      suite.is_in_loop = true;
    }

    let multiline: boolean = false;

    if (this.match(TokenType.NEWLINE)) {
      multiline = true;
    }

    if (multiline) {
      if (!this.consume(TokenType.INDENT, `(Expected indented block after ${p_context}.)`)) {
        this.current_suite = suite.parent_block;

        return suite;
      }
    }

    let error_count = 0;

    do {
      if (this.is_at_end() || (!multiline && this.previous.type == TokenType.SEMICOLON && this.check(TokenType.NEWLINE))) {
        break;
      }
      const statement: Node | null = this.parse_statement();
      if (statement == null) {
        if (error_count++ > 100) {
          push_error("Too many statement errors.");
          break;
        }
        continue;
      }
      suite.statements.push(statement);

      // Register locals.
      switch (statement.type) {
        case Type.VARIABLE: {
          const variable: VariableNode = statement as VariableNode;
          const local: SuiteNode_Local = this.current_suite.get_local(variable.identifier!.name);
          if (local.type != SuiteNode_Local_Type.UNDEFINED) {
            push_error(vformat('(There is already a %s named "%s" declared in this scope.)', local.get_name(), variable.identifier!.name), variable.identifier);
          }
          this.current_suite.add_local(variable, this.current_function);
          break;
        }
        case Type.CONSTANT: {
          const constant: ConstantNode = statement as ConstantNode;
          const local: SuiteNode_Local = this.current_suite.get_local(constant.identifier!.name);
          if (local.type != SuiteNode_Local_Type.UNDEFINED) {
            let name: string;
            if (local.type == SuiteNode_Local_Type.CONSTANT) {
              name = "constant";
            } else {
              name = "variable";
            }
            push_error(vformat('(There is already a %s named "%s" declared in this scope.)', name, constant.identifier!.name), constant.identifier);
          }
          this.current_suite.add_local(constant, this.current_function);
          break;
        }
        default:
          break;
      }

    } while ((multiline || this.previous.type == TokenType.SEMICOLON) && !this.check(TokenType.DEDENT) && !this.lambda_ended && !this.is_at_end());
    if (multiline) {
      if (!this.lambda_ended) {
        this.consume(TokenType.DEDENT, vformat('(Missing unindent at the end of %s.)', p_context));

      } else {
        this.match(TokenType.DEDENT);
      }
    } else if (this.previous.type == TokenType.SEMICOLON) {
      this.consume(TokenType.NEWLINE, vformat('(Expected newline after ";" at the end of %s.)', p_context));
    }

    if (p_for_lambda) {
      this.lambda_ended = true;
    }
    this.current_suite = suite.parent_block;
    return suite;
  }
  parse_statement(): Node | null {
    let result: Node | null = null;
    const annotations: AnnotationNode[] = [];
    if (this.current.type != TokenType.ANNOTATION) {
      while (this.annotation_stack.length != 0) {
        const last_annotation: AnnotationNode = this.annotation_stack.slice(-1)[0];
        if (last_annotation.applies_to(AnnotationInfo_TargetKind.STATEMENT)) {
          annotations.unshift(last_annotation);
          this.annotation_stack.pop();
        } else {
          push_error(vformat('(Annotation "%s" cannot be applied to a statement.)', last_annotation.name));
          this.clear_unused_annotations();
        }
      }
    }
    switch (this.current.type) {
      case TokenType.PASS:
        this.advance();
        result = new PassNode();
        this.end_statement('("pass")');
        break;
      case TokenType.VAR:
        this.advance();
        result = this.parse_variable(false, false);
        break;
      case TokenType.CONST:
        this.advance();
        result = this.parse_constant(false);
        break;
      case TokenType.IF:
        this.advance();
        result = this.parse_if();
        break;
      case TokenType.FOR:
        this.advance();
        result = this.parse_for();
        break;
      case TokenType.WHILE:
        this.advance();
        result = this.parse_while();
        break;
      case TokenType.MATCH:
        this.advance();
        result = this.parse_match();
        break;
      case TokenType.BREAK:
        this.advance();
        result = this.parse_break();
        break;
      case TokenType.CONTINUE:
        this.advance();
        result = this.parse_continue();
        break;
      case TokenType.RETURN: {
        this.advance();
        const n_return: ReturnNode = new ReturnNode();
        if (!this.is_statement_end()) {
          if (this.current_function && (this.current_function.identifier!.name == '_init' || this.current_function.identifier!.name == '_static_init')) {
            push_error('(Constructor cannot return a value.)');
          }
          n_return.return_value = this.parse_expression(false);
        } else if (this.in_lambda && !this.is_statement_end_token()) {
          // Try to parse it anyway as this might not be the statement end in a lambda.
          // If this fails the expression will be null, but that's the same as no return, so it's fine.
          n_return.return_value = this.parse_expression(false);
        }

        result = n_return;

        this.current_suite!.has_return = true;

        this.end_statement("return statement");
        break;
      }
      case TokenType.BREAKPOINT:
        this.advance();
        result = new BreakpointNode();

        this.end_statement('("breakpoint")');
        break;
      case TokenType.ASSERT:
        this.advance();
        result = this.parse_assert();
        break;
      case TokenType.ANNOTATION: {
        this.advance();
        const annotation: AnnotationNode | null = this.parse_annotation(AnnotationInfo_TargetKind.STATEMENT);
        if (annotation != null) {
          this.annotation_stack.push(annotation);
        }
        break;
      }
      default: {
        // Expression statement.
        const expression: ExpressionNode | null = this.parse_expression(true); // Allow assignment here.
        let has_ended_lambda: boolean = false;
        if (expression == null) {
          if (this.in_lambda) {
            // If it's not a valid expression beginning, it might be the continuation of the outer expression where this lambda is.
            this.lambda_ended = true;
            has_ended_lambda = true;
          } else {
            this.advance();
            push_error(vformat('(Expected statement, found "%s" instead.)', this.previous.type));
          }
        } else {
          this.end_statement("expression");
        }
        this.lambda_ended = this.lambda_ended || has_ended_lambda;
        result = expression;

        break;
      }
    }

    if (result != null && !(annotations.length == 0)) {
      annotations.forEach(annotation => {
        result.annotations.push(annotation);
      })
    }

    return result;
  }

  parse_assert(): AssertNode | null {
    // TODO: Add assert message.
    const assert: AssertNode = new AssertNode();

    this.push_multiline(true);
    this.consume(TokenType.PARENTHESIS_OPEN, '(Expected "(" after "assert".)');

    assert.condition = this.parse_expression(false);
    if (assert.condition == null) {
      push_error("Expected expression to assert.");
      return null;
    }

    if (this.match(TokenType.COMMA) && !this.check(TokenType.PARENTHESIS_CLOSE)) {
      assert.message = this.parse_expression(false);
      if (assert.message == null) {
        push_error('(Expected error message for assert after ",".)');
        this.pop_multiline();
        return null;
      }
      this.match(TokenType.COMMA);
    }
    this.pop_multiline();
    this.consume(TokenType.PARENTHESIS_CLOSE, '*(Expected ")" after assert expression.)*');
    this.end_statement('("assert")');

    return assert;
  }
  parse_break(): BreakNode {
    if (!this.can_break) {
      push_error('(Cannot use "break" outside of a loop.)');
    }
    const break_node: BreakNode = new BreakNode();

    this.end_statement('("break")');
    return break_node;
  }
  parse_continue(): ContinueNode {
    if (!this.can_continue) {
      push_error('(Cannot use "continue" outside of a loop.)');
    }
    this.current_suite!.has_continue = true;
    const cont: ContinueNode = new ContinueNode();

    this.end_statement('("continue")');
    return cont;
  }
  parse_for(): ForNode {
    const n_for: ForNode = new ForNode();

    if (this.consume(TokenType.IDENTIFIER, '(Expected loop variable name after "for".)')) {
      n_for.variable = this.parse_identifier();
    }

    if (this.match(TokenType.COLON)) {
      n_for.datatype_specifier = this.parse_type();
      if (n_for.datatype_specifier == null) {
        push_error('(Expected type specifier after ":".)');
      }
    }

    if (n_for.datatype_specifier == null) {
      this.consume(TokenType.IN, '(Expected "in" or ":" after "for" variable name.)');
    } else {
      this.consume(TokenType.IN, '(Expected "in" after "for" variable type specifier.)');
    }

    n_for.list = this.parse_expression(false);

    if (!n_for.list) {
      push_error('(Expected iterable after "in".)');
    }

    this.consume(TokenType.COLON, '(Expected ":" after "for" condition.)');

    // Save break/continue state.
    let could_break: boolean = this.can_break;
    let could_continue: boolean = this.can_continue;

    // Allow break/continue.
    this.can_break = true;
    this.can_continue = true;

    const suite: SuiteNode = new SuiteNode();
    if (n_for.variable) {
      const local = this.current_suite!.get_local(n_for.variable.name);
      if (local.type != SuiteNode_Local_Type.UNDEFINED) {
        push_error(vformat('(There is already a %s named "%s" declared in this scope.)', local.get_name(), n_for.variable.name), n_for.variable);
      }
      suite.add_local(new SuiteNode_Local(n_for.variable, this.current_function));
    }
    suite.is_in_loop = true;
    n_for.loop = this.parse_suite('("for" block)', suite);
    // Reset break/continue state.
    this.can_break = could_break;
    this.can_continue = could_continue;

    return n_for;
  }
  parse_if(p_token: string = "if"): IfNode | null {
    const n_if: IfNode = new IfNode();

    n_if.condition = this.parse_expression(false);
    if (n_if.condition == null) {
      push_error(vformat('(Expected conditional expression after "%s".)', p_token));
    }

    this.consume(TokenType.COLON, vformat('(Expected ":" after "%s" condition.)', p_token));

    n_if.true_block = this.parse_suite(vformat('("%s" block)', p_token));
    n_if.true_block!.parent_if = n_if;

    if (n_if.true_block!.has_continue) {
      this.current_suite!.has_continue = true;
    }

    if (this.match(TokenType.ELIF)) {
      const else_block: SuiteNode = new SuiteNode();
      else_block.parent_function = this.current_function;
      else_block.parent_block = this.current_suite;

      const previous_suite: SuiteNode | null = this.current_suite;
      this.current_suite = else_block;

      const elif: IfNode = this.parse_if("elif")!;
      else_block.statements.push(elif);

      n_if.false_block = else_block;

      this.current_suite = previous_suite;
    } else if (this.match(TokenType.ELSE)) {
      this.consume(TokenType.COLON, '(Expected ":" after "else".)');
      n_if.false_block = this.parse_suite('("else" block)');
    }
    if (n_if.false_block != null && n_if.false_block.has_return && n_if.true_block!.has_return) {
      this.current_suite!.has_return = true;
    }
    if (n_if.false_block != null && n_if.false_block.has_continue) {
      this.current_suite!.has_continue = true;
    }

    return n_if;
  }
  parse_match(): MatchNode {
    const match_node: MatchNode = new MatchNode();

    match_node.test = this.parse_expression(false);
    if (match_node.test == null) {
      push_error('(Expected expression to test after "this.match".)');
    }

    this.consume(TokenType.COLON, '(Expected ":" after "this.match" expression.)');
    this.consume(TokenType.NEWLINE, '(Expected a newline after "this.match" statement.)');

    if (!this.consume(TokenType.INDENT, '(Expected an indented block after "this.match" statement.)')) {

      return match_node;
    }

    let all_have_return: boolean = true;
    let have_wildcard: boolean = false;

    const match_branch_annotation_stack: AnnotationNode[] = [];

    while (!this.check(TokenType.DEDENT) && !this.is_at_end()) {
      if (this.match(TokenType.PASS)) {
        this.consume(TokenType.NEWLINE, '(Expected newline after "pass".)');
        continue;
      }

      if (this.match(TokenType.ANNOTATION)) {
        const annotation: AnnotationNode | null = this.parse_annotation(AnnotationInfo_TargetKind.STATEMENT);
        if (annotation == null) {
          continue;
        }
        if (annotation.name != ("@warning_ignore")) {
          push_error(vformat('(Annotation "%s" is not allowed in this level.)', annotation.name), annotation);
          continue;
        }
        match_branch_annotation_stack.push(annotation);
        continue;
      }

      const branch: MatchBranchNode | null = this.parse_match_branch();
      if (branch == null) {
        this.advance();
        continue;
      }

      match_branch_annotation_stack.forEach((annotation: AnnotationNode) => {
        branch.annotations.push(annotation);
      })
      match_branch_annotation_stack.length = 0;

      have_wildcard = have_wildcard || branch.has_wildcard;
      all_have_return = all_have_return && branch.block!.has_return;
      match_node.branches.push(branch);
    }
    this.consume(TokenType.DEDENT, '(Expected an indented block after "this.match" statement.)');

    if (all_have_return && have_wildcard) {
      this.current_suite!.has_return = true;
    }

    match_branch_annotation_stack.forEach((annotation: AnnotationNode) => {
      push_error(vformat('(Annotation "%s" does not precede a valid target, so it will have no effect.)', annotation.name), annotation);
    });
    match_branch_annotation_stack.length = 0;

    return match_node;
  }
  parse_match_branch(): MatchBranchNode | null {
    const branch: MatchBranchNode = new MatchBranchNode();
    let has_bind: boolean = false;

    do {
      const pattern: PatternNode | null = this.parse_match_pattern();
      if (pattern == null) {
        continue;
      }
      if (pattern.binds.size > 0) {
        has_bind = true;
      }
      if (branch.patterns.length > 0 && has_bind) {
        push_error('(Cannot use a variable bind with multiple patterns.)');
      }
      if (pattern.pattern_type == PatternNode_Type.PT_REST) {
        push_error('(Rest pattern can only be used inside array and dictionary patterns.)');
      } else if (pattern.pattern_type == PatternNode_Type.PT_BIND || pattern.pattern_type == PatternNode_Type.PT_WILDCARD) {
        branch.has_wildcard = true;
      }
      branch.patterns.push(pattern);
    } while (this.match(TokenType.COMMA));

    if (branch.patterns.length == 0) {
      push_error('(No pattern found for "this.match" branch.)');
    }

    let has_guard: boolean = false;
    if (this.match(TokenType.WHEN)) {
      // Pattern guard.
      // Create block for guard because it also needs to access the bound variables from patterns, and we don't want to add them to the outer scope.
      branch.guard_body = new SuiteNode();
      if (branch.patterns.length > 0) {
        [...branch.patterns[0].binds.entries()].map(([key, value]) => ({ key, value })).forEach((E) => {
          const local = new SuiteNode_Local(E.value, this.current_function);
          local.type = SuiteNode_Local_Type.PATTERN_BIND;
          branch.guard_body!.add_local(local);
        });
      }

      const parent_block: SuiteNode | null = this.current_suite;
      branch.guard_body.parent_block = parent_block;
      this.current_suite = branch.guard_body;

      const guard: ExpressionNode | null = this.parse_expression(false);
      if (guard == null) {
        push_error('(Expected expression for pattern guard after "when".)');
      } else {
        branch.guard_body.statements.push(guard);
      }
      this.current_suite = parent_block;
      has_guard = true;
      branch.has_wildcard = false; // If it has a guard, the wildcard might still not this.match.
    }

    if (!this.consume(TokenType.COLON, vformat('(Expected ":"%s after "this.match" %s.)', has_guard ? "" : '( or "when")', has_guard ? "pattern guard" : "patterns"))) {
      return null;
    }

    const suite: SuiteNode = new SuiteNode();
    if (branch.patterns.length > 0) {
      [...branch.patterns[0].binds.entries()].map(([key, value]) => ({ key, value })).forEach(E => {
        const local = new SuiteNode_Local(E.value, this.current_function);
        local.type = SuiteNode_Local_Type.PATTERN_BIND;
        suite.add_local(local);
      })
    }

    branch.block = this.parse_suite("this.match pattern block", suite);
    return branch;
  }
  parse_match_pattern(p_root_pattern: PatternNode | null = null): PatternNode | null {
    const pattern: PatternNode = new PatternNode();

    switch (this.current.type) {
      case TokenType.VAR: {
        // Bind.
        this.advance();
        if (!this.consume(TokenType.IDENTIFIER, '(Expected bind name after "var".)')) {

          return null;
        }
        pattern.pattern_type = PatternNode_Type.PT_BIND;
        const bind = pattern.value = this.parse_identifier();

        const root_pattern: PatternNode = p_root_pattern == null ? pattern : p_root_pattern;

        if (p_root_pattern != null) {
          if (p_root_pattern.has_bind(bind.name)) {
            push_error(vformat('(Bind variable name "%s" was already used in this pattern.)', bind.name));

            return null;
          }
        }

        if (this.current_suite!.has_local(bind.name)) {
          push_error(vformat('(There\'s already a %s named "%s" in this scope.)', this.current_suite!.get_local(bind.name).get_name(), bind.name));

          return null;
        }

        root_pattern.binds.set(bind.name, bind);

      } break;
      case TokenType.UNDERSCORE:
        // Wildcard.
        this.advance();
        pattern.pattern_type = PatternNode_Type.PT_WILDCARD;
        break;
      case TokenType.PERIOD_PERIOD:
        // Rest.
        this.advance();
        pattern.pattern_type = PatternNode_Type.PT_REST;
        break;
      case TokenType.BRACKET_OPEN: {
        // Array.
        this.push_multiline(true);
        this.advance();
        pattern.pattern_type = PatternNode_Type.PT_ARRAY;
        do {
          if (this.is_at_end() || this.check(TokenType.BRACKET_CLOSE)) {
            break;
          }
          const sub_pattern: PatternNode | null = this.parse_match_pattern(p_root_pattern != null ? p_root_pattern : pattern);
          if (sub_pattern == null) {
            continue;
          }
          if (pattern.rest_used) {
            push_error('(The ".." pattern must be the last element in the pattern array.)');
          } else if (sub_pattern.pattern_type == PatternNode_Type.PT_REST) {
            pattern.rest_used = true;
          }
          pattern.array.push(sub_pattern);
        } while (this.match(TokenType.COMMA));
        this.consume(TokenType.BRACKET_CLOSE, '(Expected "]" to close the array pattern.)');
        this.pop_multiline();
        break;
      }
      case TokenType.BRACE_OPEN: {
        // Dictionary.
        this.push_multiline(true);
        this.advance();
        pattern.pattern_type = PatternNode_Type.PT_DICTIONARY;
        do {
          if (this.check(TokenType.BRACE_CLOSE) || this.is_at_end()) {
            break;
          }
          if (this.match(TokenType.PERIOD_PERIOD)) {
            // Rest.
            if (pattern.rest_used) {
              push_error('(The ".." pattern must be the last element in the pattern dictionary.)');
            } else {
              const sub_pattern: PatternNode = new PatternNode();

              sub_pattern.pattern_type = PatternNode_Type.PT_REST;
              pattern.dictionary.push({ key: null, value_pattern: sub_pattern });
              pattern.rest_used = true;
            }
          } else {
            const key: ExpressionNode | null = this.parse_expression(false);
            if (key == null) {
              push_error('(Expected expression as key for dictionary pattern.)');
            }
            if (this.match(TokenType.COLON)) {
              // Value pattern.
              const sub_pattern: PatternNode | null = this.parse_match_pattern(p_root_pattern != null ? p_root_pattern : pattern);
              if (sub_pattern == null) {
                continue;
              }
              if (pattern.rest_used) {
                push_error('(The ".." pattern must be the last element in the pattern dictionary.)');
              } else if (sub_pattern.pattern_type == PatternNode_Type.PT_REST) {
                push_error('(The ".." pattern cannot be used as a value.)');
              } else {
                pattern.dictionary.push({ key, value_pattern: sub_pattern });
              }
            } else {
              // Key this.match only.
              pattern.dictionary.push({ key, value_pattern: null });
            }
          }
        } while (this.match(TokenType.COMMA));
        this.consume(TokenType.BRACE_CLOSE, '(Expected "}" to close the dictionary pattern.)');
        this.pop_multiline();
        break;
      }
      default: {
        // Expression.
        const expression: ExpressionNode | null = this.parse_expression(false);
        if (expression == null) {
          push_error('(Expected expression for this.match pattern.)');

          return null;
        } else {
          if (expression.type == Type.LITERAL) {
            pattern.pattern_type = PatternNode_Type.PT_LITERAL;
          } else {
            pattern.pattern_type = PatternNode_Type.PT_EXPRESSION;
          }
          pattern.value = expression;
        }
        break;
      }
    }
    return pattern;
  }
  parse_while(): WhileNode {
    const n_while: WhileNode = new WhileNode();

    n_while.condition = this.parse_expression(false);
    if (n_while.condition == null) {
      push_error('(Expected conditional expression after "while".)');
    }

    this.consume(TokenType.COLON, '(Expected ":" after "while" condition.)');

    // Save break/continue state.
    let could_break: boolean = this.can_break;
    let could_continue: boolean = this.can_continue;

    // Allow break/continue.
    this.can_break = true;
    this.can_continue = true;

    const suite: SuiteNode = new SuiteNode();
    suite.is_in_loop = true;
    n_while.loop = this.parse_suite('("while" block)', suite);
    // Reset break/continue state.
    this.can_break = could_break;
    this.can_continue = could_continue;

    return n_while;
  }


  parse_precedence(p_precedence: Precedence, p_can_assign: boolean, p_stop_on_assign: boolean = false): ExpressionNode | null {

    switch (this.current.type) {
      case TokenType.PARENTHESIS_OPEN:
      case TokenType.BRACE_OPEN:
      case TokenType.BRACKET_OPEN:
        this.push_multiline(true);
        break;
      default:
        break; // Nothing to do.
    }

    let token = this.current;
    let token_type = token.type;
    if (is_identifier(token.type)) {
      // Allow keywords that can be treated as identifiers.
      token_type = TokenType.IDENTIFIER;
    }

    this.advance();
    const prefix_rule = get_rule(this, token_type).prefix;
    if (prefix_rule == null) {
      throw new Error();
    }

    let previous_operand = prefix_rule(null, p_can_assign);
    while (p_precedence <= get_rule(this, this.current.type).precedence) {
      if (previous_operand == null || (p_stop_on_assign && this.current.type == TokenType.EQUAL) || this.lambda_ended) {
        return previous_operand;
      }
      switch (this.current.type) {
        // case TokenType.BRACE_OPEN: // Not an infix operator.
        case TokenType.PARENTHESIS_OPEN:
        case TokenType.BRACKET_OPEN:
          this.push_multiline(true);
          break;
        default:
          break; // Nothing to do.
      }
      token = this.advance();
      const infix_rule = get_rule(this, token.type).infix;
      if (infix_rule == null) {
        throw new Error();
      }
      previous_operand = infix_rule(previous_operand, p_can_assign);
    }

    return previous_operand;
  }
  parse_expression(p_can_assign: boolean, p_stop_on_assign: boolean = false): ExpressionNode | null {
    return this.parse_precedence(Precedence.PREC_ASSIGNMENT, p_can_assign, p_stop_on_assign);
  }
  parse_identifier(_p_previous_operand: ExpressionNode | null = null, _p_can_assign: boolean = false): IdentifierNode {
    if (!is_identifier(this.previous.type)) {
      ERR_FAIL_V_MSG('null', "Parser bug: parsing identifier node without identifier token.");
    }
    const identifier = new IdentifierNode();
    identifier.name = this.previous.literal?.toString() || "";

    const current_suite = this.current_suite;
    identifier.suite = current_suite;

    if (current_suite != null && current_suite.has_local(identifier.name)) {
      const declaration: SuiteNode_Local = current_suite.get_local(identifier.name);

      identifier.source_function = declaration.source_function;
      switch (declaration.type) {
        case SuiteNode_Local_Type.CONSTANT: {
          identifier.source = IdentifierNode_Source.LOCAL_CONSTANT;
          const dec = identifier.node_source = declaration.value as ConstantNode;
          dec.usages++;
        }
          break;
        case SuiteNode_Local_Type.VARIABLE: {
          identifier.source = IdentifierNode_Source.LOCAL_VARIABLE;
          const dec = identifier.node_source = declaration.value as VariableNode;
          dec.usages++;
        }
          break;
        case SuiteNode_Local_Type.PARAMETER: {
          identifier.source = IdentifierNode_Source.FUNCTION_PARAMETER;
          const dec = identifier.node_source = declaration.value as ParameterNode;
          dec.usages++;
        }
          break;
        case SuiteNode_Local_Type.FOR_VARIABLE: {
          identifier.source = IdentifierNode_Source.LOCAL_ITERATOR;
          const dec = identifier.node_source = declaration.value as IdentifierNode;
          dec.usages++;
        }
          break;
        case SuiteNode_Local_Type.PATTERN_BIND: {
          identifier.source = IdentifierNode_Source.LOCAL_BIND;
          const dec = identifier.node_source = declaration.value as IdentifierNode;
          dec.usages++;
        }
          break;
        case SuiteNode_Local_Type.UNDEFINED:
          ERR_FAIL_V_MSG('null', "Undefined local found.");
      }
    }

    return identifier;
  }
  parse_literal(_p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode | null {
    if (this.previous.type != TokenType.LITERAL) {
      push_error("Parser bug: parsing literal node without literal token.");
    }

    const literal: LiteralNode = new LiteralNode();
    literal.value = this.previous.literal!;

    return literal;
  }
  parse_self(_p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode | null {
    if (this.current_function && this.current_function.is_static) {
      push_error('(Cannot use "self" inside a static function.)');
    }
    const _self: SelfNode = new SelfNode();

    _self.current_class = this.current_class;
    return _self;
  }
  parse_builtin_constant(_p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode | null {
    const op_type = this.previous.type;
    const constant: LiteralNode = new LiteralNode();
    const num_Constant: Constant = { type: 4, type_s: 'FLOAT', val: 0 }
    switch (op_type) {
      case TokenType.CONST_PI:
        num_Constant.val = Math.PI;
        constant.value = num_Constant;
        break;
      case TokenType.CONST_TAU:
        num_Constant.val = Math.PI * 2;
        constant.value = num_Constant;
        break;
      case TokenType.CONST_INF:
        num_Constant.val = Number.POSITIVE_INFINITY;
        constant.value = num_Constant;
        break;
      case TokenType.CONST_NAN:
        num_Constant.val = Number.NaN;
        constant.value = num_Constant;
        break;
      default:
        return null; // Unreachable.
    }

    return constant;
  }
  parse_unary_operator(_p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode | null {
    const op_type = this.previous.type;
    const operation: UnaryOpNode = new UnaryOpNode();

    switch (op_type) {
      case TokenType.MINUS:
        operation.operation = UnaryOpNode_OpType.OP_NEGATIVE;
        operation.variant_op = VariantOperator.OP_NEGATE;
        operation.operand = this.parse_precedence(Precedence.PREC_SIGN, false);
        if (operation.operand == null) {
          push_error('(Expected expression after "-" operator.)');
        }
        break;
      case TokenType.PLUS:
        operation.operation = UnaryOpNode_OpType.OP_POSITIVE;
        operation.variant_op = VariantOperator.OP_POSITIVE;
        operation.operand = this.parse_precedence(Precedence.PREC_SIGN, false);
        if (operation.operand == null) {
          push_error('(Expected expression after "+" operator.)');
        }
        break;
      case TokenType.TILDE:
        operation.operation = UnaryOpNode_OpType.OP_COMPLEMENT;
        operation.variant_op = VariantOperator.OP_BIT_NEGATE;
        operation.operand = this.parse_precedence(Precedence.PREC_BIT_NOT, false);
        if (operation.operand == null) {
          push_error('(Expected expression after "~" operator.)');
        }
        break;
      case TokenType.NOT:
      case TokenType.BANG:
        operation.operation = UnaryOpNode_OpType.OP_LOGIC_NOT;
        operation.variant_op = VariantOperator.OP_NOT;
        operation.operand = this.parse_precedence(Precedence.PREC_LOGIC_NOT, false);
        if (operation.operand == null) {
          push_error(vformat('(Expected expression after "%s" operator.)", op_type == TokenType.NOT ? "not" : "!'));
        }
        break;
      default:

        return null; // Unreachable.
    }
    return operation;
  }
  parse_binary_not_in_operator(p_previous_operand: ExpressionNode | null, p_can_assign: boolean): ExpressionNode | null {
    // this.check that NOT is followed by IN by consuming it before calling this.parse_binary_operator which will only receive a plain IN
    const operation: UnaryOpNode = new UnaryOpNode();

    this.consume(TokenType.IN, '(Expected "in" after "not" in content-test operator.)');
    const in_operation: ExpressionNode | null = this.parse_binary_operator(p_previous_operand, p_can_assign);
    operation.operation = UnaryOpNode_OpType.OP_LOGIC_NOT;
    operation.variant_op = VariantOperator.OP_NOT;
    operation.operand = in_operation;

    return operation;
  }
  parse_binary_operator(p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode | null {
    const op = this.previous!;
    const operation: BinaryOpNode = new BinaryOpNode();

    const precedence = get_rule(this, op.type).precedence + 1;
    operation.left_operand = p_previous_operand;
    operation.right_operand = this.parse_precedence(precedence, false);
    if (operation.right_operand == null) {
      push_error(vformat('(Expected expression after "%s" operator.)', op.type));
    }

    // TODO: Also for unary, ternary, and assignment.
    switch (op.type) {
      case TokenType.PLUS:
        operation.operation = BinaryOpType.OP_ADDITION;
        operation.variant_op = VariantOperator.OP_ADD;
        break;
      case TokenType.MINUS:
        operation.operation = BinaryOpType.OP_SUBTRACTION;
        operation.variant_op = VariantOperator.OP_SUBTRACT;
        break;
      case TokenType.STAR:
        operation.operation = BinaryOpType.OP_MULTIPLICATION;
        operation.variant_op = VariantOperator.OP_MULTIPLY;
        break;
      case TokenType.SLASH:
        operation.operation = BinaryOpType.OP_DIVISION;
        operation.variant_op = VariantOperator.OP_DIVIDE;
        break;
      case TokenType.PERCENT:
        operation.operation = BinaryOpType.OP_MODULO;
        operation.variant_op = VariantOperator.OP_MODULE;
        break;
      case TokenType.STAR_STAR:
        operation.operation = BinaryOpType.OP_POWER;
        operation.variant_op = VariantOperator.OP_POWER;
        break;
      case TokenType.LESS_LESS:
        operation.operation = BinaryOpType.OP_BIT_LEFT_SHIFT;
        operation.variant_op = VariantOperator.OP_SHIFT_LEFT;
        break;
      case TokenType.GREATER_GREATER:
        operation.operation = BinaryOpType.OP_BIT_RIGHT_SHIFT;
        operation.variant_op = VariantOperator.OP_SHIFT_RIGHT;
        break;
      case TokenType.AMPERSAND:
        operation.operation = BinaryOpType.OP_BIT_AND;
        operation.variant_op = VariantOperator.OP_BIT_AND;
        break;
      case TokenType.PIPE:
        operation.operation = BinaryOpType.OP_BIT_OR;
        operation.variant_op = VariantOperator.OP_BIT_OR;
        break;
      case TokenType.CARET:
        operation.operation = BinaryOpType.OP_BIT_XOR;
        operation.variant_op = VariantOperator.OP_BIT_XOR;
        break;
      case TokenType.AND:
      case TokenType.AMPERSAND_AMPERSAND:
        operation.operation = BinaryOpType.OP_LOGIC_AND;
        operation.variant_op = VariantOperator.OP_AND;
        break;
      case TokenType.OR:
      case TokenType.PIPE_PIPE:
        operation.operation = BinaryOpType.OP_LOGIC_OR;
        operation.variant_op = VariantOperator.OP_OR;
        break;
      case TokenType.IN:
        operation.operation = BinaryOpType.OP_CONTENT_TEST;
        operation.variant_op = VariantOperator.OP_IN;
        break;
      case TokenType.EQUAL_EQUAL:
        operation.operation = BinaryOpType.OP_COMP_EQUAL;
        operation.variant_op = VariantOperator.OP_EQUAL;
        break;
      case TokenType.BANG_EQUAL:
        operation.operation = BinaryOpType.OP_COMP_NOT_EQUAL;
        operation.variant_op = VariantOperator.OP_NOT_EQUAL;
        break;
      case TokenType.LESS:
        operation.operation = BinaryOpType.OP_COMP_LESS;
        operation.variant_op = VariantOperator.OP_LESS;
        break;
      case TokenType.LESS_EQUAL:
        operation.operation = BinaryOpType.OP_COMP_LESS_EQUAL;
        operation.variant_op = VariantOperator.OP_LESS_EQUAL;
        break;
      case TokenType.GREATER:
        operation.operation = BinaryOpType.OP_COMP_GREATER;
        operation.variant_op = VariantOperator.OP_GREATER;
        break;
      case TokenType.GREATER_EQUAL:
        operation.operation = BinaryOpType.OP_COMP_GREATER_EQUAL;
        operation.variant_op = VariantOperator.OP_GREATER_EQUAL;
        break;
      default:
        return null; // Unreachable.
    }

    return operation;
  }
  parse_ternary_operator(p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode {
    // Only one ternary operation exists, so no abstraction here.
    const operation: TernaryOpNode = new TernaryOpNode();

    operation.true_expr = p_previous_operand;
    operation.condition = this.parse_precedence(Precedence.PREC_TERNARY, false);

    if (operation.condition == null) {
      push_error('(Expected expression as ternary condition after "if".)');
    }

    this.consume(TokenType.ELSE, '(Expected "else" after ternary operator condition.)');

    operation.false_expr = this.parse_precedence(Precedence.PREC_TERNARY, false);

    if (operation.false_expr == null) {
      push_error('(Expected expression after "else".)');
    }
    return operation;
  }
  parse_assignment(p_previous_operand: ExpressionNode | null, p_can_assign: boolean): ExpressionNode | null {
    if (!p_can_assign) {
      push_error("Assignment is not allowed inside an expression.");
      return this.parse_expression(false); // Return the following expression.
    }
    if (p_previous_operand == null) {
      return this.parse_expression(false); // Return the following expression.
    }

    switch (p_previous_operand.type) {
      case Type.IDENTIFIER: {
      } break;
      case Type.SUBSCRIPT:
        // Okay.
        break;
      default:
        push_error('(Only identifier, attribute access, and subscription access can be used as assignment target.)');
        return this.parse_expression(false); // Return the following expression.
    }

    const assignment: AssignmentNode = new AssignmentNode();
    switch (this.previous!.type) {
      case TokenType.EQUAL:
        assignment.operation = AssignmentOperation.OP_NONE;
        assignment.variant_op = VariantOperator.OP_MAX;
        break;
      case TokenType.PLUS_EQUAL:
        assignment.operation = AssignmentOperation.OP_ADDITION;
        assignment.variant_op = VariantOperator.OP_ADD;
        break;
      case TokenType.MINUS_EQUAL:
        assignment.operation = AssignmentOperation.OP_SUBTRACTION;
        assignment.variant_op = VariantOperator.OP_SUBTRACT;
        break;
      case TokenType.STAR_EQUAL:
        assignment.operation = AssignmentOperation.OP_MULTIPLICATION;
        assignment.variant_op = VariantOperator.OP_MULTIPLY;
        break;
      case TokenType.STAR_STAR_EQUAL:
        assignment.operation = AssignmentOperation.OP_POWER;
        assignment.variant_op = VariantOperator.OP_POWER;
        break;
      case TokenType.SLASH_EQUAL:
        assignment.operation = AssignmentOperation.OP_DIVISION;
        assignment.variant_op = VariantOperator.OP_DIVIDE;
        break;
      case TokenType.PERCENT_EQUAL:
        assignment.operation = AssignmentOperation.OP_MODULO;
        assignment.variant_op = VariantOperator.OP_MODULE;
        break;
      case TokenType.LESS_LESS_EQUAL:
        assignment.operation = AssignmentOperation.OP_BIT_SHIFT_LEFT;
        assignment.variant_op = VariantOperator.OP_SHIFT_LEFT;
        break;
      case TokenType.GREATER_GREATER_EQUAL:
        assignment.operation = AssignmentOperation.OP_BIT_SHIFT_RIGHT;
        assignment.variant_op = VariantOperator.OP_SHIFT_RIGHT;
        break;
      case TokenType.AMPERSAND_EQUAL:
        assignment.operation = AssignmentOperation.OP_BIT_AND;
        assignment.variant_op = VariantOperator.OP_BIT_AND;
        break;
      case TokenType.PIPE_EQUAL:
        assignment.operation = AssignmentOperation.OP_BIT_OR;
        assignment.variant_op = VariantOperator.OP_BIT_OR;
        break;
      case TokenType.CARET_EQUAL:
        assignment.operation = AssignmentOperation.OP_BIT_XOR;
        assignment.variant_op = VariantOperator.OP_BIT_XOR;
        break;
      default:
        break; // Unreachable.
    }
    assignment.assignee = p_previous_operand;
    assignment.assigned_value = this.parse_expression(false);
    if (assignment.assigned_value == null) {
      push_error('(Expected an expression after "=".)');
    }
    return assignment;
  }
  parse_await(_p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode | null {
    const _await: AwaitNode = new AwaitNode();
    const element: ExpressionNode | null = this.parse_precedence(Precedence.PREC_AWAIT, false);
    if (element == null) {
      push_error('(Expected signal or coroutine after "await".)');
    }
    _await.to_await = element;
    if (this.current_function) { // Might be null in a getter or setter.
      this.current_function.is_coroutine = true;
    }

    return _await;
  }
  parse_array(_p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode | null {
    const array: ArrayNode = new ArrayNode();

    if (!this.check(TokenType.BRACKET_CLOSE)) {
      do {
        if (this.check(TokenType.BRACKET_CLOSE)) {
          // Allow for trailing comma.
          break;
        }

        const element: ExpressionNode | null = this.parse_expression(false);
        if (element == null) {
          push_error('(Expected expression as array element.)');
        } else {
          array.elements.push(element);
        }
      } while (this.match(TokenType.COMMA) && !this.is_at_end());
    }
    this.pop_multiline();
    this.consume(TokenType.BRACKET_CLOSE, '(Expected closing "]" after array elements.)');
    return array;
  }
  parse_dictionary(_p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode | null {
    const dictionary: DictionaryNode = new DictionaryNode();

    let decided_style: boolean = false;
    if (!this.check(TokenType.BRACE_CLOSE)) {
      do {
        if (this.check(TokenType.BRACE_CLOSE)) {
          // Allow for trailing comma.
          break;
        }

        // Key.
        const key: ExpressionNode | null = this.parse_expression(false, true); // Stop on "=" so we can this.check for Lua table style.

        if (key == null) {
          push_error('(Expected expression as dictionary key.)');
        }

        if (!decided_style) {
          switch (this.current.type) {
            case TokenType.COLON:
              dictionary.style = DictionaryNode_Style.PYTHON_DICT;
              break;
            case TokenType.EQUAL:
              dictionary.style = DictionaryNode_Style.LUA_TABLE;
              break;
            default:
              push_error('(Expected ":" or "=" after dictionary key.)');
              break;
          }
          decided_style = true;
        }

        switch (dictionary.style) {
          case DictionaryNode_Style.LUA_TABLE:
            if (key != null && key.type != Type.IDENTIFIER && key.type != Type.LITERAL) {
              push_error('(Expected identifier or string as Lua-style dictionary key (e.g "{ key = value }").)');
              this.advance();
              break;
            }
            if (key != null && key.type == Type.LITERAL && ((key as LiteralNode).value! as Constant).type_s != 'STRING') {
              push_error('(Expected identifier or string as Lua-style dictionary key (e.g "{ key = value }").)');
              this.advance();
              break;
            }
            if (!this.match(TokenType.EQUAL)) {
              if (this.match(TokenType.COLON)) {
                push_error('(Expected "=" after dictionary key. Mixing dictionary styles is not allowed.)');
                this.advance(); // Consume wrong separator anyway.
              } else {
                push_error('(Expected "=" after dictionary key.)');
              }
            }
            if (key != null) {
              key.is_constant = true;
              if (key.type == Type.IDENTIFIER) {
                key.reduced_value = (key as IdentifierNode).name;
              } else if (key.type == Type.LITERAL) {
                key.reduced_value = ((key as LiteralNode).value as Constant).val.toString();
              }
            }
            break;
          case DictionaryNode_Style.PYTHON_DICT:
            if (!this.match(TokenType.COLON)) {
              if (this.match(TokenType.EQUAL)) {
                push_error('(Expected ":" after dictionary key. Mixing dictionary styles is not allowed.)');
                this.advance(); // Consume wrong separator anyway.
              } else {
                push_error('(Expected ":" after dictionary key.)');
              }
            }
            break;
        }

        // Value.
        const value: ExpressionNode | null = this.parse_expression(false);
        if (value == null) {
          push_error('(Expected expression as dictionary value.)');
        }

        if (key != null && value != null) {
          dictionary.elements.push({ key, value });
        }
      } while (this.match(TokenType.COMMA) && !this.is_at_end());
    }
    this.pop_multiline();
    this.consume(TokenType.BRACE_CLOSE, '(Expected closing "}" after dictionary elements.)');
    return dictionary;
  }
  parse_grouping(_p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode | null {
    const grouped: ExpressionNode | null = this.parse_expression(false);
    this.pop_multiline();
    if (grouped == null) {
      push_error('(Expected grouping expression.)');
    } else {
      this.consume(TokenType.PARENTHESIS_CLOSE, '*(Expected closing ")" after grouping expression.)*');
    }
    return grouped;
  }
  parse_attribute(p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode | null {
    const attribute: SubscriptNode = new SubscriptNode();
    attribute.base = p_previous_operand;
    if (is_node_name(this.current.type)) {
      this.current.type = TokenType.IDENTIFIER;
    }
    if (!this.consume(TokenType.IDENTIFIER, '(Expected identifier after "." for attribute access.)')) {

      return attribute;
    }

    attribute.is_attribute = true;
    attribute.attribute = this.parse_identifier();
    return attribute;
  }
  parse_subscript(p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode | null {
    const subscript: SubscriptNode = new SubscriptNode();
    subscript.base = p_previous_operand;
    subscript.index = this.parse_expression(false);
    if (subscript.index == null) {
      push_error('(Expected expression after "[".)');
    }
    this.pop_multiline();
    this.consume(TokenType.BRACKET_CLOSE, '(Expected "]" after subscription index.)');
    return subscript;
  }
  parse_cast(p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode | null {
    const cast: CastNode = new CastNode();

    cast.operand = p_previous_operand;
    cast.cast_type = this.parse_type();
    if (cast.cast_type == null) {
      push_error('(Expected type specifier after "as".)');
      return p_previous_operand;
    }

    return cast;
  }
  parse_call(p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode | null {
    const call: CallNode = new CallNode();

    if (this.previous.type == TokenType.SUPER) {
      // Super call.
      call.is_super = true;
      this.push_multiline(true);
      if (this.match(TokenType.PARENTHESIS_OPEN)) {
        // Implicit call to the parent method of the same name.
        if (this.current_function == null) {
          push_error('(Cannot use implicit "super" call outside of a function.)');
          this.pop_multiline();

          return null;
        }
        if (this.current_function.identifier) {
          call.function_name = this.current_function.identifier.name;
        } else {
          call.function_name = ("<anonymous>");
        }
      } else {
        this.consume(TokenType.PERIOD, '(Expected "." or "(" after "super".)');

        if (!this.consume(TokenType.IDENTIFIER, '(Expected function name after ".".)')) {
          this.pop_multiline();

          return null;
        }
        const identifier: IdentifierNode = this.parse_identifier();
        call.callee = identifier;
        call.function_name = identifier.name;
        this.consume(TokenType.PARENTHESIS_OPEN, '(Expected "(" after function name.)');
      }
    } else {
      call.callee = p_previous_operand;

      if (call.callee == null) {
        push_error('*(Cannot call on an expression. Use ".call()" if it\'s a Callable.)*');
      } else if (call.callee.type == Type.IDENTIFIER) {
        call.function_name = (call.callee as IdentifierNode).name;

      } else if (call.callee.type == Type.SUBSCRIPT) {
        const attribute: SubscriptNode = (call.callee as SubscriptNode);
        if (attribute.is_attribute) {
          if (attribute.attribute) {
            call.function_name = attribute.attribute.name;
          }

        } else {
          // TODO: The analyzer can see if this is actually a Callable and give better error message.
          push_error('*(Cannot call on an expression. Use ".call()" if it\'s a Callable.)*');
        }
      } else {
        push_error('*(Cannot call on an expression. Use ".call()" if it\'s a Callable.)*');
      }
    }

    // Arguments.

    do {
      if (this.check(TokenType.PARENTHESIS_CLOSE)) {
        // Allow for trailing comma.
        break;
      }
      const argument: ExpressionNode | null = this.parse_expression(false);
      if (argument == null) {
        push_error('(Expected expression as the function argument.)');
      } else {
        call.arguments.push(argument);
      }

    } while (this.match(TokenType.COMMA));
    this.pop_multiline();
    this.consume(TokenType.PARENTHESIS_CLOSE, '*(Expected closing ")" after call arguments.)*');
    return call;
  }
  parse_get_node(_p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode | null {
    // We want code completion after a DOLLAR even if the this.current code is invalid.
    if (!is_node_name(this.current.type) && !this.check(TokenType.LITERAL) && !this.check(TokenType.SLASH) && !this.check(TokenType.PERCENT)) {
      push_error(vformat('(Expected node path as string or identifier after "%s".)', this.previous.type));
      return null;
    }

    if (this.check(TokenType.LITERAL)) {
      if ((this.current.literal as Constant).type_s != 'STRING') {
        push_error(vformat('(Expected node path as string or identifier after "%s".)', this.previous.type));
        return null;
      }
    }

    const get_node: GetNodeNode = new GetNodeNode();

    // Store the last item in the path so the parser knows what to expect.
    // Allow allows more specific error messages.
    enum PathState {
      PATH_STATE_START,
      PATH_STATE_SLASH,
      PATH_STATE_PERCENT,
      PATH_STATE_NODE_NAME,
    };
    let path_state: PathState = PathState.PATH_STATE_START;

    if (this.previous.type == TokenType.DOLLAR) {
      // Detect initial slash, which will be handled in the loop if it matches.
      this.match(TokenType.SLASH);
    } else {
      get_node.use_dollar = false;
    }

    do {
      if (this.previous.type == TokenType.PERCENT) {
        if (path_state != PathState.PATH_STATE_START && path_state != PathState.PATH_STATE_SLASH) {
          push_error('("%" is only valid in the beginning of a node name (either after "$" or after "/"))');

          return null;
        }

        get_node.full_path += "%";

        path_state = PathState.PATH_STATE_PERCENT;
      } else if (this.previous.type == TokenType.SLASH) {
        if (path_state != PathState.PATH_STATE_START && path_state != PathState.PATH_STATE_NODE_NAME) {
          push_error('("/" is only valid at the beginning of the path or after a node name.)');

          return null;
        }

        get_node.full_path += "/";

        path_state = PathState.PATH_STATE_SLASH;
      }
      if (this.match(TokenType.LITERAL)) {
        if ((this.previous.literal as Constant).type_s != 'STRING') {
          let previous_token = '';
          switch (path_state) {
            case PathState.PATH_STATE_START:
              previous_token = "$";
              break;
            case PathState.PATH_STATE_PERCENT:
              previous_token = "%";
              break;
            case PathState.PATH_STATE_SLASH:
              previous_token = "/";
              break;
            default:
              break;
          }
          push_error(vformat('(Expected node path as string or identifier after "%s".)', previous_token));

          return null;
        }

        get_node.full_path += (this.previous.literal as Constant).val;

        path_state = PathState.PATH_STATE_NODE_NAME;
      } else if (is_node_name(this.current.type)) {
        this.advance();

        const identifier = get_identifier(this.previous);
        get_node.full_path += identifier;

        path_state = PathState.PATH_STATE_NODE_NAME;
      } else if (!this.check(TokenType.SLASH) && !this.check(TokenType.PERCENT)) {
        push_error(vformat('(Unexpected "%s" in node path.)', this.current.type));

        return null;
      }
    } while (this.match(TokenType.SLASH) || this.match(TokenType.PERCENT));
    return get_node;
  }

  parse_preload(_p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode | null {
    const preload: PreloadNode = new PreloadNode();
    preload.resolved_path = "<missing path>";

    this.push_multiline(true);
    this.consume(TokenType.PARENTHESIS_OPEN, '(Expected "(" after "preload".)');

    preload.path = this.parse_expression(false);

    if (preload.path == null) {
      push_error('(Expected resource path after "(".)');
    }

    this.pop_multiline();
    this.consume(TokenType.PARENTHESIS_CLOSE, '*(Expected ")" after preload path.)*');

    return preload;
  }

  parse_lambda(_p_previous_operand: ExpressionNode, _p_can_assign: boolean): ExpressionNode | null {
    const lambda: LambdaNode = new LambdaNode();
    lambda.parent_function = this.current_function;
    lambda.parent_lambda = this.current_lambda;

    const _function = new FunctionNode();
    _function.source_lambda = lambda;

    _function.is_static = this.current_function != null ? this.current_function.is_static : false;

    if (this.match(TokenType.IDENTIFIER)) {
      _function.identifier = this.parse_identifier();
    }

    let multiline_context = this.multiline_stack.slice(-1)[0];

    // Reset the multiline stack since we don't want the multiline mode one in the lambda body.
    this.push_multiline(false);
    if (multiline_context) {
      //tokenizer.push_expression_indented_block();
    }

    this.push_multiline(true); // For the parameters.
    if (_function.identifier) {
      this.consume(TokenType.PARENTHESIS_OPEN, '(Expected opening "(" after lambda name.)');
    } else {
      this.consume(TokenType.PARENTHESIS_OPEN, '(Expected opening "(" after "func".)');
    }

    const previous_function = this.current_function;
    this.current_function = _function;

    const previous_lambda = this.current_lambda;
    this.current_lambda = lambda;

    const body: SuiteNode = new SuiteNode();
    body.parent_function = this.current_function;
    body.parent_block = this.current_suite;

    const previous_suite = this.current_suite;
    this.current_suite = body;

    this.parse_function_signature(_function, body, "lambda");

    this.current_suite = previous_suite;

    let previous_in_lambda = this.in_lambda;
    this.in_lambda = true;

    // Save break/continue state.
    let could_break = this.can_break;
    let could_continue = this.can_continue;

    // Disallow break/continue.
    this.can_break = false;
    this.can_continue = false;

    _function.body = this.parse_suite("lambda declaration", body, true);

    this.pop_multiline();

    if (multiline_context) {
      // If we're in multiline mode, we want to skip the spurious DEDENT and NEWLINE tokens.
      while (this.check(TokenType.DEDENT) || this.check(TokenType.INDENT) || this.check(TokenType.NEWLINE)) {
        this.index++; // Not advance() since we don't want to change the previous token.
      }
      //tokenizer.pop_expression_indented_block();
    }

    this.current_function = previous_function;
    this.current_lambda = previous_lambda;
    this.in_lambda = previous_in_lambda;
    lambda.function = _function;

    // Reset break/continue state.
    this.can_break = could_break;
    this.can_continue = could_continue;

    return lambda;
  }

  parse_type_test(p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode | null {
    // x is not int
    // ^        ^^^ ExpressionNode, TypeNode
    // ^^^^^^^^^^^^ TypeTestNode
    // ^^^^^^^^^^^^ UnaryOpNode
    let not_node: UnaryOpNode | null = null;
    if (this.match(TokenType.NOT)) {
      not_node = new UnaryOpNode();
      not_node.operation = UnaryOpNode_OpType.OP_LOGIC_NOT;
      not_node.variant_op = VariantOperator.OP_NOT;
    }

    const type_test: TypeTestNode = new TypeTestNode();

    type_test.operand = p_previous_operand;
    type_test.test_type = this.parse_type();

    if (not_node != null) {
      not_node.operand = type_test;
    }

    if (type_test.test_type == null) {
      if (not_node == null) {
        push_error('(Expected type specifier after "is".)');
      } else {
        push_error('(Expected type specifier after "is not".)');
      }
    }

    if (not_node != null) {
      return not_node;
    }

    return type_test;
  }

  parse_yield(_p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode | null {
    push_error('("yield" was removed in Godot 4. Use "await" instead.)');
    return null;
  }

  parse_invalid_token(p_previous_operand: ExpressionNode | null, _p_can_assign: boolean): ExpressionNode | null {
    // Just for better error messages.
    const invalid = this.previous.type;

    switch (invalid) {
      case TokenType.QUESTION_MARK:
        push_error('(Unexpected "?" in source. If you want a ternary operator, use "truthy_value if true_condition else falsy_value".)');
        break;
      default:
        return null; // Unreachable.
    }

    // Return the previous expression.
    return p_previous_operand;
  }

  parse_type(p_allow_void: boolean = false): TypeNode | null {
    let type: TypeNode | null = new TypeNode();

    if (!this.match(TokenType.IDENTIFIER)) {
      if (this.match(TokenType.VOID)) {
        if (p_allow_void) {
          const void_type = type;
          return void_type;
        } else {
          push_error('("void" is only allowed for a function return type.)');
        }
      }

      return null;
    }

    let type_element = this.parse_identifier();

    type.type_chain.push(type_element);

    if (this.match(TokenType.BRACKET_OPEN)) {
      // Typed collection (like Array[int], Dictionary[String, int]).
      let first_pass = true;
      do {
        const container_type = this.parse_type(false); // Don't allow void for element type.
        if (container_type == null) {
          push_error(`(Expected type for collection after "${first_pass ? "[" : ","}".)`);
          type = null;
          break;
        } else if (container_type.container_types.length > 0) {
          push_error("Nested typed collections are not supported.");
        } else {
          type.container_types.push(container_type);
        }
        first_pass = false;
      } while (this.match(TokenType.COMMA));
      this.consume(TokenType.BRACKET_CLOSE, '(Expected closing "]" after collection type.)');
      if (type != null) {
        //complete_extents(type);
      }
      return type;
    }

    while (this.match(TokenType.PERIOD)) {
      if (this.consume(TokenType.IDENTIFIER, '(Expected inner type name after ".".)')) {
        type_element = this.parse_identifier();
        type.type_chain.push(type_element);
      }
    }

    return type;
  }
}
