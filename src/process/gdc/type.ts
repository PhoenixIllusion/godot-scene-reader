import { Constant } from "../../parse/binary/gdc.js";
import { VariantType } from "../../parse/binary/variant.js";

export const enum PropertyUsageFlags {
  PROPERTY_USAGE_NONE = 0,
  PROPERTY_USAGE_STORAGE = 1 << 1,
  PROPERTY_USAGE_EDITOR = 1 << 2,
  PROPERTY_USAGE_INTERNAL = 1 << 3,
  PROPERTY_USAGE_CHECKABLE = 1 << 4, // Used for editing global variables.
  PROPERTY_USAGE_CHECKED = 1 << 5, // Used for editing global variables.
  PROPERTY_USAGE_GROUP = 1 << 6, // Used for grouping props in the editor.
  PROPERTY_USAGE_CATEGORY = 1 << 7,
  PROPERTY_USAGE_SUBGROUP = 1 << 8,
  PROPERTY_USAGE_CLASS_IS_BITFIELD = 1 << 9,
  PROPERTY_USAGE_NO_INSTANCE_STATE = 1 << 10,
  PROPERTY_USAGE_RESTART_IF_CHANGED = 1 << 11,
  PROPERTY_USAGE_SCRIPT_VARIABLE = 1 << 12,
  PROPERTY_USAGE_STORE_IF_NULL = 1 << 13,
  PROPERTY_USAGE_UPDATE_ALL_IF_MODIFIED = 1 << 14,
  PROPERTY_USAGE_SCRIPT_DEFAULT_VALUE = 1 << 15, // Deprecated.
  PROPERTY_USAGE_CLASS_IS_ENUM = 1 << 16,
  PROPERTY_USAGE_NIL_IS_VARIANT = 1 << 17,
  PROPERTY_USAGE_ARRAY = 1 << 18, // Used in the inspector to group properties as elements of an array.
  PROPERTY_USAGE_ALWAYS_DUPLICATE = 1 << 19, // When duplicating a resource, always duplicate, even with subresource duplication disabled.
  PROPERTY_USAGE_NEVER_DUPLICATE = 1 << 20, // When duplicating a resource, never duplicate, even with subresource duplication enabled.
  PROPERTY_USAGE_HIGH_END_GFX = 1 << 21,
  PROPERTY_USAGE_NODE_PATH_FROM_SCENE_ROOT = 1 << 22,
  PROPERTY_USAGE_RESOURCE_NOT_PERSISTENT = 1 << 23,
  PROPERTY_USAGE_KEYING_INCREMENTS = 1 << 24, // Used in inspector to increment property when keyed in animation player.
  PROPERTY_USAGE_DEFERRED_SET_RESOURCE = 1 << 25, // Deprecated.
  PROPERTY_USAGE_EDITOR_INSTANTIATE_OBJECT = 1 << 26, // For Object properties, instantiate them when creating in editor.
  PROPERTY_USAGE_EDITOR_BASIC_SETTING = 1 << 27, //for project or editor settings, show when basic settings are selected.
  PROPERTY_USAGE_READ_ONLY = 1 << 28, // Mark a property as read-only in the inspector.
  PROPERTY_USAGE_SECRET = 1 << 29, // Export preset credentials that should be stored separately from the rest of the export config.

  PROPERTY_USAGE_DEFAULT = PROPERTY_USAGE_STORAGE | PROPERTY_USAGE_EDITOR,
  PROPERTY_USAGE_NO_EDITOR = PROPERTY_USAGE_STORAGE,
}

export class PropertyInfo {
  class_name: string = "";
  usage: number = 0;
  constructor(public type: string, public name: string) { }
}

