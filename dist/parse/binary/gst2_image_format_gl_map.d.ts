import { ImageFormat } from "./gst2_format";
interface GL_Image_Data_Type {
    internal_format: number;
    format: number;
    type: number;
    compressed: boolean;
}
export declare function parse_ctex_image_format(image_format: ImageFormat): GL_Image_Data_Type;
export {};
