import { cTexFile } from "../../parse/binary/gst2";
import { Nil, Transform3D } from "../../parse/binary/variant";
import { unwrap_property_array } from "./unwrap";


export type MeshLibrary<MeshType,Shape3DType> = {
  [key: `item/${number}/mesh`]: MeshType,
  [key: `item/${number}/mesh_transform`]: Transform3D,
  [key: `item/${number}/name`]: string,
  [key: `item/${number}/navigation_mesh`]: MeshType | Nil,
  [key: `item/${number}/navigation_mesh_transform`]: Transform3D,
  [key: `item/${number}/preview`]: { type: 'ctex', value: cTexFile },
  [key: `item/${number}/shapes`]: (Shape3DType | Transform3D)[]
}

export interface MeshLibraryItem<MeshType,Shape3DType>  {
  mesh: MeshType;
  mesh_transform: Transform3D;
  name: string;
  navigation_mesh: MeshType | null;
  navigation_mesh_tranform: Transform3D;
  preview: cTexFile;
  shapes: (Shape3DType | Transform3D)[];
}

export function meshlibray_extract_items<MeshType,Shape3DType>(meshLib: MeshLibrary<MeshType,Shape3DType>) {
  return unwrap_property_array<MeshLibraryItem<MeshType,Shape3DType>>(meshLib, 'item', ['mesh', 'mesh_transform', 'name', 'navigation_mesh', 'navigation_mesh_transform', 'preview', 'shapes']);
}