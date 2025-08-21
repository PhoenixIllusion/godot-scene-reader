import { cTexFile } from "../parse/binary/gst2.js";
import { InternalResourceEntry } from "../parse/binary/resource.js";
import type { PckFile } from "../pck/parser.js";
import { ClassNode } from "./gdc/type.js";
export interface PCK {
    project?: Record<string, any>;
    resources: Record<string, {
        internal_entries: InternalResourceEntry[];
    }>;
    ctex: Record<string, cTexFile>;
    remap: Record<string, Record<string, string>>;
    gdc: Record<string, ClassNode>;
}
export declare function process_pck_file(pack: PckFile): Promise<PCK>;
