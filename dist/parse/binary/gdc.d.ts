import { TokenType } from "./gdc_tokens.js";
import { decode_variant } from "./unmarshaller.js";
export interface Token {
    type: TokenType;
    start_line: number;
    literal?: string | Constant;
}
export interface Constant {
    type: number;
    type_s: string;
    val: ReturnType<typeof decode_variant>;
}
export interface GdcFile {
    header: string;
    version: number;
    identifiers: string[];
    constants: Constant[];
    token_lines: Record<number, number>;
    token_columns: Record<number, number>;
    tokens: Token[];
}
export declare function try_open_gdc(arrayBuffer: ArrayBuffer): {
    header: string;
    version: number;
    identifiers: string[];
    constants: Constant[];
    token_lines: Record<number, number>;
    token_columns: Record<number, number>;
    tokens: Token[];
};