export const enum Type {
  NONE,
  ANNOTATION,
  ARRAY,
  ASSERT,
  ASSIGNMENT,
  AWAIT,
  BINARY_OPERATOR,
  BREAK,
  BREAKPOINT,
  CALL,
  CAST,
  CLASS,
  CONSTANT,
  CONTINUE,
  DICTIONARY,
  ENUM,
  FOR,
  FUNCTION,
  GET_NODE,
  IDENTIFIER,
  IF,
  LAMBDA,
  LITERAL,
  MATCH,
  MATCH_BRANCH,
  PARAMETER,
  PASS,
  PATTERN,
  PRELOAD,
  RETURN,
  SELF,
  SIGNAL,
  SUBSCRIPT,
  SUITE,
  TERNARY_OPERATOR,
  TYPE,
  TYPE_TEST,
  UNARY_OPERATOR,
  VARIABLE,
  WHILE,
};
export class Node {
  type: Type = Type.NONE;
  next: Node | null = null;
  annotations: AnnotationNode[] = []
}


export class ExpressionNode extends Node {
  reduced: boolean | null = null;
  is_constant: boolean | null = null;
  reduced_value: string = '';
}

const valid_annotations: Record<string, AnnotationInfo> = {};
export class AnnotationNode extends Node {
  name: string = "";
  arguments: ExpressionNode[] = []
  type = Type.ANNOTATION;

  info: AnnotationInfo = new AnnotationInfo();
  is_applied = false;
  is_resolved = false;

  applies_to(p_target_kinds: AnnotationInfo_TargetKind) {
    this.info = valid_annotations[this.name];
    return (this.info.target_kind & p_target_kinds) > 0;
  }
  apply(_parser: any /*BinaryParser*/, _p_target: Node, _p_class: ClassNode | null) {
    if (this.is_applied) {
      return true;
    }
    this.is_applied = true;
    return true// (p_this->*(p_this->valid_annotations[name].apply))(this, p_target, p_class);
  }
}

export class ArrayNode extends ExpressionNode {
  elements: ExpressionNode[] = [];
  type = Type.ARRAY;
}

export class AssertNode extends Node {
  condition: ExpressionNode | null = null;
  message: ExpressionNode | null = null;
  type = Type.ASSERT;
}

export class AssignableNode extends Node {
  identifier: IdentifierNode | null = null;
  initializer: ExpressionNode | null = null;
  datatype_specifier: TypeNode | null = null;

  infer_datatype = false;
  use_conversion_assign = false;
  usages = 0;
}

export const enum VariantOperator {
  //comparison
  OP_EQUAL,
  OP_NOT_EQUAL,
  OP_LESS,
  OP_LESS_EQUAL,
  OP_GREATER,
  OP_GREATER_EQUAL,
  //mathematic
  OP_ADD,
  OP_SUBTRACT,
  OP_MULTIPLY,
  OP_DIVIDE,
  OP_NEGATE,
  OP_POSITIVE,
  OP_MODULE,
  OP_POWER,
  //bitwise
  OP_SHIFT_LEFT,
  OP_SHIFT_RIGHT,
  OP_BIT_AND,
  OP_BIT_OR,
  OP_BIT_XOR,
  OP_BIT_NEGATE,
  //logic
  OP_AND,
  OP_OR,
  OP_XOR,
  OP_NOT,
  //containment
  OP_IN,
  OP_MAX
};

export const enum AssignmentOperation {
  OP_NONE,
  OP_ADDITION,
  OP_SUBTRACTION,
  OP_MULTIPLICATION,
  OP_DIVISION,
  OP_MODULO,
  OP_POWER,
  OP_BIT_SHIFT_LEFT,
  OP_BIT_SHIFT_RIGHT,
  OP_BIT_AND,
  OP_BIT_OR,
  OP_BIT_XOR,
};

export class AssignmentNode extends ExpressionNode {
  operation = AssignmentOperation.OP_NONE;
  variant_op = VariantOperator.OP_MAX;
  assignee: ExpressionNode | null = null;
  assigned_value: ExpressionNode | null = null;
  use_conversion_assign = false;
  type = Type.ASSIGNMENT;
};

export class AwaitNode extends ExpressionNode {
  to_await: ExpressionNode | null = null;
  type = Type.AWAIT;
};

