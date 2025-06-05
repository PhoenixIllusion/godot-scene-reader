import { assertType, unwrap_dictionary, unwrap_string } from "../../parse/binary/util/assert_unpack";
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
        this.connections = [];
        this.paths = {};
        const _bundled = resource.properties["_bundled"];
        if (!_bundled) {
            throw new Error("PackedScene only coded for bundled scene.");
        }
        if (!(_bundled.type == 'dictionary')) {
            throw new Error("PackedScene _bundled not Dictionary");
        }
        const bundle = unwrap_dictionary(_bundled);
        let version = 1;
        if (bundle['version']) {
            version = assertType(bundle['version'], "int32").value;
        }
        const names = [];
        {
            const _names = assertType(bundle['names'], "packed_string_array");
            _names.value.forEach(v => names.push(unwrap_string(v)));
        }
        const variants = assertType(bundle['variants'], "array").value;
        const conns = assertType(bundle['conns'], "packed_int32_array").value;
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
            let node = this.nodes[0];
            let remaining_path = nodePath;
            if (this.nodes[0].type != "_instantiated") { // root is extern, we can't look anything up
                const n = this.findNode(nodePath);
                node = n.node;
                remaining_path = n.remaining_path;
            }
            if (node == this.nodes[0] && remaining_path.length == 0)
                throw new Error(`Unable to lookup path [${is_path.names.map(x => x.value).join('/')}]`);
            return {
                parent: node || null, path: [...nodePath, name], is_path: { full_path: is_path, remaining_path }
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
                path,
                parent: parent ? this.nodes.indexOf(parent) : null,
                is_path,
                owner,
                type: type === PackedScene_Flags.TYPE_INSTANTIATED ? "_instantiated" : names[type],
                name: names[name],
                index,
                instance: get_node_instance(instance, parent),
                groups: [],
                properties: {},
                children: [],
                connections: []
            };
            if (parent) {
                parent.children.push(this.nodes.length);
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
        idx = 0;
        while (idx < conns.length) {
            const from = conns[idx++];
            const to = conns[idx++];
            const signal = conns[idx++];
            const method = conns[idx++];
            const flags = conns[idx++];
            const binds_length = conns[idx++];
            const binds = [];
            for (let i = 0; i < binds_length; i++) {
                binds.push(conns[idx++]);
            }
            let unbinds = undefined;
            ;
            if (version >= 3) {
                unbinds = conns[idx++];
            }
            this.connections.push({
                from, to, signal: names[signal], method: names[method], flags, binds: binds.map(x => variants[x]), unbinds
            });
        }
    }
    findNode(nodePath) {
        let result = this.nodes[0];
        let remaining_path = [];
        for (const [idx, node] of nodePath.entries()) {
            const result_idx = result?.children.find(x => this.nodes[x].name == node);
            remaining_path = nodePath.slice(idx + 1);
            if (result_idx === undefined) {
                throw new Error(`Unable to lookup path [${nodePath.join('/')}]`);
            }
            result = this.nodes[result_idx];
            if (result?.type == "_instantiated")
                break;
        }
        return {
            node: result, remaining_path
        };
    }
}
