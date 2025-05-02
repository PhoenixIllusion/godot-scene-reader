import { Constant } from "../../parse/binary/gdc";
import { VariantType } from "../../parse/binary/variant";
export declare const enum PropertyUsageFlags {
    PROPERTY_USAGE_NONE = 0,
    PROPERTY_USAGE_STORAGE = 2,
    PROPERTY_USAGE_EDITOR = 4,
    PROPERTY_USAGE_INTERNAL = 8,
    PROPERTY_USAGE_CHECKABLE = 16,// Used for editing global variables.
    PROPERTY_USAGE_CHECKED = 32,// Used for editing global variables.
    PROPERTY_USAGE_GROUP = 64,// Used for grouping props in the editor.
    PROPERTY_USAGE_CATEGORY = 128,
    PROPERTY_USAGE_SUBGROUP = 256,
    PROPERTY_USAGE_CLASS_IS_BITFIELD = 512,
    PROPERTY_USAGE_NO_INSTANCE_STATE = 1024,
    PROPERTY_USAGE_RESTART_IF_CHANGED = 2048,
    PROPERTY_USAGE_SCRIPT_VARIABLE = 4096,
    PROPERTY_USAGE_STORE_IF_NULL = 8192,
    PROPERTY_USAGE_UPDATE_ALL_IF_MODIFIED = 16384,
    PROPERTY_USAGE_SCRIPT_DEFAULT_VALUE = 32768,// Deprecated.
    PROPERTY_USAGE_CLASS_IS_ENUM = 65536,
    PROPERTY_USAGE_NIL_IS_VARIANT = 131072,
    PROPERTY_USAGE_ARRAY = 262144,// Used in the inspector to group properties as elements of an array.
    PROPERTY_USAGE_ALWAYS_DUPLICATE = 524288,// When duplicating a resource, always duplicate, even with subresource duplication disabled.
    PROPERTY_USAGE_NEVER_DUPLICATE = 1048576,// When duplicating a resource, never duplicate, even with subresource duplication enabled.
    PROPERTY_USAGE_HIGH_END_GFX = 2097152,
    PROPERTY_USAGE_NODE_PATH_FROM_SCENE_ROOT = 4194304,
    PROPERTY_USAGE_RESOURCE_NOT_PERSISTENT = 8388608,
    PROPERTY_USAGE_KEYING_INCREMENTS = 16777216,// Used in inspector to increment property when keyed in animation player.
    PROPERTY_USAGE_DEFERRED_SET_RESOURCE = 33554432,// Deprecated.
    PROPERTY_USAGE_EDITOR_INSTANTIATE_OBJECT = 67108864,// For Object properties, instantiate them when creating in editor.
    PROPERTY_USAGE_EDITOR_BASIC_SETTING = 134217728,//for project or editor settings, show when basic settings are selected.
    PROPERTY_USAGE_READ_ONLY = 268435456,// Mark a property as read-only in the inspector.
    PROPERTY_USAGE_SECRET = 536870912,// Export preset credentials that should be stored separately from the rest of the export config.
    PROPERTY_USAGE_DEFAULT = 6,
    PROPERTY_USAGE_NO_EDITOR = 2
}
export declare class PropertyInfo {
    type: string;
    name: string;
    class_name: string;
    usage: number;
    constructor(type: string, name: string);
}
export declare const enum Type {
    NONE = 0,
    ANNOTATION = 1,
    ARRAY = 2,
    ASSERT = 3,
    ASSIGNMENT = 4,
    AWAIT = 5,
    BINARY_OPERATOR = 6,
    BREAK = 7,
    BREAKPOINT = 8,
    CALL = 9,
    CAST = 10,
    CLASS = 11,
    CONSTANT = 12,
    CONTINUE = 13,
    DICTIONARY = 14,
    ENUM = 15,
    FOR = 16,
    FUNCTION = 17,
    GET_NODE = 18,
    IDENTIFIER = 19,
    IF = 20,
    LAMBDA = 21,
    LITERAL = 22,
    MATCH = 23,
    MATCH_BRANCH = 24,
    PARAMETER = 25,
    PASS = 26,
    PATTERN = 27,
    PRELOAD = 28,
    RETURN = 29,
    SELF = 30,
    SIGNAL = 31,
    SUBSCRIPT = 32,
    SUITE = 33,
    TERNARY_OPERATOR = 34,
    TYPE = 35,
    TYPE_TEST = 36,
    UNARY_OPERATOR = 37,
    VARIABLE = 38,
    WHILE = 39
}
export declare class Node {
    type: Type;
    next: Node | null;
    annotations: AnnotationNode[];
}
export declare class ExpressionNode extends Node {
    reduced: boolean | null;
    is_constant: boolean | null;
    reduced_value: string;
}
export declare class AnnotationNode extends Node {
    name: string;
    arguments: ExpressionNode[];
    type: Type;
    info: AnnotationInfo;
    is_applied: boolean;
    is_resolved: boolean;
    applies_to(p_target_kinds: AnnotationInfo_TargetKind): boolean;
    apply(_parser: any, _p_target: Node, _p_class: ClassNode | null): boolean;
}
export declare class ArrayNode extends ExpressionNode {
    elements: ExpressionNode[];
    type: Type;
}
export declare class AssertNode extends Node {
    condition: ExpressionNode | null;
    message: ExpressionNode | null;
    type: Type;
}
export declare class AssignableNode extends Node {
    identifier: IdentifierNode | null;
    initializer: ExpressionNode | null;
    datatype_specifier: TypeNode | null;
    infer_datatype: boolean;
    use_conversion_assign: boolean;
    usages: number;
}
export declare const enum VariantOperator {
    OP_EQUAL = 0,
    OP_NOT_EQUAL = 1,
    OP_LESS = 2,
    OP_LESS_EQUAL = 3,
    OP_GREATER = 4,
    OP_GREATER_EQUAL = 5,
    OP_ADD = 6,
    OP_SUBTRACT = 7,
    OP_MULTIPLY = 8,
    OP_DIVIDE = 9,
    OP_NEGATE = 10,
    OP_POSITIVE = 11,
    OP_MODULE = 12,
    OP_POWER = 13,
    OP_SHIFT_LEFT = 14,
    OP_SHIFT_RIGHT = 15,
    OP_BIT_AND = 16,
    OP_BIT_OR = 17,
    OP_BIT_XOR = 18,
    OP_BIT_NEGATE = 19,
    OP_AND = 20,
    OP_OR = 21,
    OP_XOR = 22,
    OP_NOT = 23,
    OP_IN = 24,
    OP_MAX = 25
}
export declare const enum AssignmentOperation {
    OP_NONE = 0,
    OP_ADDITION = 1,
    OP_SUBTRACTION = 2,
    OP_MULTIPLICATION = 3,
    OP_DIVISION = 4,
    OP_MODULO = 5,
    OP_POWER = 6,
    OP_BIT_SHIFT_LEFT = 7,
    OP_BIT_SHIFT_RIGHT = 8,
    OP_BIT_AND = 9,
    OP_BIT_OR = 10,
    OP_BIT_XOR = 11
}
export declare class AssignmentNode extends ExpressionNode {
    operation: AssignmentOperation;
    variant_op: VariantOperator;
    assignee: ExpressionNode | null;
    assigned_value: ExpressionNode | null;
    use_conversion_assign: boolean;
    type: Type;
}
export declare class AwaitNode extends ExpressionNode {
    to_await: ExpressionNode | null;
    type: Type;
}
export declare const enum BinaryOpType {
    OP_ADDITION = 0,
    OP_SUBTRACTION = 1,
    OP_MULTIPLICATION = 2,
    OP_DIVISION = 3,
    OP_MODULO = 4,
    OP_POWER = 5,
    OP_BIT_LEFT_SHIFT = 6,
    OP_BIT_RIGHT_SHIFT = 7,
    OP_BIT_AND = 8,
    OP_BIT_OR = 9,
    OP_BIT_XOR = 10,
    OP_LOGIC_AND = 11,
    OP_LOGIC_OR = 12,
    OP_CONTENT_TEST = 13,
    OP_COMP_EQUAL = 14,
    OP_COMP_NOT_EQUAL = 15,
    OP_COMP_LESS = 16,
    OP_COMP_LESS_EQUAL = 17,
    OP_COMP_GREATER = 18,
    OP_COMP_GREATER_EQUAL = 19
}
export declare class BinaryOpNode extends ExpressionNode {
    operation: BinaryOpType;
    variant_op: VariantOperator;
    left_operand: ExpressionNode | null;
    right_operand: ExpressionNode | null;
    type: Type;
}
export declare class BreakNode extends Node {
    type: Type;
}
export declare class BreakpointNode extends Node {
    type: Type;
}
export declare class CallNode extends ExpressionNode {
    callee: ExpressionNode | null;
    arguments: ExpressionNode[];
    function_name: string;
    is_super: boolean;
    is_static: boolean;
    type: Type;
    get_callee_type(): Type;
}
export declare class CastNode extends ExpressionNode {
    operand: ExpressionNode | null;
    cast_type: TypeNode | null;
    type: Type;
}
export declare class EnumValue {
    identifier: IdentifierNode | null;
    custom_value: ExpressionNode | null;
    parent_enum: EnumNode | null;
    line: number;
    index: number;
    resolved: boolean;
    value: number;
}
export declare class EnumNode extends Node {
    identifier: IdentifierNode | null;
    values: EnumValue[];
    dictionary: {};
    type: Type;
}
export declare const enum ClassMemberType {
    UNDEFINED = 0,
    CLASS = 1,
    CONSTANT = 2,
    FUNCTION = 3,
    SIGNAL = 4,
    VARIABLE = 5,
    ENUM = 6,
    ENUM_VALUE = 7,// For unnamed enums.
    GROUP = 8
}
export type ClassMemberSource = ClassNode | ConstantNode | FunctionNode | SignalNode | VariableNode | EnumNode | EnumValue | AnnotationNode | undefined;
export declare class ClassMember {
    source_node: ClassMemberSource;
    type: ClassMemberType;
    get_type_name(): string;
    static GetClassMemberType(source: ClassMemberSource): ClassMemberType;
    constructor(source_node: ClassMemberSource);
}
export declare class ClassNode extends Node {
    identifier: IdentifierNode | null;
    members: ClassMember[];
    members_indices: Map<string, number>;
    outer: ClassNode | null;
    extends_used: boolean;
    onready_used: boolean;
    has_static_data: boolean;
    annotated_static_unload: boolean;
    extends_path: string;
    extends: IdentifierNode[];
    fqcn: string;
    resolved_interface: boolean;
    resolved_body: boolean;
    type: Type;
    add_member(p_member_node: Exclude<ClassMemberSource, AnnotationNode | undefined>): void;
    add_member_group(p_annotation_node: AnnotationNode): void;
    get_member(p_name: string): ClassMember;
}
export declare class ConstantNode extends AssignableNode {
    type: Type;
}
export declare class ContinueNode extends Node {
    type: Type;
}
interface DictionaryNode_Pair {
    key: ExpressionNode | null;
    value: ExpressionNode | null;
}
export declare const enum DictionaryNode_Style {
    LUA_TABLE = 0,
    PYTHON_DICT = 1
}
export declare class DictionaryNode extends ExpressionNode {
    style: DictionaryNode_Style;
    elements: DictionaryNode_Pair[];
    type: Type;
}
export declare class ForNode extends Node {
    variable: IdentifierNode | null;
    datatype_specifier: TypeNode | null;
    use_conversion_assign: boolean;
    list: ExpressionNode | null;
    loop: SuiteNode | null;
    type: Type;
}
export declare class FunctionNode extends Node {
    identifier: IdentifierNode | null;
    parameters: ParameterNode[];
    parameters_indices: Map<string, number>;
    return_type: TypeNode | null;
    body: SuiteNode | null;
    is_static: boolean;
    is_coroutine: boolean;
    source_lambda: LambdaNode | null;
    default_arg_values: VariantType[];
    resolved_signature: boolean;
    resolved_body: boolean;
    type: Type;
}
export declare class GetNodeNode extends ExpressionNode {
    full_path: string;
    use_dollar: boolean;
    type: Type;
}
export declare const enum IdentifierNode_Source {
    UNDEFINED_SOURCE = 0,
    FUNCTION_PARAMETER = 1,
    LOCAL_VARIABLE = 2,
    LOCAL_CONSTANT = 3,
    LOCAL_ITERATOR = 4,// `for` loop iterator.
    LOCAL_BIND = 5,// Pattern bind.
    MEMBER_VARIABLE = 6,
    MEMBER_CONSTANT = 7,
    MEMBER_FUNCTION = 8,
    MEMBER_SIGNAL = 9,
    MEMBER_CLASS = 10,
    INHERITED_VARIABLE = 11,
    STATIC_VARIABLE = 12
}
type IdentifierSource = ParameterNode | IdentifierNode | VariableNode | ConstantNode | SignalNode | FunctionNode | null;
export declare class IdentifierNode extends ExpressionNode {
    name: string;
    suite: SuiteNode | null;
    source: IdentifierNode_Source;
    node_source: IdentifierSource;
    function_source_is_static: boolean;
    source_function: FunctionNode | null;
    usages: number;
    type: Type;
    reduced_value: string;
}
export declare class IfNode extends Node {
    condition: ExpressionNode | null;
    true_block: SuiteNode | null;
    false_block: SuiteNode | null;
    type: Type;
}
export declare class LambdaNode extends ExpressionNode {
    function: FunctionNode | null;
    parent_function: FunctionNode | null;
    parent_lambda: LambdaNode | null;
    captures: IdentifierNode[];
    captures_indices: Map<string, number>;
    use_self: boolean;
    type: Type;
    has_name(): IdentifierNode | null;
}
export declare class LiteralNode extends ExpressionNode {
    value: string | Constant | null;
    type: Type;
}
export declare class MatchNode extends Node {
    test: ExpressionNode | null;
    branches: MatchBranchNode[];
    type: Type;
}
export declare class MatchBranchNode extends Node {
    patterns: PatternNode[];
    block: SuiteNode | null;
    has_wildcard: boolean;
    guard_body: SuiteNode | null;
    type: Type;
}
export declare class ParameterNode extends AssignableNode {
    type: Type;
}
export declare class PassNode extends Node {
    type: Type;
}
export declare const enum PatternNode_Type {
    PT_LITERAL = 0,
    PT_EXPRESSION = 1,
    PT_BIND = 2,
    PT_ARRAY = 3,
    PT_DICTIONARY = 4,
    PT_REST = 5,
    PT_WILDCARD = 6
}
interface PatternNode_Pair {
    key: ExpressionNode | null;
    value_pattern: PatternNode | null;
}
type PatterNodeValue = LiteralNode | IdentifierNode | ExpressionNode | null;
export declare class PatternNode extends Node {
    pattern_type: PatternNode_Type;
    value: PatterNodeValue;
    array: PatternNode[];
    rest_used: boolean;
    dictionary: PatternNode_Pair[];
    binds: Map<string, IdentifierNode>;
    has_bind(name: string): boolean;
    get_bind(name: string): IdentifierNode | undefined;
    type: Type;
}
export declare class PreloadNode extends ExpressionNode {
    path: ExpressionNode | null;
    resolved_path: string;
    resource: any;
    type: Type;
}
export declare class ReturnNode extends Node {
    return_value: ExpressionNode | null;
    void_return: boolean;
    type: Type;
}
export declare class SelfNode extends ExpressionNode {
    current_class: ClassNode | null;
    type: Type;
}
export declare class SignalNode extends Node {
    identifier: IdentifierNode | null;
    parameters: ParameterNode[];
    parameters_indices: Map<string, number>;
    usages: number;
    type: Type;
}
export declare class SubscriptNode extends ExpressionNode {
    base: ExpressionNode | null;
    index: ExpressionNode | null;
    attribute: IdentifierNode | null;
    is_attribute: boolean;
    type: Type;
}
export declare class TernaryOpNode extends ExpressionNode {
    condition: ExpressionNode | null;
    true_expr: ExpressionNode | null;
    false_expr: ExpressionNode | null;
    type: Type;
}
export declare class TypeNode extends Node {
    type_chain: IdentifierNode[];
    container_types: TypeNode[];
    get_container_type_or_null(p_index: number): TypeNode | null;
    type: Type;
}
export declare class TypeTestNode extends ExpressionNode {
    operand: ExpressionNode | null;
    test_type: TypeNode | null;
    type: Type;
}
export declare const enum UnaryOpNode_OpType {
    OP_POSITIVE = 0,
    OP_NEGATIVE = 1,
    OP_COMPLEMENT = 2,
    OP_LOGIC_NOT = 3
}
export declare class UnaryOpNode extends ExpressionNode {
    operation: UnaryOpNode_OpType;
    variant_op: VariantOperator;
    operand: ExpressionNode | null;
    type: Type;
}
export declare const enum VariableNode_PropertyStyle {
    PROP_NONE = 0,
    PROP_INLINE = 1,
    PROP_SETGET = 2
}
type VariableNodeGetterSetter = FunctionNode | IdentifierNode | null;
export declare class VariableNode extends AssignableNode {
    property: VariableNode_PropertyStyle;
    setter: VariableNodeGetterSetter;
    setter_parameter: IdentifierNode | null;
    getter: VariableNodeGetterSetter;
    exported: boolean;
    onready: boolean;
    assignments: number;
    is_static: boolean;
    type: Type;
    export_info: PropertyInfo;
}
export declare class WhileNode extends Node {
    condition: ExpressionNode | null;
    loop: SuiteNode | null;
    type: Type;
}
export declare const enum SuiteNode_Local_Type {
    UNDEFINED = 0,
    CONSTANT = 1,
    VARIABLE = 2,
    PARAMETER = 3,
    FOR_VARIABLE = 4,
    PATTERN_BIND = 5
}
type Suite_Node_Local_T = ConstantNode | VariableNode | ParameterNode | IdentifierNode | null;
export declare class SuiteNode_Local {
    value: Suite_Node_Local_T;
    source_function: FunctionNode | null;
    name: string;
    type: SuiteNode_Local_Type;
    static getType(v: Suite_Node_Local_T): SuiteNode_Local_Type;
    static getName(v: Suite_Node_Local_T): string;
    get_name(): string;
    constructor(value: Suite_Node_Local_T, source_function?: FunctionNode | null);
}
export declare class SuiteNode extends Node {
    parent_block: SuiteNode | null;
    statements: Node[];
    empty: SuiteNode_Local;
    locals: SuiteNode_Local[];
    locals_indices: Map<string, number>;
    parent_function: FunctionNode | null;
    parent_if: IfNode | null;
    has_return: boolean;
    has_continue: boolean;
    has_unreachable_code: boolean;
    is_in_loop: boolean;
    type: Type;
    has_local(p_name: string): boolean;
    get_local(p_name: string): SuiteNode_Local;
    add_local(p_local: SuiteNode_Local | Suite_Node_Local_T, p_source_function?: FunctionNode | null): void;
}
export declare const enum AnnotationInfo_TargetKind {
    NONE = 0,
    SCRIPT = 1,
    CLASS = 2,
    VARIABLE = 4,
    CONSTANT = 8,
    SIGNAL = 16,
    FUNCTION = 32,
    STATEMENT = 64,
    STANDALONE = 128,
    CLASS_LEVEL = 62
}
type AnnotationAction = (p_annotation: AnnotationNode, p_target: Node, p_class: ClassNode) => void;
export declare function registerAnnotations(): void;
export declare class AnnotationInfo {
    target_kind: AnnotationInfo_TargetKind;
    apply: AnnotationAction | null;
    info: MethodInfo;
}
declare class MethodInfo {
    name: string;
    props: PropertyInfo[];
    constructor(name: string, ...props: PropertyInfo[]);
}
export {};