export const enum BinaryOpType {
  OP_ADDITION,
  OP_SUBTRACTION,
  OP_MULTIPLICATION,
  OP_DIVISION,
  OP_MODULO,
  OP_POWER,
  OP_BIT_LEFT_SHIFT,
  OP_BIT_RIGHT_SHIFT,
  OP_BIT_AND,
  OP_BIT_OR,
  OP_BIT_XOR,
  OP_LOGIC_AND,
  OP_LOGIC_OR,
  OP_CONTENT_TEST,
  OP_COMP_EQUAL,
  OP_COMP_NOT_EQUAL,
  OP_COMP_LESS,
  OP_COMP_LESS_EQUAL,
  OP_COMP_GREATER,
  OP_COMP_GREATER_EQUAL,
}

export class BinaryOpNode extends ExpressionNode {
  operation = BinaryOpType.OP_ADDITION;
  variant_op = VariantOperator.OP_MAX;
  left_operand: ExpressionNode | null = null;
  right_operand: ExpressionNode | null = null;
  type = Type.BINARY_OPERATOR;

};


export class BreakNode extends Node {
  type = Type.BREAK;
};

export class BreakpointNode extends Node {
  type = Type.BREAKPOINT;
};

export class CallNode extends ExpressionNode {
  callee: ExpressionNode | null = null;
  arguments: ExpressionNode[] = [];
  function_name = '';
  is_super = false;
  is_static = false;
  type = Type.CALL;

  get_callee_type(): Type {
    if (!this.callee) {
      return Type.NONE;
    } else {
      return this.callee.type;
    }
  }
};

export class CastNode extends ExpressionNode {
  operand: ExpressionNode | null = null;
  cast_type: TypeNode | null = null;

  type = Type.CAST;
};

export class EnumValue {
  identifier: IdentifierNode | null = null;
  custom_value: ExpressionNode | null = null;
  parent_enum: EnumNode | null = null;
  line = 0;
  index = -1;
  resolved = false;
  value = 0;
};

export class EnumNode extends Node {
  identifier: IdentifierNode | null = null;
  values: EnumValue[] = [];
  dictionary: {} = {};
  type = Type.ENUM;

};

export const enum ClassMemberType {
  UNDEFINED,
  CLASS,
  CONSTANT,
  FUNCTION,
  SIGNAL,
  VARIABLE,
  ENUM,
  ENUM_VALUE, // For unnamed enums.
  GROUP, // For member grouping.
};

export type ClassMemberSource = ClassNode | ConstantNode | FunctionNode | SignalNode | VariableNode | EnumNode | EnumValue | AnnotationNode | undefined;
export class ClassMember {
  type: ClassMemberType;
  get_type_name(): string {
    switch (this.type) {
      case ClassMemberType.UNDEFINED:
        return "???";
      case ClassMemberType.CLASS:
        return "class";
      case ClassMemberType.CONSTANT:
        return "constant";
      case ClassMemberType.FUNCTION:
        return "function";
      case ClassMemberType.SIGNAL:
        return "signal";
      case ClassMemberType.VARIABLE:
        return "variable";
      case ClassMemberType.ENUM:
        return "enum";
      case ClassMemberType.ENUM_VALUE:
        return "enum value";
      case ClassMemberType.GROUP:
        return "group";
    }
    return "";
  }
  static GetClassMemberType(source: ClassMemberSource): ClassMemberType {
    if (source instanceof ClassNode) return ClassMemberType.CLASS;
    if (source instanceof ConstantNode) return ClassMemberType.CONSTANT;
    if (source instanceof FunctionNode) return ClassMemberType.FUNCTION;
    if (source instanceof SignalNode) return ClassMemberType.SIGNAL;
    if (source instanceof VariableNode) return ClassMemberType.VARIABLE;
    if (source instanceof EnumNode) return ClassMemberType.ENUM;
    if (source instanceof EnumValue) return ClassMemberType.ENUM_VALUE;
    if (source instanceof AnnotationNode) return ClassMemberType.GROUP;
    return ClassMemberType.UNDEFINED;
  }

  constructor(public source_node: ClassMemberSource) {
    this.type = ClassMember.GetClassMemberType(source_node);
  }
}

