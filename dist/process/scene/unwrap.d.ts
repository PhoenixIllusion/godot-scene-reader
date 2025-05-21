import { InternalResourceEntry } from "../../parse/binary/resource";
import { Dictionary, VariantType } from "../../parse/binary/variant";
export type LinkRef = {
    type: 'ref';
    value: InternalResourceEntry;
};
export declare function unwrap_property_array<T>(properties: Record<string, any>, field: string, keys: string[]): T[];
export declare function unwrap_array(array: VariantType): VariantType[];
export declare function unwrap_dictionary(dictionary: Dictionary): Record<string, VariantType>;
export declare function unwrap_property<T>(v: VariantType): T;
export declare function unwrap_properties<T extends Record<string, any>>(properties: Record<string, VariantType>): T;
