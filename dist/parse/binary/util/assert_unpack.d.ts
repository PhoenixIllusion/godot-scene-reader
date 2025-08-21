import { Dictionary, VariantType } from "../variant.js";
export declare function unwrap_string(variant: VariantType): string;
export declare function assertType<T>(variantT: VariantType, type: string): T;
export declare function unwrap_dictionary(dictionary: Dictionary): Record<string, VariantType>;
export declare function unwrap_array(array: VariantType): VariantType[];
export declare function unwrap_array_map<T>(array: VariantType, type: string): T[];
export declare function unwrap_value<T>(variant: VariantType): T;
