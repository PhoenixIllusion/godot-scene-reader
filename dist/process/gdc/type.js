export var PropertyUsageFlags;
(function (PropertyUsageFlags) {
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_NONE"] = 0] = "PROPERTY_USAGE_NONE";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_STORAGE"] = 2] = "PROPERTY_USAGE_STORAGE";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_EDITOR"] = 4] = "PROPERTY_USAGE_EDITOR";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_INTERNAL"] = 8] = "PROPERTY_USAGE_INTERNAL";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_CHECKABLE"] = 16] = "PROPERTY_USAGE_CHECKABLE";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_CHECKED"] = 32] = "PROPERTY_USAGE_CHECKED";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_GROUP"] = 64] = "PROPERTY_USAGE_GROUP";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_CATEGORY"] = 128] = "PROPERTY_USAGE_CATEGORY";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_SUBGROUP"] = 256] = "PROPERTY_USAGE_SUBGROUP";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_CLASS_IS_BITFIELD"] = 512] = "PROPERTY_USAGE_CLASS_IS_BITFIELD";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_NO_INSTANCE_STATE"] = 1024] = "PROPERTY_USAGE_NO_INSTANCE_STATE";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_RESTART_IF_CHANGED"] = 2048] = "PROPERTY_USAGE_RESTART_IF_CHANGED";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_SCRIPT_VARIABLE"] = 4096] = "PROPERTY_USAGE_SCRIPT_VARIABLE";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_STORE_IF_NULL"] = 8192] = "PROPERTY_USAGE_STORE_IF_NULL";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_UPDATE_ALL_IF_MODIFIED"] = 16384] = "PROPERTY_USAGE_UPDATE_ALL_IF_MODIFIED";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_SCRIPT_DEFAULT_VALUE"] = 32768] = "PROPERTY_USAGE_SCRIPT_DEFAULT_VALUE";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_CLASS_IS_ENUM"] = 65536] = "PROPERTY_USAGE_CLASS_IS_ENUM";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_NIL_IS_VARIANT"] = 131072] = "PROPERTY_USAGE_NIL_IS_VARIANT";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_ARRAY"] = 262144] = "PROPERTY_USAGE_ARRAY";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_ALWAYS_DUPLICATE"] = 524288] = "PROPERTY_USAGE_ALWAYS_DUPLICATE";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_NEVER_DUPLICATE"] = 1048576] = "PROPERTY_USAGE_NEVER_DUPLICATE";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_HIGH_END_GFX"] = 2097152] = "PROPERTY_USAGE_HIGH_END_GFX";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_NODE_PATH_FROM_SCENE_ROOT"] = 4194304] = "PROPERTY_USAGE_NODE_PATH_FROM_SCENE_ROOT";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_RESOURCE_NOT_PERSISTENT"] = 8388608] = "PROPERTY_USAGE_RESOURCE_NOT_PERSISTENT";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_KEYING_INCREMENTS"] = 16777216] = "PROPERTY_USAGE_KEYING_INCREMENTS";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_DEFERRED_SET_RESOURCE"] = 33554432] = "PROPERTY_USAGE_DEFERRED_SET_RESOURCE";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_EDITOR_INSTANTIATE_OBJECT"] = 67108864] = "PROPERTY_USAGE_EDITOR_INSTANTIATE_OBJECT";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_EDITOR_BASIC_SETTING"] = 134217728] = "PROPERTY_USAGE_EDITOR_BASIC_SETTING";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_READ_ONLY"] = 268435456] = "PROPERTY_USAGE_READ_ONLY";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_SECRET"] = 536870912] = "PROPERTY_USAGE_SECRET";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_DEFAULT"] = 6] = "PROPERTY_USAGE_DEFAULT";
    PropertyUsageFlags[PropertyUsageFlags["PROPERTY_USAGE_NO_EDITOR"] = 2] = "PROPERTY_USAGE_NO_EDITOR";
})(PropertyUsageFlags || (PropertyUsageFlags = {}));
export class PropertyInfo {
    constructor(type, name) {
        this.type = type;
        this.name = name;
        this.class_name = "";
        this.usage = 0;
    }
}
export var Type;
(function (Type) {
    Type[Type["NONE"] = 0] = "NONE";
    Type[Type["ANNOTATION"] = 1] = "ANNOTATION";
    Type[Type["ARRAY"] = 2] = "ARRAY";
    Type[Type["ASSERT"] = 3] = "ASSERT";
    Type[Type["ASSIGNMENT"] = 4] = "ASSIGNMENT";
    Type[Type["AWAIT"] = 5] = "AWAIT";
    Type[Type["BINARY_OPERATOR"] = 6] = "BINARY_OPERATOR";
    Type[Type["BREAK"] = 7] = "BREAK";
    Type[Type["BREAKPOINT"] = 8] = "BREAKPOINT";
    Type[Type["CALL"] = 9] = "CALL";
    Type[Type["CAST"] = 10] = "CAST";
    Type[Type["CLASS"] = 11] = "CLASS";
    Type[Type["CONSTANT"] = 12] = "CONSTANT";
    Type[Type["CONTINUE"] = 13] = "CONTINUE";
    Type[Type["DICTIONARY"] = 14] = "DICTIONARY";
    Type[Type["ENUM"] = 15] = "ENUM";
    Type[Type["FOR"] = 16] = "FOR";
    Type[Type["FUNCTION"] = 17] = "FUNCTION";
    Type[Type["GET_NODE"] = 18] = "GET_NODE";
    Type[Type["IDENTIFIER"] = 19] = "IDENTIFIER";
    Type[Type["IF"] = 20] = "IF";
    Type[Type["LAMBDA"] = 21] = "LAMBDA";
    Type[Type["LITERAL"] = 22] = "LITERAL";
    Type[Type["MATCH"] = 23] = "MATCH";
    Type[Type["MATCH_BRANCH"] = 24] = "MATCH_BRANCH";
    Type[Type["PARAMETER"] = 25] = "PARAMETER";
    Type[Type["PASS"] = 26] = "PASS";
    Type[Type["PATTERN"] = 27] = "PATTERN";
    Type[Type["PRELOAD"] = 28] = "PRELOAD";
    Type[Type["RETURN"] = 29] = "RETURN";
    Type[Type["SELF"] = 30] = "SELF";
    Type[Type["SIGNAL"] = 31] = "SIGNAL";
    Type[Type["SUBSCRIPT"] = 32] = "SUBSCRIPT";
    Type[Type["SUITE"] = 33] = "SUITE";
    Type[Type["TERNARY_OPERATOR"] = 34] = "TERNARY_OPERATOR";
    Type[Type["TYPE"] = 35] = "TYPE";
    Type[Type["TYPE_TEST"] = 36] = "TYPE_TEST";
    Type[Type["UNARY_OPERATOR"] = 37] = "UNARY_OPERATOR";
    Type[Type["VARIABLE"] = 38] = "VARIABLE";
    Type[Type["WHILE"] = 39] = "WHILE";
})(Type || (Type = {}));
;
export class Node {
    constructor() {
        this.type = Type.NONE;
        this.next = null;
        this.annotations = [];
    }
}
export class ExpressionNode extends Node {
    constructor() {
        super(...arguments);
        this.reduced = null;
        this.is_constant = null;
        this.reduced_value = '';
    }
}
const valid_annotations = {};
export class AnnotationNode extends Node {
    constructor() {
        super(...arguments);
        this.name = "";
        this.arguments = [];
        this.type = Type.ANNOTATION;
        this.info = new AnnotationInfo();
        this.is_applied = false;
        this.is_resolved = false;
    }
    applies_to(p_target_kinds) {
        this.info = valid_annotations[this.name];
        return (this.info.target_kind & p_target_kinds) > 0;
    }
    apply(_parser /*BinaryParser*/, _p_target, _p_class) {
        if (this.is_applied) {
            return true;
        }
        this.is_applied = true;
        return true; // (p_this->*(p_this->valid_annotations[name].apply))(this, p_target, p_class);
    }
}
export class ArrayNode extends ExpressionNode {
    constructor() {
        super(...arguments);
        this.elements = [];
        this.type = Type.ARRAY;
    }
}
export class AssertNode extends Node {
    constructor() {
        super(...arguments);
        this.condition = null;
        this.message = null;
        this.type = Type.ASSERT;
    }
}
export class AssignableNode extends Node {
    constructor() {
        super(...arguments);
        this.identifier = null;
        this.initializer = null;
        this.datatype_specifier = null;
        this.infer_datatype = false;
        this.use_conversion_assign = false;
        this.usages = 0;
    }
}
export var VariantOperator;
(function (VariantOperator) {
    //comparison
    VariantOperator[VariantOperator["OP_EQUAL"] = 0] = "OP_EQUAL";
    VariantOperator[VariantOperator["OP_NOT_EQUAL"] = 1] = "OP_NOT_EQUAL";
    VariantOperator[VariantOperator["OP_LESS"] = 2] = "OP_LESS";
    VariantOperator[VariantOperator["OP_LESS_EQUAL"] = 3] = "OP_LESS_EQUAL";
    VariantOperator[VariantOperator["OP_GREATER"] = 4] = "OP_GREATER";
    VariantOperator[VariantOperator["OP_GREATER_EQUAL"] = 5] = "OP_GREATER_EQUAL";
    //mathematic
    VariantOperator[VariantOperator["OP_ADD"] = 6] = "OP_ADD";
    VariantOperator[VariantOperator["OP_SUBTRACT"] = 7] = "OP_SUBTRACT";
    VariantOperator[VariantOperator["OP_MULTIPLY"] = 8] = "OP_MULTIPLY";
    VariantOperator[VariantOperator["OP_DIVIDE"] = 9] = "OP_DIVIDE";
    VariantOperator[VariantOperator["OP_NEGATE"] = 10] = "OP_NEGATE";
    VariantOperator[VariantOperator["OP_POSITIVE"] = 11] = "OP_POSITIVE";
    VariantOperator[VariantOperator["OP_MODULE"] = 12] = "OP_MODULE";
    VariantOperator[VariantOperator["OP_POWER"] = 13] = "OP_POWER";
    //bitwise
    VariantOperator[VariantOperator["OP_SHIFT_LEFT"] = 14] = "OP_SHIFT_LEFT";
    VariantOperator[VariantOperator["OP_SHIFT_RIGHT"] = 15] = "OP_SHIFT_RIGHT";
    VariantOperator[VariantOperator["OP_BIT_AND"] = 16] = "OP_BIT_AND";
    VariantOperator[VariantOperator["OP_BIT_OR"] = 17] = "OP_BIT_OR";
    VariantOperator[VariantOperator["OP_BIT_XOR"] = 18] = "OP_BIT_XOR";
    VariantOperator[VariantOperator["OP_BIT_NEGATE"] = 19] = "OP_BIT_NEGATE";
    //logic
    VariantOperator[VariantOperator["OP_AND"] = 20] = "OP_AND";
    VariantOperator[VariantOperator["OP_OR"] = 21] = "OP_OR";
    VariantOperator[VariantOperator["OP_XOR"] = 22] = "OP_XOR";
    VariantOperator[VariantOperator["OP_NOT"] = 23] = "OP_NOT";
    //containment
    VariantOperator[VariantOperator["OP_IN"] = 24] = "OP_IN";
    VariantOperator[VariantOperator["OP_MAX"] = 25] = "OP_MAX";
})(VariantOperator || (VariantOperator = {}));
;
export var AssignmentOperation;
(function (AssignmentOperation) {
    AssignmentOperation[AssignmentOperation["OP_NONE"] = 0] = "OP_NONE";
    AssignmentOperation[AssignmentOperation["OP_ADDITION"] = 1] = "OP_ADDITION";
    AssignmentOperation[AssignmentOperation["OP_SUBTRACTION"] = 2] = "OP_SUBTRACTION";
    AssignmentOperation[AssignmentOperation["OP_MULTIPLICATION"] = 3] = "OP_MULTIPLICATION";
    AssignmentOperation[AssignmentOperation["OP_DIVISION"] = 4] = "OP_DIVISION";
    AssignmentOperation[AssignmentOperation["OP_MODULO"] = 5] = "OP_MODULO";
    AssignmentOperation[AssignmentOperation["OP_POWER"] = 6] = "OP_POWER";
    AssignmentOperation[AssignmentOperation["OP_BIT_SHIFT_LEFT"] = 7] = "OP_BIT_SHIFT_LEFT";
    AssignmentOperation[AssignmentOperation["OP_BIT_SHIFT_RIGHT"] = 8] = "OP_BIT_SHIFT_RIGHT";
    AssignmentOperation[AssignmentOperation["OP_BIT_AND"] = 9] = "OP_BIT_AND";
    AssignmentOperation[AssignmentOperation["OP_BIT_OR"] = 10] = "OP_BIT_OR";
    AssignmentOperation[AssignmentOperation["OP_BIT_XOR"] = 11] = "OP_BIT_XOR";
})(AssignmentOperation || (AssignmentOperation = {}));
;
export class AssignmentNode extends ExpressionNode {
    constructor() {
        super(...arguments);
        this.operation = AssignmentOperation.OP_NONE;
        this.variant_op = VariantOperator.OP_MAX;
        this.assignee = null;
        this.assigned_value = null;
        this.use_conversion_assign = false;
        this.type = Type.ASSIGNMENT;
    }
}
;
export class AwaitNode extends ExpressionNode {
    constructor() {
        super(...arguments);
        this.to_await = null;
        this.type = Type.AWAIT;
    }
}
;
export var BinaryOpType;
(function (BinaryOpType) {
    BinaryOpType[BinaryOpType["OP_ADDITION"] = 0] = "OP_ADDITION";
    BinaryOpType[BinaryOpType["OP_SUBTRACTION"] = 1] = "OP_SUBTRACTION";
    BinaryOpType[BinaryOpType["OP_MULTIPLICATION"] = 2] = "OP_MULTIPLICATION";
    BinaryOpType[BinaryOpType["OP_DIVISION"] = 3] = "OP_DIVISION";
    BinaryOpType[BinaryOpType["OP_MODULO"] = 4] = "OP_MODULO";
    BinaryOpType[BinaryOpType["OP_POWER"] = 5] = "OP_POWER";
    BinaryOpType[BinaryOpType["OP_BIT_LEFT_SHIFT"] = 6] = "OP_BIT_LEFT_SHIFT";
    BinaryOpType[BinaryOpType["OP_BIT_RIGHT_SHIFT"] = 7] = "OP_BIT_RIGHT_SHIFT";
    BinaryOpType[BinaryOpType["OP_BIT_AND"] = 8] = "OP_BIT_AND";
    BinaryOpType[BinaryOpType["OP_BIT_OR"] = 9] = "OP_BIT_OR";
    BinaryOpType[BinaryOpType["OP_BIT_XOR"] = 10] = "OP_BIT_XOR";
    BinaryOpType[BinaryOpType["OP_LOGIC_AND"] = 11] = "OP_LOGIC_AND";
    BinaryOpType[BinaryOpType["OP_LOGIC_OR"] = 12] = "OP_LOGIC_OR";
    BinaryOpType[BinaryOpType["OP_CONTENT_TEST"] = 13] = "OP_CONTENT_TEST";
    BinaryOpType[BinaryOpType["OP_COMP_EQUAL"] = 14] = "OP_COMP_EQUAL";
    BinaryOpType[BinaryOpType["OP_COMP_NOT_EQUAL"] = 15] = "OP_COMP_NOT_EQUAL";
    BinaryOpType[BinaryOpType["OP_COMP_LESS"] = 16] = "OP_COMP_LESS";
    BinaryOpType[BinaryOpType["OP_COMP_LESS_EQUAL"] = 17] = "OP_COMP_LESS_EQUAL";
    BinaryOpType[BinaryOpType["OP_COMP_GREATER"] = 18] = "OP_COMP_GREATER";
    BinaryOpType[BinaryOpType["OP_COMP_GREATER_EQUAL"] = 19] = "OP_COMP_GREATER_EQUAL";
})(BinaryOpType || (BinaryOpType = {}));
export class BinaryOpNode extends ExpressionNode {
    constructor() {
        super(...arguments);
        this.operation = BinaryOpType.OP_ADDITION;
        this.variant_op = VariantOperator.OP_MAX;
        this.left_operand = null;
        this.right_operand = null;
        this.type = Type.BINARY_OPERATOR;
    }
}
;
export class BreakNode extends Node {
    constructor() {
        super(...arguments);
        this.type = Type.BREAK;
    }
}
;
export class BreakpointNode extends Node {
    constructor() {
        super(...arguments);
        this.type = Type.BREAKPOINT;
    }
}
;
export class CallNode extends ExpressionNode {
    constructor() {
        super(...arguments);
        this.callee = null;
        this.arguments = [];
        this.function_name = '';
        this.is_super = false;
        this.is_static = false;
        this.type = Type.CALL;
    }
    get_callee_type() {
        if (!this.callee) {
            return Type.NONE;
        }
        else {
            return this.callee.type;
        }
    }
}
;
export class CastNode extends ExpressionNode {
    constructor() {
        super(...arguments);
        this.operand = null;
        this.cast_type = null;
        this.type = Type.CAST;
    }
}
;
export class EnumValue {
    constructor() {
        this.identifier = null;
        this.custom_value = null;
        this.parent_enum = null;
        this.line = 0;
        this.index = -1;
        this.resolved = false;
        this.value = 0;
    }
}
;
export class EnumNode extends Node {
    constructor() {
        super(...arguments);
        this.identifier = null;
        this.values = [];
        this.dictionary = {};
        this.type = Type.ENUM;
    }
}
;
export var ClassMemberType;
(function (ClassMemberType) {
    ClassMemberType[ClassMemberType["UNDEFINED"] = 0] = "UNDEFINED";
    ClassMemberType[ClassMemberType["CLASS"] = 1] = "CLASS";
    ClassMemberType[ClassMemberType["CONSTANT"] = 2] = "CONSTANT";
    ClassMemberType[ClassMemberType["FUNCTION"] = 3] = "FUNCTION";
    ClassMemberType[ClassMemberType["SIGNAL"] = 4] = "SIGNAL";
    ClassMemberType[ClassMemberType["VARIABLE"] = 5] = "VARIABLE";
    ClassMemberType[ClassMemberType["ENUM"] = 6] = "ENUM";
    ClassMemberType[ClassMemberType["ENUM_VALUE"] = 7] = "ENUM_VALUE";
    ClassMemberType[ClassMemberType["GROUP"] = 8] = "GROUP";
})(ClassMemberType || (ClassMemberType = {}));
;
export class ClassMember {
    get_type_name() {
        switch (this.type) {
            case ClassMemberType.UNDEFINED:
                return "???";
            case ClassMemberType.CLASS:
                return "class";
            case ClassMemberType.CONSTANT:
                return "constant";
            case ClassMemberType.FUNCTION:
                return "function";
            case ClassMemberType.SIGNAL:
                return "signal";
            case ClassMemberType.VARIABLE:
                return "variable";
            case ClassMemberType.ENUM:
                return "enum";
            case ClassMemberType.ENUM_VALUE:
                return "enum value";
            case ClassMemberType.GROUP:
                return "group";
        }
        return "";
    }
    static GetClassMemberType(source) {
        if (source instanceof ClassNode)
            return ClassMemberType.CLASS;
        if (source instanceof ConstantNode)
            return ClassMemberType.CONSTANT;
        if (source instanceof FunctionNode)
            return ClassMemberType.FUNCTION;
        if (source instanceof SignalNode)
            return ClassMemberType.SIGNAL;
        if (source instanceof VariableNode)
            return ClassMemberType.VARIABLE;
        if (source instanceof EnumNode)
            return ClassMemberType.ENUM;
        if (source instanceof EnumValue)
            return ClassMemberType.ENUM_VALUE;
        if (source instanceof AnnotationNode)
            return ClassMemberType.GROUP;
        return ClassMemberType.UNDEFINED;
    }
    constructor(source_node) {
        this.source_node = source_node;
        this.type = ClassMember.GetClassMemberType(source_node);
    }
}
export class ClassNode extends Node {
    constructor() {
        super(...arguments);
        this.identifier = null;
        this.members = [];
        this.members_indices = new Map();
        this.outer = null;
        this.extends_used = false;
        this.onready_used = false;
        this.has_static_data = false;
        this.annotated_static_unload = false;
        this.extends_path = "";
        this.extends = []; // List for indexing: extends A.B.C
        //base_type: DataType | null = null;
        this.fqcn = "";
        this.resolved_interface = false;
        this.resolved_body = false;
        this.type = Type.CLASS;
    }
    add_member(p_member_node) {
        this.members_indices.set(p_member_node.identifier.name, this.members.length);
        this.members.push(new ClassMember(p_member_node));
    }
    add_member_group(p_annotation_node) {
        // Avoid name conflict. See GH-78252.
        const name = `@group_${this.members.length}_${p_annotation_node.name}`;
        this.members_indices.set(name, this.members.length);
        this.members.push(new ClassMember(p_annotation_node));
    }
    get_member(p_name) {
        return this.members[this.members_indices.get(p_name)];
    }
}
export class ConstantNode extends AssignableNode {
    constructor() {
        super(...arguments);
        this.type = Type.CONSTANT;
    }
}
export class ContinueNode extends Node {
    constructor() {
        super(...arguments);
        this.type = Type.CONTINUE;
    }
}
;
;
export var DictionaryNode_Style;
(function (DictionaryNode_Style) {
    DictionaryNode_Style[DictionaryNode_Style["LUA_TABLE"] = 0] = "LUA_TABLE";
    DictionaryNode_Style[DictionaryNode_Style["PYTHON_DICT"] = 1] = "PYTHON_DICT";
})(DictionaryNode_Style || (DictionaryNode_Style = {}));
;
export class DictionaryNode extends ExpressionNode {
    constructor() {
        super(...arguments);
        this.style = DictionaryNode_Style.PYTHON_DICT;
        this.elements = [];
        this.type = Type.DICTIONARY;
    }
}
export class ForNode extends Node {
    constructor() {
        super(...arguments);
        this.variable = null;
        this.datatype_specifier = null;
        this.use_conversion_assign = false;
        this.list = null;
        this.loop = null;
        this.type = Type.FOR;
    }
}
export class FunctionNode extends Node {
    constructor() {
        super(...arguments);
        this.identifier = null;
        this.parameters = [];
        this.parameters_indices = new Map();
        this.return_type = null;
        this.body = null;
        this.is_static = false; // For lambdas it's determined in the analyzer.
        this.is_coroutine = false;
        this.source_lambda = null;
        this.default_arg_values = [];
        this.resolved_signature = false;
        this.resolved_body = false;
        this.type = Type.FUNCTION;
    }
}
export class GetNodeNode extends ExpressionNode {
    constructor() {
        super(...arguments);
        this.full_path = "";
        this.use_dollar = true;
        this.type = Type.GET_NODE;
    }
}
export var IdentifierNode_Source;
(function (IdentifierNode_Source) {
    IdentifierNode_Source[IdentifierNode_Source["UNDEFINED_SOURCE"] = 0] = "UNDEFINED_SOURCE";
    IdentifierNode_Source[IdentifierNode_Source["FUNCTION_PARAMETER"] = 1] = "FUNCTION_PARAMETER";
    IdentifierNode_Source[IdentifierNode_Source["LOCAL_VARIABLE"] = 2] = "LOCAL_VARIABLE";
    IdentifierNode_Source[IdentifierNode_Source["LOCAL_CONSTANT"] = 3] = "LOCAL_CONSTANT";
    IdentifierNode_Source[IdentifierNode_Source["LOCAL_ITERATOR"] = 4] = "LOCAL_ITERATOR";
    IdentifierNode_Source[IdentifierNode_Source["LOCAL_BIND"] = 5] = "LOCAL_BIND";
    IdentifierNode_Source[IdentifierNode_Source["MEMBER_VARIABLE"] = 6] = "MEMBER_VARIABLE";
    IdentifierNode_Source[IdentifierNode_Source["MEMBER_CONSTANT"] = 7] = "MEMBER_CONSTANT";
    IdentifierNode_Source[IdentifierNode_Source["MEMBER_FUNCTION"] = 8] = "MEMBER_FUNCTION";
    IdentifierNode_Source[IdentifierNode_Source["MEMBER_SIGNAL"] = 9] = "MEMBER_SIGNAL";
    IdentifierNode_Source[IdentifierNode_Source["MEMBER_CLASS"] = 10] = "MEMBER_CLASS";
    IdentifierNode_Source[IdentifierNode_Source["INHERITED_VARIABLE"] = 11] = "INHERITED_VARIABLE";
    IdentifierNode_Source[IdentifierNode_Source["STATIC_VARIABLE"] = 12] = "STATIC_VARIABLE";
})(IdentifierNode_Source || (IdentifierNode_Source = {}));
export class IdentifierNode extends ExpressionNode {
    constructor() {
        super(...arguments);
        this.name = "";
        this.suite = null; // The block in which the identifier is used.
        this.source = IdentifierNode_Source.UNDEFINED_SOURCE;
        this.node_source = null;
        this.function_source_is_static = false; // For non-GDScript scripts.
        this.source_function = null; // TODO: Rename to disambiguate `function_source`.
        this.usages = 0; // Useful for binds/iterator variable.
        this.type = Type.IDENTIFIER;
        this.reduced_value = '';
    }
}
export class IfNode extends Node {
    constructor() {
        super(...arguments);
        this.condition = null;
        this.true_block = null;
        this.false_block = null;
        this.type = Type.IF;
    }
}
;
export class LambdaNode extends ExpressionNode {
    constructor() {
        super(...arguments);
        this.function = null;
        this.parent_function = null;
        this.parent_lambda = null;
        this.captures = [];
        this.captures_indices = new Map();
        this.use_self = false;
        this.type = Type.LAMBDA;
    }
    has_name() {
        return this.function && this.function.identifier;
    }
}
;
export class LiteralNode extends ExpressionNode {
    constructor() {
        super(...arguments);
        this.value = null;
        this.type = Type.LITERAL;
    }
}
;
export class MatchNode extends Node {
    constructor() {
        super(...arguments);
        this.test = null;
        this.branches = [];
        this.type = Type.MATCH;
    }
}
;
export class MatchBranchNode extends Node {
    constructor() {
        super(...arguments);
        this.patterns = [];
        this.block = null;
        this.has_wildcard = false;
        this.guard_body = null;
        this.type = Type.MATCH_BRANCH;
    }
}
;
export class ParameterNode extends AssignableNode {
    constructor() {
        super(...arguments);
        this.type = Type.PARAMETER;
    }
}
;
export class PassNode extends Node {
    constructor() {
        super(...arguments);
        this.type = Type.PASS;
    }
}
;
export var PatternNode_Type;
(function (PatternNode_Type) {
    PatternNode_Type[PatternNode_Type["PT_LITERAL"] = 0] = "PT_LITERAL";
    PatternNode_Type[PatternNode_Type["PT_EXPRESSION"] = 1] = "PT_EXPRESSION";
    PatternNode_Type[PatternNode_Type["PT_BIND"] = 2] = "PT_BIND";
    PatternNode_Type[PatternNode_Type["PT_ARRAY"] = 3] = "PT_ARRAY";
    PatternNode_Type[PatternNode_Type["PT_DICTIONARY"] = 4] = "PT_DICTIONARY";
    PatternNode_Type[PatternNode_Type["PT_REST"] = 5] = "PT_REST";
    PatternNode_Type[PatternNode_Type["PT_WILDCARD"] = 6] = "PT_WILDCARD";
})(PatternNode_Type || (PatternNode_Type = {}));
export class PatternNode extends Node {
    constructor() {
        super(...arguments);
        this.pattern_type = PatternNode_Type.PT_LITERAL;
        this.value = null;
        this.array = [];
        this.rest_used = false; // For array/dict patterns.
        this.dictionary = [];
        this.binds = new Map();
        this.type = Type.PATTERN;
    }
    has_bind(name) { return this.binds.has(name); }
    get_bind(name) { return this.binds.get(name); }
}
;
export class PreloadNode extends ExpressionNode {
    constructor() {
        super(...arguments);
        this.path = null;
        this.resolved_path = "";
        this.type = Type.PRELOAD;
    }
}
;
export class ReturnNode extends Node {
    constructor() {
        super(...arguments);
        this.return_value = null;
        this.void_return = false;
        this.type = Type.RETURN;
    }
}
;
export class SelfNode extends ExpressionNode {
    constructor() {
        super(...arguments);
        this.current_class = null;
        this.type = Type.SELF;
    }
}
;
export class SignalNode extends Node {
    constructor() {
        super(...arguments);
        this.identifier = null;
        this.parameters = [];
        this.parameters_indices = new Map();
        this.usages = 0;
        this.type = Type.SIGNAL;
    }
}
;
export class SubscriptNode extends ExpressionNode {
    constructor() {
        super(...arguments);
        this.base = null;
        this.index = null;
        this.attribute = null;
        this.is_attribute = false;
        this.type = Type.SUBSCRIPT;
    }
}
;
export class TernaryOpNode extends ExpressionNode {
    constructor() {
        super(...arguments);
        // Only one ternary operation exists, so no abstraction here.
        this.condition = null;
        this.true_expr = null;
        this.false_expr = null;
        this.type = Type.TERNARY_OPERATOR;
    }
}
;
export class TypeNode extends Node {
    constructor() {
        super(...arguments);
        this.type_chain = [];
        this.container_types = [];
        this.type = Type.TYPE;
    }
    get_container_type_or_null(p_index) {
        return p_index >= 0 && p_index < this.container_types.length ? this.container_types[p_index] : null;
    }
}
;
export class TypeTestNode extends ExpressionNode {
    constructor() {
        super(...arguments);
        this.operand = null;
        this.test_type = null;
        //test_datatype: DataType = {};
        this.type = Type.TYPE_TEST;
    }
}
;
export var UnaryOpNode_OpType;
(function (UnaryOpNode_OpType) {
    UnaryOpNode_OpType[UnaryOpNode_OpType["OP_POSITIVE"] = 0] = "OP_POSITIVE";
    UnaryOpNode_OpType[UnaryOpNode_OpType["OP_NEGATIVE"] = 1] = "OP_NEGATIVE";
    UnaryOpNode_OpType[UnaryOpNode_OpType["OP_COMPLEMENT"] = 2] = "OP_COMPLEMENT";
    UnaryOpNode_OpType[UnaryOpNode_OpType["OP_LOGIC_NOT"] = 3] = "OP_LOGIC_NOT";
})(UnaryOpNode_OpType || (UnaryOpNode_OpType = {}));
;
export class UnaryOpNode extends ExpressionNode {
    constructor() {
        super(...arguments);
        this.operation = UnaryOpNode_OpType.OP_POSITIVE;
        this.variant_op = VariantOperator.OP_MAX;
        this.operand = null;
        this.type = Type.UNARY_OPERATOR;
    }
}
;
export var VariableNode_PropertyStyle;
(function (VariableNode_PropertyStyle) {
    VariableNode_PropertyStyle[VariableNode_PropertyStyle["PROP_NONE"] = 0] = "PROP_NONE";
    VariableNode_PropertyStyle[VariableNode_PropertyStyle["PROP_INLINE"] = 1] = "PROP_INLINE";
    VariableNode_PropertyStyle[VariableNode_PropertyStyle["PROP_SETGET"] = 2] = "PROP_SETGET";
})(VariableNode_PropertyStyle || (VariableNode_PropertyStyle = {}));
;
export class VariableNode extends AssignableNode {
    constructor() {
        super(...arguments);
        this.property = VariableNode_PropertyStyle.PROP_NONE;
        this.setter = null;
        this.setter_parameter = null;
        this.getter = null;
        this.exported = false;
        this.onready = false;
        this.assignments = 0;
        this.is_static = false;
        this.type = Type.VARIABLE;
        this.export_info = new PropertyInfo("NIL", "");
    }
}
;
export class WhileNode extends Node {
    constructor() {
        super(...arguments);
        this.condition = null;
        this.loop = null;
        this.type = Type.WHILE;
    }
}
;
export var SuiteNode_Local_Type;
(function (SuiteNode_Local_Type) {
    SuiteNode_Local_Type[SuiteNode_Local_Type["UNDEFINED"] = 0] = "UNDEFINED";
    SuiteNode_Local_Type[SuiteNode_Local_Type["CONSTANT"] = 1] = "CONSTANT";
    SuiteNode_Local_Type[SuiteNode_Local_Type["VARIABLE"] = 2] = "VARIABLE";
    SuiteNode_Local_Type[SuiteNode_Local_Type["PARAMETER"] = 3] = "PARAMETER";
    SuiteNode_Local_Type[SuiteNode_Local_Type["FOR_VARIABLE"] = 4] = "FOR_VARIABLE";
    SuiteNode_Local_Type[SuiteNode_Local_Type["PATTERN_BIND"] = 5] = "PATTERN_BIND";
})(SuiteNode_Local_Type || (SuiteNode_Local_Type = {}));
export class SuiteNode_Local {
    static getType(v) {
        if (v instanceof ConstantNode)
            return SuiteNode_Local_Type.CONSTANT;
        if (v instanceof VariableNode)
            return SuiteNode_Local_Type.VARIABLE;
        if (v instanceof ParameterNode)
            return SuiteNode_Local_Type.PARAMETER;
        if (v instanceof IdentifierNode)
            return SuiteNode_Local_Type.FOR_VARIABLE;
        return SuiteNode_Local_Type.UNDEFINED;
    }
    static getName(v) {
        if (v == null) {
            return "";
        }
        if (v instanceof IdentifierNode) {
            return v.name;
        }
        return v.identifier.name;
    }
    get_name() { return this.name; }
    constructor(value, source_function = null) {
        this.value = value;
        this.source_function = source_function;
        this.name = SuiteNode_Local.getName(value);
        this.type = SuiteNode_Local.getType(value);
    }
}
export class SuiteNode extends Node {
    constructor() {
        super(...arguments);
        this.parent_block = null;
        this.statements = [];
        this.empty = new SuiteNode_Local(null);
        this.locals = [];
        this.locals_indices = new Map();
        this.parent_function = null;
        this.parent_if = null;
        this.has_return = false;
        this.has_continue = false;
        this.has_unreachable_code = false; // Just so warnings aren't given more than once per block.
        this.is_in_loop = false; // The block is nested in a loop (directly or indirectly).
        this.type = Type.SUITE;
    }
    has_local(p_name) { return this.locals_indices.has(p_name); }
    ;
    get_local(p_name) { return this.locals[this.locals_indices.get(p_name)] || new SuiteNode_Local(null); }
    ;
    add_local(p_local, p_source_function = null) {
        if (p_local instanceof SuiteNode_Local) {
            this.locals_indices.set(p_local.name, this.locals.length);
            this.locals.push(p_local);
        }
        else {
            const local = new SuiteNode_Local(p_local, p_source_function);
            this.locals_indices.set(local.name, this.locals.length);
            this.locals.push(local);
        }
    }
}
export var AnnotationInfo_TargetKind;
(function (AnnotationInfo_TargetKind) {
    AnnotationInfo_TargetKind[AnnotationInfo_TargetKind["NONE"] = 0] = "NONE";
    AnnotationInfo_TargetKind[AnnotationInfo_TargetKind["SCRIPT"] = 1] = "SCRIPT";
    AnnotationInfo_TargetKind[AnnotationInfo_TargetKind["CLASS"] = 2] = "CLASS";
    AnnotationInfo_TargetKind[AnnotationInfo_TargetKind["VARIABLE"] = 4] = "VARIABLE";
    AnnotationInfo_TargetKind[AnnotationInfo_TargetKind["CONSTANT"] = 8] = "CONSTANT";
    AnnotationInfo_TargetKind[AnnotationInfo_TargetKind["SIGNAL"] = 16] = "SIGNAL";
    AnnotationInfo_TargetKind[AnnotationInfo_TargetKind["FUNCTION"] = 32] = "FUNCTION";
    AnnotationInfo_TargetKind[AnnotationInfo_TargetKind["STATEMENT"] = 64] = "STATEMENT";
    AnnotationInfo_TargetKind[AnnotationInfo_TargetKind["STANDALONE"] = 128] = "STANDALONE";
    AnnotationInfo_TargetKind[AnnotationInfo_TargetKind["CLASS_LEVEL"] = 62] = "CLASS_LEVEL";
})(AnnotationInfo_TargetKind || (AnnotationInfo_TargetKind = {}));
function register_annotation(methodInfo, kind) {
    const info = new AnnotationInfo();
    info.target_kind = kind;
    info.info = methodInfo;
    valid_annotations[methodInfo.name] = info;
}
export function registerAnnotations() {
    register_annotation(new MethodInfo("@tool"), AnnotationInfo_TargetKind.SCRIPT);
    register_annotation(new MethodInfo("@icon", new PropertyInfo("STRING", "icon_path")), AnnotationInfo_TargetKind.SCRIPT);
    register_annotation(new MethodInfo("@static_unload"), AnnotationInfo_TargetKind.SCRIPT);
    register_annotation(new MethodInfo("@onready"), AnnotationInfo_TargetKind.VARIABLE);
    // Export annotations.
    register_annotation(new MethodInfo("@export"), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_enum", new PropertyInfo("STRING", "names")), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_file", new PropertyInfo("STRING", "filter")), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_dir"), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_global_file", new PropertyInfo("STRING", "filter")), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_global_dir"), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_multiline"), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_placeholder", new PropertyInfo("STRING", "placeholder")), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_range", new PropertyInfo("FLOAT", "min"), new PropertyInfo("FLOAT", "max"), new PropertyInfo("FLOAT", "step"), new PropertyInfo("STRING", "extra_hints")), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_exp_easing", new PropertyInfo("STRING", "hints")), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_color_no_alpha"), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_node_path", new PropertyInfo("STRING", "type")), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_flags", new PropertyInfo("STRING", "names")), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_flags_2d_render"), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_flags_2d_physics"), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_flags_2d_navigation"), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_flags_3d_render"), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_flags_3d_physics"), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_flags_3d_navigation"), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_flags_avoidance"), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_storage"), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_custom", new PropertyInfo("INT", "hint"), new PropertyInfo("STRING", "hint_string"), new PropertyInfo("INT", "usage")), AnnotationInfo_TargetKind.VARIABLE);
    register_annotation(new MethodInfo("@export_tool_button", new PropertyInfo("STRING", "text"), new PropertyInfo("STRING", "icon")), AnnotationInfo_TargetKind.VARIABLE);
    // Export grouping annotations.
    register_annotation(new MethodInfo("@export_category", new PropertyInfo("STRING", "name")), AnnotationInfo_TargetKind.STANDALONE);
    register_annotation(new MethodInfo("@export_group", new PropertyInfo("STRING", "name"), new PropertyInfo("STRING", "prefix")), AnnotationInfo_TargetKind.STANDALONE);
    register_annotation(new MethodInfo("@export_subgroup", new PropertyInfo("STRING", "name"), new PropertyInfo("STRING", "prefix")), AnnotationInfo_TargetKind.STANDALONE);
    // Warning annotations.
    register_annotation(new MethodInfo("@warning_ignore", new PropertyInfo("STRING", "warning")), AnnotationInfo_TargetKind.CLASS_LEVEL | AnnotationInfo_TargetKind.STATEMENT);
    // Networking.
    register_annotation(new MethodInfo("@rpc", new PropertyInfo("STRING", "mode"), new PropertyInfo("STRING", "sync"), new PropertyInfo("STRING", "transfer_mode"), new PropertyInfo("INT", "transfer_channel")), AnnotationInfo_TargetKind.FUNCTION);
}
export class AnnotationInfo {
    constructor() {
        this.target_kind = AnnotationInfo_TargetKind.NONE; // Flags.
        this.apply = null;
        this.info = { name: '', props: [] };
    }
}
class MethodInfo {
    constructor(name, ...props) {
        this.name = name;
        this.props = props;
    }
}
