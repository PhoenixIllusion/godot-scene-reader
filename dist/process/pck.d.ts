import { cTexFile } from "../parse/binary/gst2";
import { InternalResourceEntry } from "../parse/binary/resource";
import type { PckFile } from "../pck/parser";
import { ClassNode } from "./gdc/type";
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