export class ClassNode extends Node {
  identifier: IdentifierNode | null = null;
  members: ClassMember[] = [];
  members_indices: Map<string, number> = new Map();
  outer: ClassNode | null = null;
  extends_used = false;
  onready_used = false;
  has_static_data = false;
  annotated_static_unload = false;
  extends_path = "";
  extends: IdentifierNode[] = []; // List for indexing: extends A.B.C
  //base_type: DataType | null = null;
  fqcn = "";
  resolved_interface = false;
  resolved_body = false;

  type = Type.CLASS;

  add_member(p_member_node: Exclude<ClassMemberSource, AnnotationNode | undefined>) {
    this.members_indices.set(p_member_node.identifier!.name, this.members.length);
    this.members.push(new ClassMember(p_member_node));
  }
  add_member_group(p_annotation_node: AnnotationNode) {
    // Avoid name conflict. See GH-78252.
    const name = `@group_${this.members.length}_${p_annotation_node.name}`;
    this.members_indices.set(name, this.members.length);
    this.members.push(new ClassMember(p_annotation_node));
  }

  get_member(p_name: string) {
    return this.members[this.members_indices.get(p_name)!];
  }
}

export class ConstantNode extends AssignableNode {
  type = Type.CONSTANT;
}

export class ContinueNode extends Node {
  type = Type.CONTINUE;
};

interface DictionaryNode_Pair {
  key: ExpressionNode | null;
  value: ExpressionNode | null;
};

export const enum DictionaryNode_Style {
  LUA_TABLE,
  PYTHON_DICT,
};

export class DictionaryNode extends ExpressionNode {
  style = DictionaryNode_Style.PYTHON_DICT;
  elements: DictionaryNode_Pair[] = [];
  type = Type.DICTIONARY;
}

export class ForNode extends Node {
  variable: IdentifierNode | null = null;
  datatype_specifier: TypeNode | null = null;
  use_conversion_assign = false;
  list: ExpressionNode | null = null;
  loop: SuiteNode | null = null;
  type = Type.FOR;
}

export class FunctionNode extends Node {
  identifier: IdentifierNode | null = null;
  parameters: ParameterNode[] = [];
  parameters_indices: Map<string, number> = new Map();
  return_type: TypeNode | null = null;
  body: SuiteNode | null = null;
  is_static = false; // For lambdas it's determined in the analyzer.
  is_coroutine = false;
  source_lambda: LambdaNode | null = null;
  default_arg_values: VariantType[] = [];

  resolved_signature = false;
  resolved_body = false;

  type = Type.FUNCTION;
}

export class GetNodeNode extends ExpressionNode {
  full_path = "";
  use_dollar = true;

  type = Type.GET_NODE;
}

export const enum IdentifierNode_Source {
  UNDEFINED_SOURCE,
  FUNCTION_PARAMETER,
  LOCAL_VARIABLE,
  LOCAL_CONSTANT,
  LOCAL_ITERATOR, // `for` loop iterator.
  LOCAL_BIND, // Pattern bind.
  MEMBER_VARIABLE,
  MEMBER_CONSTANT,
  MEMBER_FUNCTION,
  MEMBER_SIGNAL,
  MEMBER_CLASS,
  INHERITED_VARIABLE,
  STATIC_VARIABLE,
}

type IdentifierSource = ParameterNode | IdentifierNode | VariableNode | ConstantNode | SignalNode | FunctionNode | null;

export class IdentifierNode extends ExpressionNode {
  name = "";
  suite: SuiteNode | null = null; // The block in which the identifier is used.
  source = IdentifierNode_Source.UNDEFINED_SOURCE;
  node_source: IdentifierSource = null;
  function_source_is_static = false; // For non-GDScript scripts.
  source_function: FunctionNode | null = null; // TODO: Rename to disambiguate `function_source`.
  usages = 0; // Useful for binds/iterator variable.
  type = Type.IDENTIFIER;
  reduced_value: string = '';
}

