import { Basis, Transform3D, Vector3 } from "../../parse";
export declare function Vector3_dot(vector: Vector3, p_with: Vector3): number;
export declare function Vector3_set(vector: Vector3, x: number, y: number, z: number): Vector3 & {
    x: number;
    y: number;
    z: number;
};
export declare function Vector3_Vector3_multiply(vector: Vector3, p_vector: Vector3, dest?: Vector3): void;
export declare function Basis_Basis_multiply(basis: Basis, p_matrix: Basis, dest?: Basis): Basis;
export declare function Basis_scale(basis: Basis, p_scale: Vector3, dest?: Basis): Basis;
export declare function Transform3D_xform(transform: Transform3D, p_vector: Vector3, dest?: Vector3): Vector3;
export declare function Transform3D_Transform3d_multiply(transform: Transform3D, p_transform: Transform3D, dest?: Transform3D): Transform3D;
export declare function Transform3D_scale(transform: Transform3D, p_scale: Vector3, dest?: Transform3D): Transform3D;
