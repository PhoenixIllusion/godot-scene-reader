import { unwrap_property_array } from "./unwrap";
export function meshlibray_extract_items(meshLib) {
    return unwrap_property_array(meshLib, 'item', ['mesh', 'mesh_transform', 'name', 'navigation_mesh', 'navigation_mesh_transform', 'preview', 'shapes']);
}