export class IfNode extends Node {
  condition: ExpressionNode | null = null;
  true_block: SuiteNode | null = null;
  false_block: SuiteNode | null = null;

  type = Type.IF;
};

export class LambdaNode extends ExpressionNode {
  function: FunctionNode | null = null;
  parent_function: FunctionNode | null = null;
  parent_lambda: LambdaNode | null = null;
  captures: IdentifierNode[] = []
  captures_indices: Map<string, number> = new Map();
  use_self = false;
  type = Type.LAMBDA;

  has_name() {
    return this.function && this.function.identifier;
  }
};

export class LiteralNode extends ExpressionNode {
  value: string | Constant | null = null;
  type = Type.LITERAL;
};

export class MatchNode extends Node {
  test: ExpressionNode | null = null;
  branches: MatchBranchNode[] = []

  type = Type.MATCH;
};

export class MatchBranchNode extends Node {
  patterns: PatternNode[] = []
  block: SuiteNode | null = null;
  has_wildcard = false;
  guard_body: SuiteNode | null = null;

  type = Type.MATCH_BRANCH;
};

export class ParameterNode extends AssignableNode {
  type = Type.PARAMETER;
};

export class PassNode extends Node {
  type = Type.PASS;
};

export const enum PatternNode_Type {
  PT_LITERAL,
  PT_EXPRESSION,
  PT_BIND,
  PT_ARRAY,
  PT_DICTIONARY,
  PT_REST,
  PT_WILDCARD,
}

interface PatternNode_Pair {
  key: ExpressionNode | null;
  value_pattern: PatternNode | null;
}

type PatterNodeValue = LiteralNode | IdentifierNode | ExpressionNode | null;

export class PatternNode extends Node {
  pattern_type = PatternNode_Type.PT_LITERAL;

  value: PatterNodeValue = null;
  array: PatternNode[] = []
  rest_used = false; // For array/dict patterns.
  dictionary: PatternNode_Pair[] = [];

  binds: Map<string, IdentifierNode> = new Map();
  has_bind(name: string) { return this.binds.has(name) }
  get_bind(name: string) { return this.binds.get(name) }
  type = Type.PATTERN;
};

export class PreloadNode extends ExpressionNode {
  path: ExpressionNode | null = null;
  resolved_path = "";
  resource: any;
  type = Type.PRELOAD;
};

export class ReturnNode extends Node {
  return_value: ExpressionNode | null = null;
  void_return = false;
  type = Type.RETURN;
};

export class SelfNode extends ExpressionNode {
  current_class: ClassNode | null = null;
  type = Type.SELF;
};

export class SignalNode extends Node {
  identifier: IdentifierNode | null = null;
  parameters: ParameterNode[] = []
  parameters_indices: Map<string, number> = new Map();
  usages = 0;
  type = Type.SIGNAL;
};

export class SubscriptNode extends ExpressionNode {
  base: ExpressionNode | null = null;
  index: ExpressionNode | null = null;
  attribute: IdentifierNode | null = null;

  is_attribute = false;
  type = Type.SUBSCRIPT;
};

export class TernaryOpNode extends ExpressionNode {
  // Only one ternary operation exists, so no abstraction here.
  condition: ExpressionNode | null = null;
  true_expr: ExpressionNode | null = null;
  false_expr: ExpressionNode | null = null;

  type = Type.TERNARY_OPERATOR;
};

export class TypeNode extends Node {
  type_chain: IdentifierNode[] = []
  container_types: TypeNode[] = []

  get_container_type_or_null(p_index: number) {
    return p_index >= 0 && p_index < this.container_types.length ? this.container_types[p_index] : null;
  }

  type = Type.TYPE;
};

export class TypeTestNode extends ExpressionNode {
  operand: ExpressionNode | null = null;
  test_type: TypeNode | null = null;
  //test_datatype: DataType = {};

  type = Type.TYPE_TEST;
};

export const enum UnaryOpNode_OpType {
  OP_POSITIVE,
  OP_NEGATIVE,
  OP_COMPLEMENT,
  OP_LOGIC_NOT,
};

