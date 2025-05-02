import { TokenType } from "../../parse/binary/gdc_tokens";
import { BinaryParser } from "./parser";
import { ExpressionNode } from "./type";
export declare const enum Precedence {
    PREC_NONE = 0,
    PREC_ASSIGNMENT = 1,
    PREC_CAST = 2,
    PREC_TERNARY = 3,
    PREC_LOGIC_OR = 4,
    PREC_LOGIC_AND = 5,
    PREC_LOGIC_NOT = 6,
    PREC_CONTENT_TEST = 7,
    PREC_COMPARISON = 8,
    PREC_BIT_OR = 9,
    PREC_BIT_XOR = 10,
    PREC_BIT_AND = 11,
    PREC_BIT_SHIFT = 12,
    PREC_ADDITION_SUBTRACTION = 13,
    PREC_FACTOR = 14,
    PREC_SIGN = 15,
    PREC_BIT_NOT = 16,
    PREC_POWER = 17,
    PREC_TYPE_TEST = 18,
    PREC_AWAIT = 19,
    PREC_CALL = 20,
    PREC_ATTRIBUTE = 21,
    PREC_SUBSCRIPT = 22,
    PREC_PRIMARY = 23
}
export type ParseFunction = (p_previous_operand: ExpressionNode | null, p_can_asign: boolean) => ExpressionNode | null;
export interface ParseRule {
    prefix: ParseFunction | null;
    infix: ParseFunction | null;
    precedence: Precedence;
}
export declare function get_rule(parser: BinaryParser, p_token_type: TokenType): ParseRule;
