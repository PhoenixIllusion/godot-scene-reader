import { assertType, unwrap_dictionary, unwrap_string } from "../../parse/binary/util/assert_unpack";
import { Dictionary } from "../../parse/binary/variant";
export var PackedScene_NameMask;
(function (PackedScene_NameMask) {
    PackedScene_NameMask[PackedScene_NameMask["NO_PARENT_SAVED"] = 2147483647] = "NO_PARENT_SAVED";
    PackedScene_NameMask[PackedScene_NameMask["NAME_INDEX_BITS"] = 18] = "NAME_INDEX_BITS";
    PackedScene_NameMask[PackedScene_NameMask["NAME_MASK"] = 262143] = "NAME_MASK";
})(PackedScene_NameMask || (PackedScene_NameMask = {}));
;
export var PackedScene_Flags;
(function (PackedScene_Flags) {
    PackedScene_Flags[PackedScene_Flags["FLAG_ID_IS_PATH"] = 1073741824] = "FLAG_ID_IS_PATH";
    PackedScene_Flags[PackedScene_Flags["TYPE_INSTANTIATED"] = 2147483647] = "TYPE_INSTANTIATED";
    PackedScene_Flags[PackedScene_Flags["FLAG_INSTANCE_IS_PLACEHOLDER"] = 1073741824] = "FLAG_INSTANCE_IS_PLACEHOLDER";
    PackedScene_Flags[PackedScene_Flags["FLAG_PATH_PROPERTY_IS_NODE"] = 1073741824] = "FLAG_PATH_PROPERTY_IS_NODE";
    PackedScene_Flags[PackedScene_Flags["FLAG_PROP_NAME_MASK"] = 1073741823] = "FLAG_PROP_NAME_MASK";
    PackedScene_Flags[PackedScene_Flags["FLAG_MASK"] = 16777215] = "FLAG_MASK";
})(PackedScene_Flags || (PackedScene_Flags = {}));
;
export class PackedScene {
    constructor(resource) {
        this.nodes = [];
        this.paths = {};
        const _bundled = resource.properties["_bundled"];
        if (!_bundled) {
            throw new Error("PackedScene only coded for bundled scene.");
        }
        if (!(_bundled instanceof Dictionary)) {
            throw new Error("PackedScene _bundled not Dictionary");
        }
        const bundle = unwrap_dictionary(_bundled);
        const names = [];
        {
            const _names = assertType(bundle['names'], "packed_string_array");
            _names.value.forEach(v => names.push(unwrap_string(v)));
        }
        const variants = assertType(bundle['variants'], "array").value;
        // const conn_count = assertType<Integer>(bundle['conn_count'], "int32").value;
        // const conns = assertType<PackedInt32Array>(bundle['conns'], "packed_int32_array").value
        //const node_count = assertType<Integer>(bundle['node_count'], "int32").value;
        const nodes = assertType(bundle['nodes'], "packed_int32_array").value;
        const node_paths = assertType(bundle['node_paths'], "array").value;
        const base_scene_idx = bundle['base_scene'] ? assertType(bundle['base_scene'], "int32").value : -1;
        function get_node_instance(instance, parent) {
            if (instance >= 0) {
                if (instance & PackedScene_Flags.FLAG_INSTANCE_IS_PLACEHOLDER) {
                    return { type: 'placeholder' };
                }
                else {
                    return variants[instance & PackedScene_Flags.FLAG_MASK];
                }
            }
            else if (parent == null) {
                if (base_scene_idx >= 0) {
                    return variants[base_scene_idx];
                }
            }
            return null;
        }
        const resolveParent = (parent_idx, is_path, name) => {
            if (parent_idx < 0) {
                return { parent: null, path: [], is_path: null };
            }
            if (!is_path) {
                const parent = this.nodes[parent_idx];
                const path = [...parent.path, name];
                return { parent, path, is_path: null };
            }
            const nodePath = is_path.names.map(x => x.value);
            const { node, remaining_path } = this.findNode(nodePath);
            if (node == this.nodes[0] && remaining_path.length == 0)
                throw new Error(`Unable to lookup path [${is_path.names.map(x => x.value).join('/')}]`);
            return {
                parent: node, path: [...nodePath, name], is_path: { full_path: is_path, remaining_path }
            };
        };
        let idx = 0;
        while (idx < nodes.length) {
            const parent_idx = nodes[idx++];
            const owner = nodes[idx++];
            const type = nodes[idx++];
            const name_index = nodes[idx++];
            const name = name_index & ((1 << PackedScene_NameMask.NAME_INDEX_BITS) - 1);
            const index = (name_index >> PackedScene_NameMask.NAME_INDEX_BITS) - 1;
            const instance = nodes[idx++];
            const node_path = (parent_idx & PackedScene_Flags.FLAG_ID_IS_PATH) ? node_paths[parent_idx & PackedScene_Flags.FLAG_MASK] : null;
            const { parent, path, is_path } = resolveParent(parent_idx, node_path, names[name]);
            const node = {
                parent,
                path,
                is_path,
                owner,
                type: type === PackedScene_Flags.TYPE_INSTANTIATED ? "_instantiated" : names[type],
                name: names[name],
                index,
                instance: get_node_instance(instance, parent),
                groups: [],
                properties: {},
                children: []
            };
            if (parent) {
                parent.children.push(node);
            }
            this.paths[node.path.join('/')] = node;
            const prop_count = nodes[idx++];
            for (let j = 0; j < prop_count; j++) {
                const name = nodes[idx++];
                const value = nodes[idx++];
                node.properties[names[name]] = variants[value];
            }
            const group_count = nodes[idx++];
            for (let j = 0; j < group_count; j++) {
                node.groups[j] = nodes[idx++];
            }
            this.nodes.push(node);
        }
    }
    findNode(nodePath) {
        let result = this.nodes[0];
        let remaining_path = [];
        for (const [idx, node] of nodePath.entries()) {
            result = result.children.find(x => x.name == node);
            remaining_path = nodePath.slice(idx + 1);
            if (!parent) {
                throw new Error(`Unable to lookup path [${nodePath.join('/')}]`);
            }
            if (result.type == "_instantiated")
                break;
        }
        return {
            node: result, remaining_path
        };
    }
}