export class UnaryOpNode extends ExpressionNode {
  operation = UnaryOpNode_OpType.OP_POSITIVE;
  variant_op = VariantOperator.OP_MAX;
  operand: ExpressionNode | null = null;

  type = Type.UNARY_OPERATOR;
};

export const enum VariableNode_PropertyStyle {
  PROP_NONE,
  PROP_INLINE,
  PROP_SETGET,
};

type VariableNodeGetterSetter = FunctionNode | IdentifierNode | null;

export class VariableNode extends AssignableNode {

  property = VariableNode_PropertyStyle.PROP_NONE;
  setter: VariableNodeGetterSetter = null;

  setter_parameter: IdentifierNode | null = null;
  getter: VariableNodeGetterSetter = null;


  exported = false;
  onready = false;
  assignments = 0;
  is_static = false;
  type = Type.VARIABLE;


  export_info: PropertyInfo = new PropertyInfo("NIL", "");
};

export class WhileNode extends Node {
  condition: ExpressionNode | null = null;
  loop: SuiteNode | null = null;

  type = Type.WHILE;
};

export const enum SuiteNode_Local_Type {
  UNDEFINED,
  CONSTANT,
  VARIABLE,
  PARAMETER,
  FOR_VARIABLE,
  PATTERN_BIND,
}

type Suite_Node_Local_T = ConstantNode | VariableNode | ParameterNode | IdentifierNode | null;

export class SuiteNode_Local {
  name: string;
  type: SuiteNode_Local_Type;

  static getType(v: Suite_Node_Local_T): SuiteNode_Local_Type {
    if (v instanceof ConstantNode) return SuiteNode_Local_Type.CONSTANT;
    if (v instanceof VariableNode) return SuiteNode_Local_Type.VARIABLE;
    if (v instanceof ParameterNode) return SuiteNode_Local_Type.PARAMETER;
    if (v instanceof IdentifierNode) return SuiteNode_Local_Type.FOR_VARIABLE;
    return SuiteNode_Local_Type.UNDEFINED;
  }

  static getName(v: Suite_Node_Local_T): string {
    if (v == null) {
      return "";
    }
    if (v instanceof IdentifierNode) {
      return v.name;
    }
    return v.identifier!.name;
  }

  get_name() { return this.name }

  constructor(public value: Suite_Node_Local_T, public source_function: FunctionNode | null = null) {
    this.name = SuiteNode_Local.getName(value);
    this.type = SuiteNode_Local.getType(value);
  }
}

export class SuiteNode extends Node {
  parent_block: SuiteNode | null = null;
  statements: Node[] = [];
  empty: SuiteNode_Local = new SuiteNode_Local(null);
  locals: SuiteNode_Local[] = [];
  locals_indices: Map<string, number> = new Map();

  parent_function: FunctionNode | null = null;
  parent_if: IfNode | null = null;

  has_return = false;
  has_continue = false;
  has_unreachable_code = false; // Just so warnings aren't given more than once per block.
  is_in_loop = false; // The block is nested in a loop (directly or indirectly).

  type = Type.SUITE;

  has_local(p_name: string) { return this.locals_indices.has(p_name) };
  get_local(p_name: string) { return this.locals[this.locals_indices.get(p_name)!] || new SuiteNode_Local(null) };

  add_local(p_local: SuiteNode_Local | Suite_Node_Local_T, p_source_function: FunctionNode | null = null) {
    if (p_local instanceof SuiteNode_Local) {
      this.locals_indices.set(p_local.name, this.locals.length);
      this.locals.push(p_local);
    } else {
      const local = new SuiteNode_Local(p_local, p_source_function);
      this.locals_indices.set(local.name, this.locals.length);
      this.locals.push(local);
    }
  }
}

export const enum AnnotationInfo_TargetKind {
  NONE = 0,
  SCRIPT = 1 << 0,
  CLASS = 1 << 1,
  VARIABLE = 1 << 2,
  CONSTANT = 1 << 3,
  SIGNAL = 1 << 4,
  FUNCTION = 1 << 5,
  STATEMENT = 1 << 6,
  STANDALONE = 1 << 7,
  CLASS_LEVEL = CLASS | VARIABLE | CONSTANT | SIGNAL | FUNCTION,
}

