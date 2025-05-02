import { InternalResourceEntry } from "../resource";
import { Dictionary, VariantType } from "../variant";
export declare function unwrap_string(variant: VariantType): string;
export declare function assertType<T>(variantT: VariantType, type: string): T;
export declare function unwrap_props(resource: InternalResourceEntry): Record<string, VariantType>;
export declare function unwrap_dictionary(dictionary: Dictionary): Record<string, VariantType>;
