export var Precedence;
(function (Precedence) {
    Precedence[Precedence["PREC_NONE"] = 0] = "PREC_NONE";
    Precedence[Precedence["PREC_ASSIGNMENT"] = 1] = "PREC_ASSIGNMENT";
    Precedence[Precedence["PREC_CAST"] = 2] = "PREC_CAST";
    Precedence[Precedence["PREC_TERNARY"] = 3] = "PREC_TERNARY";
    Precedence[Precedence["PREC_LOGIC_OR"] = 4] = "PREC_LOGIC_OR";
    Precedence[Precedence["PREC_LOGIC_AND"] = 5] = "PREC_LOGIC_AND";
    Precedence[Precedence["PREC_LOGIC_NOT"] = 6] = "PREC_LOGIC_NOT";
    Precedence[Precedence["PREC_CONTENT_TEST"] = 7] = "PREC_CONTENT_TEST";
    Precedence[Precedence["PREC_COMPARISON"] = 8] = "PREC_COMPARISON";
    Precedence[Precedence["PREC_BIT_OR"] = 9] = "PREC_BIT_OR";
    Precedence[Precedence["PREC_BIT_XOR"] = 10] = "PREC_BIT_XOR";
    Precedence[Precedence["PREC_BIT_AND"] = 11] = "PREC_BIT_AND";
    Precedence[Precedence["PREC_BIT_SHIFT"] = 12] = "PREC_BIT_SHIFT";
    Precedence[Precedence["PREC_ADDITION_SUBTRACTION"] = 13] = "PREC_ADDITION_SUBTRACTION";
    Precedence[Precedence["PREC_FACTOR"] = 14] = "PREC_FACTOR";
    Precedence[Precedence["PREC_SIGN"] = 15] = "PREC_SIGN";
    Precedence[Precedence["PREC_BIT_NOT"] = 16] = "PREC_BIT_NOT";
    Precedence[Precedence["PREC_POWER"] = 17] = "PREC_POWER";
    Precedence[Precedence["PREC_TYPE_TEST"] = 18] = "PREC_TYPE_TEST";
    Precedence[Precedence["PREC_AWAIT"] = 19] = "PREC_AWAIT";
    Precedence[Precedence["PREC_CALL"] = 20] = "PREC_CALL";
    Precedence[Precedence["PREC_ATTRIBUTE"] = 21] = "PREC_ATTRIBUTE";
    Precedence[Precedence["PREC_SUBSCRIPT"] = 22] = "PREC_SUBSCRIPT";
    Precedence[Precedence["PREC_PRIMARY"] = 23] = "PREC_PRIMARY";
})(Precedence || (Precedence = {}));
export function get_rule(parser, p_token_type) {
    // Function table for expression parsing.
    // clang-format destroys the alignment here, so turn off for the table.
    /* clang-format off */
    const parse_identifier = parser.parse_identifier.bind(parser);
    const parse_literal = parser.parse_literal.bind(parser);
    const parse_unary_operator = parser.parse_unary_operator.bind(parser);
    const parse_get_node = parser.parse_get_node.bind(parser);
    const parse_await = parser.parse_await.bind(parser);
    const parse_lambda = parser.parse_lambda.bind(parser);
    const parse_preload = parser.parse_preload.bind(parser);
    const parse_self = parser.parse_self.bind(parser);
    const parse_call = parser.parse_call.bind(parser);
    const parse_yield = parser.parse_yield.bind(parser);
    const parse_array = parser.parse_array.bind(parser);
    const parse_dictionary = parser.parse_dictionary.bind(parser);
    const parse_grouping = parser.parse_grouping.bind(parser);
    const parse_builtin_constant = parser.parse_builtin_constant.bind(parser);
    const parse_binary_operator = parser.parse_binary_operator.bind(parser);
    const parse_cast = parser.parse_cast.bind(parser);
    const parse_binary_not_in_operator = parser.parse_binary_not_in_operator.bind(parser);
    const parse_assignment = parser.parse_assignment.bind(parser);
    const parse_ternary_operator = parser.parse_ternary_operator.bind(parser);
    const parse_type_test = parser.parse_type_test.bind(parser);
    const parse_subscript = parser.parse_subscript.bind(parser);
    const parse_attribute = parser.parse_attribute.bind(parser);
    const parse_invalid_token = parser.parse_invalid_token.bind(parser);
    const rules = [
        // PREFIX                                           INFIX                                           PRECEDENCE (for infix)
        [null, null, Precedence.PREC_NONE], // EMPTY,
        // Basic
        [null, null, Precedence.PREC_NONE], // ANNOTATION,
        [parse_identifier, null, Precedence.PREC_NONE], // IDENTIFIER,
        [parse_literal, null, Precedence.PREC_NONE], // LITERAL,
        // Comparison
        [null, parse_binary_operator, Precedence.PREC_COMPARISON], // LESS,
        [null, parse_binary_operator, Precedence.PREC_COMPARISON], // LESS_EQUAL,
        [null, parse_binary_operator, Precedence.PREC_COMPARISON], // GREATER,
        [null, parse_binary_operator, Precedence.PREC_COMPARISON], // GREATER_EQUAL,
        [null, parse_binary_operator, Precedence.PREC_COMPARISON], // EQUAL_EQUAL,
        [null, parse_binary_operator, Precedence.PREC_COMPARISON], // BANG_EQUAL,
        // Logical
        [null, parse_binary_operator, Precedence.PREC_LOGIC_AND], // AND,
        [null, parse_binary_operator, Precedence.PREC_LOGIC_OR], // OR,
        [parse_unary_operator, parse_binary_not_in_operator, Precedence.PREC_CONTENT_TEST], // NOT,
        [null, parse_binary_operator, Precedence.PREC_LOGIC_AND], // AMPERSAND_AMPERSAND,
        [null, parse_binary_operator, Precedence.PREC_LOGIC_OR], // PIPE_PIPE,
        [parse_unary_operator, null, Precedence.PREC_NONE], // BANG,
        // Bitwise
        [null, parse_binary_operator, Precedence.PREC_BIT_AND], // AMPERSAND,
        [null, parse_binary_operator, Precedence.PREC_BIT_OR], // PIPE,
        [parse_unary_operator, null, Precedence.PREC_NONE], // TILDE,
        [null, parse_binary_operator, Precedence.PREC_BIT_XOR], // CARET,
        [null, parse_binary_operator, Precedence.PREC_BIT_SHIFT], // LESS_LESS,
        [null, parse_binary_operator, Precedence.PREC_BIT_SHIFT], // GREATER_GREATER,
        // Math
        [parse_unary_operator, parse_binary_operator, Precedence.PREC_ADDITION_SUBTRACTION], // PLUS,
        [parse_unary_operator, parse_binary_operator, Precedence.PREC_ADDITION_SUBTRACTION], // MINUS,
        [null, parse_binary_operator, Precedence.PREC_FACTOR], // STAR,
        [null, parse_binary_operator, Precedence.PREC_POWER], // STAR_STAR,
        [null, parse_binary_operator, Precedence.PREC_FACTOR], // SLASH,
        [parse_get_node, parse_binary_operator, Precedence.PREC_FACTOR], // PERCENT,
        // Assignment
        [null, parse_assignment, Precedence.PREC_ASSIGNMENT], // EQUAL,
        [null, parse_assignment, Precedence.PREC_ASSIGNMENT], // PLUS_EQUAL,
        [null, parse_assignment, Precedence.PREC_ASSIGNMENT], // MINUS_EQUAL,
        [null, parse_assignment, Precedence.PREC_ASSIGNMENT], // STAR_EQUAL,
        [null, parse_assignment, Precedence.PREC_ASSIGNMENT], // STAR_STAR_EQUAL,
        [null, parse_assignment, Precedence.PREC_ASSIGNMENT], // SLASH_EQUAL,
        [null, parse_assignment, Precedence.PREC_ASSIGNMENT], // PERCENT_EQUAL,
        [null, parse_assignment, Precedence.PREC_ASSIGNMENT], // LESS_LESS_EQUAL,
        [null, parse_assignment, Precedence.PREC_ASSIGNMENT], // GREATER_GREATER_EQUAL,
        [null, parse_assignment, Precedence.PREC_ASSIGNMENT], // AMPERSAND_EQUAL,
        [null, parse_assignment, Precedence.PREC_ASSIGNMENT], // PIPE_EQUAL,
        [null, parse_assignment, Precedence.PREC_ASSIGNMENT], // CARET_EQUAL,
        // Control flow
        [null, parse_ternary_operator, Precedence.PREC_TERNARY], // IF,
        [null, null, Precedence.PREC_NONE], // ELIF,
        [null, null, Precedence.PREC_NONE], // ELSE,
        [null, null, Precedence.PREC_NONE], // FOR,
        [null, null, Precedence.PREC_NONE], // WHILE,
        [null, null, Precedence.PREC_NONE], // BREAK,
        [null, null, Precedence.PREC_NONE], // CONTINUE,
        [null, null, Precedence.PREC_NONE], // PASS,
        [null, null, Precedence.PREC_NONE], // RETURN,
        [null, null, Precedence.PREC_NONE], // MATCH,
        [null, null, Precedence.PREC_NONE], // WHEN,
        // Keywords
        [null, parse_cast, Precedence.PREC_CAST], // AS,
        [null, null, Precedence.PREC_NONE], // ASSERT,
        [parse_await, null, Precedence.PREC_NONE], // AWAIT,
        [null, null, Precedence.PREC_NONE], // BREAKPOINT,
        [null, null, Precedence.PREC_NONE], // CLASS,
        [null, null, Precedence.PREC_NONE], // CLASS_NAME,
        [null, null, Precedence.PREC_NONE], // CONST,
        [null, null, Precedence.PREC_NONE], // ENUM,
        [null, null, Precedence.PREC_NONE], // EXTENDS,
        [parse_lambda, null, Precedence.PREC_NONE], // FUNC,
        [null, parse_binary_operator, Precedence.PREC_CONTENT_TEST], // IN,
        [null, parse_type_test, Precedence.PREC_TYPE_TEST], // IS,
        [null, null, Precedence.PREC_NONE], // NAMESPACE,
        [parse_preload, null, Precedence.PREC_NONE], // PRELOAD,
        [parse_self, null, Precedence.PREC_NONE], // SELF,
        [null, null, Precedence.PREC_NONE], // SIGNAL,
        [null, null, Precedence.PREC_NONE], // STATIC,
        [parse_call, null, Precedence.PREC_NONE], // SUPER,
        [null, null, Precedence.PREC_NONE], // TRAIT,
        [null, null, Precedence.PREC_NONE], // VAR,
        [null, null, Precedence.PREC_NONE], // VOID,
        [parse_yield, null, Precedence.PREC_NONE], // YIELD,
        // Punctuation
        [parse_array, parse_subscript, Precedence.PREC_SUBSCRIPT], // BRACKET_OPEN,
        [null, null, Precedence.PREC_NONE], // BRACKET_CLOSE,
        [parse_dictionary, null, Precedence.PREC_NONE], // BRACE_OPEN,
        [null, null, Precedence.PREC_NONE], // BRACE_CLOSE,
        [parse_grouping, parse_call, Precedence.PREC_CALL], // PARENTHESIS_OPEN,
        [null, null, Precedence.PREC_NONE], // PARENTHESIS_CLOSE,
        [null, null, Precedence.PREC_NONE], // COMMA,
        [null, null, Precedence.PREC_NONE], // SEMICOLON,
        [null, parse_attribute, Precedence.PREC_ATTRIBUTE], // PERIOD,
        [null, null, Precedence.PREC_NONE], // PERIOD_PERIOD,
        [null, null, Precedence.PREC_NONE], // COLON,
        [parse_get_node, null, Precedence.PREC_NONE], // DOLLAR,
        [null, null, Precedence.PREC_NONE], // FORWARD_ARROW,
        [null, null, Precedence.PREC_NONE], // UNDERSCORE,
        // Whitespace
        [null, null, Precedence.PREC_NONE], // NEWLINE,
        [null, null, Precedence.PREC_NONE], // INDENT,
        [null, null, Precedence.PREC_NONE], // DEDENT,
        // Constants
        [parse_builtin_constant, null, Precedence.PREC_NONE], // CONST_PI,
        [parse_builtin_constant, null, Precedence.PREC_NONE], // CONST_TAU,
        [parse_builtin_constant, null, Precedence.PREC_NONE], // CONST_INF,
        [parse_builtin_constant, null, Precedence.PREC_NONE], // CONST_NAN,
        // Error message improvement
        [null, null, Precedence.PREC_NONE], // VCS_CONFLICT_MARKER,
        [null, null, Precedence.PREC_NONE], // BACKTICK,
        [null, parse_invalid_token, Precedence.PREC_CAST], // QUESTION_MARK,
        // Special
        [null, null, Precedence.PREC_NONE], // ERROR,
        [null, null, Precedence.PREC_NONE], // TK_EOF,
    ];
    /* clang-format on */
    // Avoid desync.
    // Let's assume this is never invalid, since nothing generates a TK_MAX.
    return rules.map(([pre, inf, prec]) => ({ prefix: pre, infix: inf, precedence: prec }))[p_token_type];
}
