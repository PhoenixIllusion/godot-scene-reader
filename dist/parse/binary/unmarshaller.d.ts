import { GodotReader } from "./util/reader";
export declare function unmarshaller_type_as_string(kind: number): string;
export declare function decode_variant(kind: number, f: GodotReader): string | number | boolean | any[] | Map<any, any> | {
    name: string;
    props: Map<any, any>;
};
