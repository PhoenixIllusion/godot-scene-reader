import { InternalResourceEntry } from "../../parse/binary/resource.js";
import { assertType, unwrap_dictionary, unwrap_string } from "../../parse/binary/util/assert_unpack.js";
import { Array, Dictionary, Integer, NodePath, PackedInt32Array, PackedStringArray, VariantType
  } from "../../parse/binary/variant.js";

export const enum PackedScene_NameMask {
  NO_PARENT_SAVED = 0x7FFFFFFF,
  NAME_INDEX_BITS = 18,
  NAME_MASK = (1 << NAME_INDEX_BITS) - 1,
};
export const enum PackedScene_Flags {
  FLAG_ID_IS_PATH = (1 << 30),
  TYPE_INSTANTIATED = 0x7FFFFFFF,
  FLAG_INSTANCE_IS_PLACEHOLDER = (1 << 30),
  FLAG_PATH_PROPERTY_IS_NODE = (1 << 30),
  FLAG_PROP_NAME_MASK = FLAG_PATH_PROPERTY_IS_NODE - 1,
  FLAG_MASK = (1 << 24) - 1,
}

interface PathResolution { full_path: NodePath, remaining_path: string[] };

export interface NodeConnection {
  from: number;
  to: number;
  signal: string;
  method: string;
  flags: number;
  binds: VariantType[];
  unbinds?: number;
}

export interface SceneNode {
  path: string[];
  is_path: null | PathResolution;
  owner: number;
  type: string;
  parent: number | null;
  name: string;
  index: number;
  instance: VariantType | null;
  properties: Record<string, VariantType>;
  groups: number[];
  children: number[];
  connections: [];
}

export class PackedScene {

  nodes: SceneNode[] = [];
  connections: NodeConnection[] = [];
  paths: Record<string, SceneNode> = {};

  constructor(resource: InternalResourceEntry) {
    const _bundled = resource.properties["_bundled"];
    if (!_bundled) {
      throw new Error("PackedScene only coded for bundled scene.")
    }
    if (!(_bundled.type == 'dictionary')) {
      throw new Error("PackedScene _bundled not Dictionary")
    }
    const bundle = unwrap_dictionary(<Dictionary>_bundled);

    let version = 1;
    if(bundle['version']) {
      version = assertType<Integer>(bundle['version'], "int32").value ;
    }
    const names: string[] = [];
    {
      const _names: PackedStringArray = assertType(bundle['names'], "packed_string_array");
      _names.value.forEach(v => names.push(unwrap_string(v)));
    }

    const variants: VariantType[] = assertType<Array>(bundle['variants'], "array").value;

    const conns = assertType<PackedInt32Array>(bundle['conns'], "packed_int32_array").value

    //const node_count = assertType<Integer>(bundle['node_count'], "int32").value;
    const nodes = assertType<PackedInt32Array>(bundle['nodes'], "packed_int32_array").value
    const node_paths = assertType<Array>(bundle['node_paths'], "array").value as NodePath[];

    const base_scene_idx = bundle['base_scene'] ? assertType<Integer>(bundle['base_scene'], "int32").value : -1;

    function get_node_instance(instance: number, parent: SceneNode | null): VariantType | null {
      if (instance >= 0) {
        if (instance & PackedScene_Flags.FLAG_INSTANCE_IS_PLACEHOLDER) {
          return { type: 'placeholder' }
        } else {
          return variants[instance & PackedScene_Flags.FLAG_MASK]
        }
      } else if (parent == null) {
        if (base_scene_idx >= 0) {
          return variants[base_scene_idx]
        }
      }
      return null;
    }

    const resolveParent = (parent_idx: number, is_path: NodePath | null, name: string): { parent: null | SceneNode, path: string[], is_path: null | PathResolution } => {
      if (parent_idx < 0) {
        return { parent: null, path: [], is_path: null }
      }
      if (!is_path) {
        const parent = this.nodes[parent_idx];
        const path = [...parent.path, name];
        return { parent, path, is_path: null };
      }
      const nodePath = is_path.names.map(x => x.value);
      let node: SceneNode | undefined  = this.nodes[0];
      let remaining_path = nodePath;
      if(this.nodes[0].type != "_instantiated") { // root is extern, we can't look anything up
        const n = this.findNode(nodePath);
        node = n.node;
        remaining_path = n.remaining_path;
      }
      if (node == this.nodes[0] && remaining_path.length == 0)
        throw new Error(`Unable to lookup path [${is_path.names.map(x => x.value).join('/')}]`);
      return {
        parent: node || null, path: [...nodePath, name], is_path: { full_path: is_path, remaining_path }
      }
    }

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
      const node: SceneNode = {
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
      }
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
      const binds: number[] = [];
      for(let i=0;i<binds_length;i++) {
        binds.push(conns[idx++]);
      }
      let unbinds: number | undefined = undefined;;
      if(version >= 3) {
        unbinds = conns[idx++];
      }
      this.connections.push({
        from, to, signal: names[signal], method: names[method], flags, binds: binds.map(x => variants[x]), unbinds
      })
    }

  }
  findNode(nodePath: string[]): { node: SceneNode|undefined, remaining_path: string[] } {
    let result: SceneNode|undefined = this.nodes[0];
    let remaining_path: string[] = [];

    for (const [idx, node] of nodePath.entries()) {
      const result_idx: number | undefined = result?.children.find(x => this.nodes[x].name == node);
      remaining_path = nodePath.slice(idx + 1);
      if (result_idx === undefined) {
        throw new Error(`Unable to lookup path [${nodePath.join('/')}]`);
      }
      result = this.nodes[result_idx];
      if (result?.type == "_instantiated")
        break
    }

    return {
      node: result, remaining_path
    }
  }

}