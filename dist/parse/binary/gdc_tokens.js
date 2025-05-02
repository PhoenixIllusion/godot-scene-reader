export var TokenType;
(function (TokenType) {
    TokenType[TokenType["EMPTY"] = 0] = "EMPTY";
    // Basic
    TokenType[TokenType["ANNOTATION"] = 1] = "ANNOTATION";
    TokenType[TokenType["IDENTIFIER"] = 2] = "IDENTIFIER";
    TokenType[TokenType["LITERAL"] = 3] = "LITERAL";
    // Comparison
    TokenType[TokenType["LESS"] = 4] = "LESS";
    TokenType[TokenType["LESS_EQUAL"] = 5] = "LESS_EQUAL";
    TokenType[TokenType["GREATER"] = 6] = "GREATER";
    TokenType[TokenType["GREATER_EQUAL"] = 7] = "GREATER_EQUAL";
    TokenType[TokenType["EQUAL_EQUAL"] = 8] = "EQUAL_EQUAL";
    TokenType[TokenType["BANG_EQUAL"] = 9] = "BANG_EQUAL";
    // Logical
    TokenType[TokenType["AND"] = 10] = "AND";
    TokenType[TokenType["OR"] = 11] = "OR";
    TokenType[TokenType["NOT"] = 12] = "NOT";
    TokenType[TokenType["AMPERSAND_AMPERSAND"] = 13] = "AMPERSAND_AMPERSAND";
    TokenType[TokenType["PIPE_PIPE"] = 14] = "PIPE_PIPE";
    TokenType[TokenType["BANG"] = 15] = "BANG";
    // Bitwise
    TokenType[TokenType["AMPERSAND"] = 16] = "AMPERSAND";
    TokenType[TokenType["PIPE"] = 17] = "PIPE";
    TokenType[TokenType["TILDE"] = 18] = "TILDE";
    TokenType[TokenType["CARET"] = 19] = "CARET";
    TokenType[TokenType["LESS_LESS"] = 20] = "LESS_LESS";
    TokenType[TokenType["GREATER_GREATER"] = 21] = "GREATER_GREATER";
    // Math
    TokenType[TokenType["PLUS"] = 22] = "PLUS";
    TokenType[TokenType["MINUS"] = 23] = "MINUS";
    TokenType[TokenType["STAR"] = 24] = "STAR";
    TokenType[TokenType["STAR_STAR"] = 25] = "STAR_STAR";
    TokenType[TokenType["SLASH"] = 26] = "SLASH";
    TokenType[TokenType["PERCENT"] = 27] = "PERCENT";
    // Assignment
    TokenType[TokenType["EQUAL"] = 28] = "EQUAL";
    TokenType[TokenType["PLUS_EQUAL"] = 29] = "PLUS_EQUAL";
    TokenType[TokenType["MINUS_EQUAL"] = 30] = "MINUS_EQUAL";
    TokenType[TokenType["STAR_EQUAL"] = 31] = "STAR_EQUAL";
    TokenType[TokenType["STAR_STAR_EQUAL"] = 32] = "STAR_STAR_EQUAL";
    TokenType[TokenType["SLASH_EQUAL"] = 33] = "SLASH_EQUAL";
    TokenType[TokenType["PERCENT_EQUAL"] = 34] = "PERCENT_EQUAL";
    TokenType[TokenType["LESS_LESS_EQUAL"] = 35] = "LESS_LESS_EQUAL";
    TokenType[TokenType["GREATER_GREATER_EQUAL"] = 36] = "GREATER_GREATER_EQUAL";
    TokenType[TokenType["AMPERSAND_EQUAL"] = 37] = "AMPERSAND_EQUAL";
    TokenType[TokenType["PIPE_EQUAL"] = 38] = "PIPE_EQUAL";
    TokenType[TokenType["CARET_EQUAL"] = 39] = "CARET_EQUAL";
    // Control flow
    TokenType[TokenType["IF"] = 40] = "IF";
    TokenType[TokenType["ELIF"] = 41] = "ELIF";
    TokenType[TokenType["ELSE"] = 42] = "ELSE";
    TokenType[TokenType["FOR"] = 43] = "FOR";
    TokenType[TokenType["WHILE"] = 44] = "WHILE";
    TokenType[TokenType["BREAK"] = 45] = "BREAK";
    TokenType[TokenType["CONTINUE"] = 46] = "CONTINUE";
    TokenType[TokenType["PASS"] = 47] = "PASS";
    TokenType[TokenType["RETURN"] = 48] = "RETURN";
    TokenType[TokenType["MATCH"] = 49] = "MATCH";
    TokenType[TokenType["WHEN"] = 50] = "WHEN";
    // Keywords
    TokenType[TokenType["AS"] = 51] = "AS";
    TokenType[TokenType["ASSERT"] = 52] = "ASSERT";
    TokenType[TokenType["AWAIT"] = 53] = "AWAIT";
    TokenType[TokenType["BREAKPOINT"] = 54] = "BREAKPOINT";
    TokenType[TokenType["CLASS"] = 55] = "CLASS";
    TokenType[TokenType["CLASS_NAME"] = 56] = "CLASS_NAME";
    TokenType[TokenType["CONST"] = 57] = "CONST";
    TokenType[TokenType["ENUM"] = 58] = "ENUM";
    TokenType[TokenType["EXTENDS"] = 59] = "EXTENDS";
    TokenType[TokenType["FUNC"] = 60] = "FUNC";
    TokenType[TokenType["IN"] = 61] = "IN";
    TokenType[TokenType["IS"] = 62] = "IS";
    TokenType[TokenType["NAMESPACE"] = 63] = "NAMESPACE";
    TokenType[TokenType["PRELOAD"] = 64] = "PRELOAD";
    TokenType[TokenType["SELF"] = 65] = "SELF";
    TokenType[TokenType["SIGNAL"] = 66] = "SIGNAL";
    TokenType[TokenType["STATIC"] = 67] = "STATIC";
    TokenType[TokenType["SUPER"] = 68] = "SUPER";
    TokenType[TokenType["TRAIT"] = 69] = "TRAIT";
    TokenType[TokenType["VAR"] = 70] = "VAR";
    TokenType[TokenType["VOID"] = 71] = "VOID";
    TokenType[TokenType["YIELD"] = 72] = "YIELD";
    // Punctuation
    TokenType[TokenType["BRACKET_OPEN"] = 73] = "BRACKET_OPEN";
    TokenType[TokenType["BRACKET_CLOSE"] = 74] = "BRACKET_CLOSE";
    TokenType[TokenType["BRACE_OPEN"] = 75] = "BRACE_OPEN";
    TokenType[TokenType["BRACE_CLOSE"] = 76] = "BRACE_CLOSE";
    TokenType[TokenType["PARENTHESIS_OPEN"] = 77] = "PARENTHESIS_OPEN";
    TokenType[TokenType["PARENTHESIS_CLOSE"] = 78] = "PARENTHESIS_CLOSE";
    TokenType[TokenType["COMMA"] = 79] = "COMMA";
    TokenType[TokenType["SEMICOLON"] = 80] = "SEMICOLON";
    TokenType[TokenType["PERIOD"] = 81] = "PERIOD";
    TokenType[TokenType["PERIOD_PERIOD"] = 82] = "PERIOD_PERIOD";
    TokenType[TokenType["COLON"] = 83] = "COLON";
    TokenType[TokenType["DOLLAR"] = 84] = "DOLLAR";
    TokenType[TokenType["FORWARD_ARROW"] = 85] = "FORWARD_ARROW";
    TokenType[TokenType["UNDERSCORE"] = 86] = "UNDERSCORE";
    // Whitespace
    TokenType[TokenType["NEWLINE"] = 87] = "NEWLINE";
    TokenType[TokenType["INDENT"] = 88] = "INDENT";
    TokenType[TokenType["DEDENT"] = 89] = "DEDENT";
    // Constants
    TokenType[TokenType["CONST_PI"] = 90] = "CONST_PI";
    TokenType[TokenType["CONST_TAU"] = 91] = "CONST_TAU";
    TokenType[TokenType["CONST_INF"] = 92] = "CONST_INF";
    TokenType[TokenType["CONST_NAN"] = 93] = "CONST_NAN";
    // Error message improvement
    TokenType[TokenType["VCS_CONFLICT_MARKER"] = 94] = "VCS_CONFLICT_MARKER";
    TokenType[TokenType["BACKTICK"] = 95] = "BACKTICK";
    TokenType[TokenType["QUESTION_MARK"] = 96] = "QUESTION_MARK";
    // Special
    TokenType[TokenType["ERROR"] = 97] = "ERROR";
    TokenType[TokenType["TK_EOF"] = 98] = "TK_EOF";
    TokenType[TokenType["TK_MAX"] = 99] = "TK_MAX";
})(TokenType || (TokenType = {}));
;
