import { InternalResourceEntry } from "../../parse/binary/resource";
import { assertType, unwrap_dictionary, unwrap_string } from "../../parse/binary/util/assert_unpack";
import { Array, Dictionary, Integer, PackedInt32Array, PackedStringArray, VariantType } from "../../parse/binary/variant";

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

export interface SceneNode {
  parent: null | SceneNode;
  owner: number;
  type: string;

  name: string;
  index: number;
  instance: VariantType | null;
  properties: Record<string, VariantType>;
  groups: number[];
}

export class PackedScene {

  nodes: SceneNode[] = [];
  constructor(resource: InternalResourceEntry) {
    const _bundled = resource.props.find(x => x.name == "_bundled");
    if (!_bundled) {
      throw new Error("PackedScene only coded for bundled scene.")
    }
    if (!(_bundled.value instanceof Dictionary)) {
      throw new Error("PackedScene _bundled not Dictionary")
    }
    const bundle = unwrap_dictionary(_bundled.value);
    const names: string[] = [];
    {
      const _names: PackedStringArray = assertType(bundle['names'], "packed_string_array");
      _names.value.forEach(v => names.push(unwrap_string(v)));
    }

    const variants: VariantType[] = assertType<Array>(bundle['variants'], "array").value;

    //const conn_count = assertType<Integer>(bundle['conn_count'], "int32").value;
    //const conns = assertType<PackedInt32Array>(bundle['conns'], "packed_int32_array").value

    //const node_count = assertType<Integer>(bundle['node_count'], "int32").value;
    const nodes = assertType<PackedInt32Array>(bundle['nodes'], "packed_int32_array").value

    //const node_paths = assertType<Array>(bundle['node_paths'], "array").value;

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

    let idx = 0;
    while (idx < nodes.length) {
      const parent = nodes[idx++];
      const owner = nodes[idx++];
      const type = nodes[idx++];
      const name_index = nodes[idx++];
      const name = name_index & ((1 << PackedScene_NameMask.NAME_INDEX_BITS) - 1);
      const index = (name_index >> PackedScene_NameMask.NAME_INDEX_BITS) - 1;
      const instance = nodes[idx++];

      const parent_r = parent < 0 ? null : this.nodes[parent]!
      const node: SceneNode = {
        parent: parent_r,
        owner,
        type: type === PackedScene_Flags.TYPE_INSTANTIATED ? "_instantiated" : names[type],
        name: names[name],
        index,
        instance: get_node_instance(instance, parent_r),
        groups: [],
        properties: {}
      }

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

}