type AnnotationAction = (p_annotation: AnnotationNode, p_target: Node, p_class: ClassNode) => void;

function register_annotation(methodInfo: MethodInfo, kind: AnnotationInfo_TargetKind) {
  const info = new AnnotationInfo();
  info.target_kind = kind;
  info.info = methodInfo;
  valid_annotations[methodInfo.name] = info;
}

export function registerAnnotations() {
  register_annotation(new MethodInfo("@tool"), AnnotationInfo_TargetKind.SCRIPT);
  register_annotation(new MethodInfo("@icon", new PropertyInfo("STRING", "icon_path")), AnnotationInfo_TargetKind.SCRIPT);
  register_annotation(new MethodInfo("@static_unload"), AnnotationInfo_TargetKind.SCRIPT);

  register_annotation(new MethodInfo("@onready"), AnnotationInfo_TargetKind.VARIABLE);
  // Export annotations.
  register_annotation(new MethodInfo("@export"), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_enum", new PropertyInfo("STRING", "names")), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_file", new PropertyInfo("STRING", "filter")), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_dir"), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_global_file", new PropertyInfo("STRING", "filter")), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_global_dir"), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_multiline"), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_placeholder", new PropertyInfo("STRING", "placeholder")), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_range", new PropertyInfo("FLOAT", "min"), new PropertyInfo("FLOAT", "max"), new PropertyInfo("FLOAT", "step"), new PropertyInfo("STRING", "extra_hints")), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_exp_easing", new PropertyInfo("STRING", "hints")), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_color_no_alpha"), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_node_path", new PropertyInfo("STRING", "type")), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_flags", new PropertyInfo("STRING", "names")), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_flags_2d_render"), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_flags_2d_physics"), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_flags_2d_navigation"), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_flags_3d_render"), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_flags_3d_physics"), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_flags_3d_navigation"), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_flags_avoidance"), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_storage"), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_custom", new PropertyInfo("INT", "hint"), new PropertyInfo("STRING", "hint_string"), new PropertyInfo("INT", "usage")), AnnotationInfo_TargetKind.VARIABLE);
  register_annotation(new MethodInfo("@export_tool_button", new PropertyInfo("STRING", "text"), new PropertyInfo("STRING", "icon")), AnnotationInfo_TargetKind.VARIABLE);
  // Export grouping annotations.
  register_annotation(new MethodInfo("@export_category", new PropertyInfo("STRING", "name")), AnnotationInfo_TargetKind.STANDALONE);
  register_annotation(new MethodInfo("@export_group", new PropertyInfo("STRING", "name"), new PropertyInfo("STRING", "prefix")), AnnotationInfo_TargetKind.STANDALONE);
  register_annotation(new MethodInfo("@export_subgroup", new PropertyInfo("STRING", "name"), new PropertyInfo("STRING", "prefix")), AnnotationInfo_TargetKind.STANDALONE);
  // Warning annotations.
  register_annotation(new MethodInfo("@warning_ignore", new PropertyInfo("STRING", "warning")), AnnotationInfo_TargetKind.CLASS_LEVEL | AnnotationInfo_TargetKind.STATEMENT);
  // Networking.
  register_annotation(new MethodInfo("@rpc", new PropertyInfo("STRING", "mode"), new PropertyInfo("STRING", "sync"), new PropertyInfo("STRING", "transfer_mode"), new PropertyInfo("INT", "transfer_channel")), AnnotationInfo_TargetKind.FUNCTION);

}


export class AnnotationInfo {
  target_kind = AnnotationInfo_TargetKind.NONE; // Flags.
  apply: AnnotationAction | null = null;
  info: MethodInfo = { name: '', props: [] };
}

class MethodInfo {
  public props: PropertyInfo[];
  constructor(public name: string, ...props: PropertyInfo[]) {
    this.props = props;
  }
}
