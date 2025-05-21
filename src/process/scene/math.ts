import { Basis, Transform3D, Vector3 } from "../../parse";

export function Vector3_dot(vector: Vector3, p_with: Vector3): number {
  const { x, y, z } = vector;
  return x * p_with.x + y * p_with.y + z * p_with.z;
}
export function Vector3_set(vector: Vector3, x: number, y: number, z: number) {
  return Object.assign(vector, { x, y, z });
}
export function Vector3_Vector3_multiply(vector: Vector3, p_vector: Vector3, dest = new Vector3) {
  dest.x = vector.x * p_vector.x;
  dest.y = vector.y * p_vector.y;
  dest.z = vector.z * p_vector.z;
}

// transposed dot products
function Basis_tdotx(basis: Basis, p_v: Vector3): number {
  return basis.rows[0].x * p_v.x + basis.rows[1].x * p_v.y + basis.rows[2].x * p_v.z;
}
function Basis_tdoty(basis: Basis, p_v: Vector3): number {
  return basis.rows[0].y * p_v.x + basis.rows[1].y * p_v.y + basis.rows[2].y * p_v.z;
}
function Basis_tdotz(basis: Basis, p_v: Vector3): number {
  return basis.rows[0].z * p_v.x + basis.rows[1].z * p_v.y + basis.rows[2].z * p_v.z;
}

export function Basis_Basis_multiply(basis: Basis, p_matrix: Basis, dest: Basis = { type: 'basis', rows: [new Vector3(), new Vector3(), new Vector3()] }): Basis {

  Vector3_set(dest.rows[0],
    Basis_tdotx(p_matrix, basis.rows[0]), Basis_tdoty(p_matrix, basis.rows[0]), Basis_tdotz(p_matrix, basis.rows[0]));
  Vector3_set(dest.rows[1],
    Basis_tdotx(p_matrix, basis.rows[1]), Basis_tdoty(p_matrix, basis.rows[1]), Basis_tdotz(p_matrix, basis.rows[1]));
  Vector3_set(dest.rows[2],
    Basis_tdotx(p_matrix, basis.rows[2]), Basis_tdoty(p_matrix, basis.rows[2]), Basis_tdotz(p_matrix, basis.rows[2]));
  return dest;
}
export function Basis_scale(basis: Basis, p_scale: Vector3, dest = new Basis()): Basis {
  dest.rows[0].x = basis.rows[0].x * p_scale.x;
  dest.rows[0].y = basis.rows[0].y * p_scale.x;
  dest.rows[0].z = basis.rows[0].z * p_scale.x;
  dest.rows[1].x = basis.rows[1].x * p_scale.y;
  dest.rows[1].y = basis.rows[1].y * p_scale.y;
  dest.rows[1].z = basis.rows[1].z * p_scale.y;
  dest.rows[2].x = basis.rows[2].x * p_scale.z;
  dest.rows[2].y = basis.rows[2].y * p_scale.z;
  dest.rows[2].z = basis.rows[2].z * p_scale.z;
  return dest;
}

export function Transform3D_xform(transform: Transform3D, p_vector: Vector3, dest = new Vector3()): Vector3 {
  const { origin, basis } = transform;
  dest.x = Vector3_dot(basis.rows[0], p_vector) + origin.x;
  dest.y = Vector3_dot(basis.rows[1], p_vector) + origin.y;
  dest.z = Vector3_dot(basis.rows[2], p_vector) + origin.z;
  return dest;
}

export function Transform3D_Transform3d_multiply(transform: Transform3D, p_transform: Transform3D, dest = new Transform3D()): Transform3D {
  Transform3D_xform(transform, p_transform.origin, dest.origin);
  Basis_Basis_multiply(transform.basis, p_transform.basis, dest.basis);
  return dest;
}

export function Transform3D_scale(transform: Transform3D, p_scale: Vector3, dest = new Transform3D()): Transform3D {
  Basis_scale(transform.basis, p_scale, dest.basis);
  Vector3_Vector3_multiply(transform.origin, p_scale, dest.origin);
  return dest;
}
