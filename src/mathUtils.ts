// Define types for vectors and matrices
type Vector3 = [number, number, number];
type Vector4 = [number, number, number, number];
type Matrix4 = number[]; // 4x4 matrix stored in a flat array

// Vector operations
export const addToVector = (out: Vector3, a: Vector3, b: Vector3): Vector3 => {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
};

export const subtractFromVector = (
  out: Vector3,
  a: Vector3,
  b: Vector3
): Vector3 => {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
};

export const multiplyVectorByScalar = (
  out: Vector3,
  v: Vector3,
  k: number
): Vector3 => {
  out[0] = v[0] * k;
  out[1] = v[1] * k;
  out[2] = v[2] * k;
  return out;
};

// Matrix operations
export const makeIdentityMatrix = (matrix: Matrix4): Matrix4 => {
  for (let i = 0; i < 16; i++) {
    matrix[i] = i % 5 === 0 ? 1 : 0; // Set diagonal elements to 1, others to 0
  }
  return matrix;
};

export const makeXRotationMatrix = (
  matrix: Matrix4,
  angle: number
): Matrix4 => {
  matrix[0] = 1.0;
  matrix[5] = Math.cos(angle);
  matrix[6] = Math.sin(angle);
  matrix[9] = -Math.sin(angle);
  matrix[10] = Math.cos(angle);
  matrix[15] = 1.0;
  return matrix;
};

export const makeYRotationMatrix = (
  matrix: Matrix4,
  angle: number
): Matrix4 => {
  matrix[0] = Math.cos(angle);
  matrix[2] = -Math.sin(angle);
  matrix[8] = Math.sin(angle);
  matrix[10] = Math.cos(angle);
  matrix[15] = 1.0;
  return matrix;
};

// Distance and length calculations
export const distanceBetweenVectors = (a: Vector3, b: Vector3): number => {
  const xDist = b[0] - a[0],
    yDist = b[1] - a[1],
    zDist = b[2] - a[2];
  return Math.sqrt(xDist * xDist + yDist * yDist + zDist * zDist);
};

export const lengthOfVector = (v: Vector3): number => {
  const [x, y, z] = v;
  return Math.sqrt(x * x + y * y + z * z);
};

// Vector and matrix transformations
export const setVector4 = (
  out: Vector4,
  x: number,
  y: number,
  z: number,
  w: number
): Vector4 => {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
};

export const projectVector4 = (out: Vector3, v: Vector4): Vector3 => {
  const reciprocalW = 1 / v[3];
  out[0] = v[0] * reciprocalW;
  out[1] = v[1] * reciprocalW;
  out[2] = v[2] * reciprocalW;
  return out;
};

export const transformVectorByMatrix = (
  out: Vector4,
  v: Vector4,
  m: Matrix4
): Vector4 => {
  const [x, y, z, w] = v;
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
};

// Utility functions
export const clamp = (x: number, min: number, max: number): number => {
  return Math.min(Math.max(x, min), max);
};

export const log2 = (number: number): number => {
  return Math.log(number) / Math.log(2);
};

export const premultiplyMatrix = function (
  out: Matrix4,
  matrixA: Matrix4,
  matrixB: Matrix4
) {
  let b0 = matrixB[0],
    b4 = matrixB[4],
    b8 = matrixB[8],
    b12 = matrixB[12],
    b1 = matrixB[1],
    b5 = matrixB[5],
    b9 = matrixB[9],
    b13 = matrixB[13],
    b2 = matrixB[2],
    b6 = matrixB[6],
    b10 = matrixB[10],
    b14 = matrixB[14],
    b3 = matrixB[3],
    b7 = matrixB[7],
    b11 = matrixB[11],
    b15 = matrixB[15],
    aX = matrixA[0],
    aY = matrixA[1],
    aZ = matrixA[2],
    aW = matrixA[3];
  out[0] = b0 * aX + b4 * aY + b8 * aZ + b12 * aW;
  out[1] = b1 * aX + b5 * aY + b9 * aZ + b13 * aW;
  out[2] = b2 * aX + b6 * aY + b10 * aZ + b14 * aW;
  out[3] = b3 * aX + b7 * aY + b11 * aZ + b15 * aW;

  (aX = matrixA[4]), (aY = matrixA[5]), (aZ = matrixA[6]), (aW = matrixA[7]);
  out[4] = b0 * aX + b4 * aY + b8 * aZ + b12 * aW;
  out[5] = b1 * aX + b5 * aY + b9 * aZ + b13 * aW;
  out[6] = b2 * aX + b6 * aY + b10 * aZ + b14 * aW;
  out[7] = b3 * aX + b7 * aY + b11 * aZ + b15 * aW;

  (aX = matrixA[8]), (aY = matrixA[9]), (aZ = matrixA[10]), (aW = matrixA[11]);
  out[8] = b0 * aX + b4 * aY + b8 * aZ + b12 * aW;
  out[9] = b1 * aX + b5 * aY + b9 * aZ + b13 * aW;
  out[10] = b2 * aX + b6 * aY + b10 * aZ + b14 * aW;
  out[11] = b3 * aX + b7 * aY + b11 * aZ + b15 * aW;

  (aX = matrixA[12]),
    (aY = matrixA[13]),
    (aZ = matrixA[14]),
    (aW = matrixA[15]);
  out[12] = b0 * aX + b4 * aY + b8 * aZ + b12 * aW;
  out[13] = b1 * aX + b5 * aY + b9 * aZ + b13 * aW;
  out[14] = b2 * aX + b6 * aY + b10 * aZ + b14 * aW;
  out[15] = b3 * aX + b7 * aY + b11 * aZ + b15 * aW;

  return out;
};

export const makePerspectiveMatrix = function (
  matrix: Matrix4,
  fov: number,
  aspect: number,
  near: number,
  far: number
) {
  const f = Math.tan(0.5 * (Math.PI - fov)),
    range = near - far;

  matrix[0] = f / aspect;
  matrix[1] = 0;
  matrix[2] = 0;
  matrix[3] = 0;
  matrix[4] = 0;
  matrix[5] = f;
  matrix[6] = 0;
  matrix[7] = 0;
  matrix[8] = 0;
  matrix[9] = 0;
  matrix[10] = far / range;
  matrix[11] = -1;
  matrix[12] = 0;
  matrix[13] = 0;
  matrix[14] = (near * far) / range;
  matrix[15] = 0.0;

  return matrix;
};

export const invertMatrix = function (out: Matrix4, m: Matrix4) {
  const m0 = m[0],
    m4 = m[4],
    m8 = m[8],
    m12 = m[12],
    m1 = m[1],
    m5 = m[5],
    m9 = m[9],
    m13 = m[13],
    m2 = m[2],
    m6 = m[6],
    m10 = m[10],
    m14 = m[14],
    m3 = m[3],
    m7 = m[7],
    m11 = m[11],
    m15 = m[15],
    temp0 = m10 * m15,
    temp1 = m14 * m11,
    temp2 = m6 * m15,
    temp3 = m14 * m7,
    temp4 = m6 * m11,
    temp5 = m10 * m7,
    temp6 = m2 * m15,
    temp7 = m14 * m3,
    temp8 = m2 * m11,
    temp9 = m10 * m3,
    temp10 = m2 * m7,
    temp11 = m6 * m3,
    temp12 = m8 * m13,
    temp13 = m12 * m9,
    temp14 = m4 * m13,
    temp15 = m12 * m5,
    temp16 = m4 * m9,
    temp17 = m8 * m5,
    temp18 = m0 * m13,
    temp19 = m12 * m1,
    temp20 = m0 * m9,
    temp21 = m8 * m1,
    temp22 = m0 * m5,
    temp23 = m4 * m1,
    t0 =
      temp0 * m5 +
      temp3 * m9 +
      temp4 * m13 -
      (temp1 * m5 + temp2 * m9 + temp5 * m13),
    t1 =
      temp1 * m1 +
      temp6 * m9 +
      temp9 * m13 -
      (temp0 * m1 + temp7 * m9 + temp8 * m13),
    t2 =
      temp2 * m1 +
      temp7 * m5 +
      temp10 * m13 -
      (temp3 * m1 + temp6 * m5 + temp11 * m13),
    t3 =
      temp5 * m1 +
      temp8 * m5 +
      temp11 * m9 -
      (temp4 * m1 + temp9 * m5 + temp10 * m9),
    d = 1.0 / (m0 * t0 + m4 * t1 + m8 * t2 + m12 * t3);

  out[0] = d * t0;
  out[1] = d * t1;
  out[2] = d * t2;
  out[3] = d * t3;
  out[4] =
    d *
    (temp1 * m4 +
      temp2 * m8 +
      temp5 * m12 -
      (temp0 * m4 + temp3 * m8 + temp4 * m12));
  out[5] =
    d *
    (temp0 * m0 +
      temp7 * m8 +
      temp8 * m12 -
      (temp1 * m0 + temp6 * m8 + temp9 * m12));
  out[6] =
    d *
    (temp3 * m0 +
      temp6 * m4 +
      temp11 * m12 -
      (temp2 * m0 + temp7 * m4 + temp10 * m12));
  out[7] =
    d *
    (temp4 * m0 +
      temp9 * m4 +
      temp10 * m8 -
      (temp5 * m0 + temp8 * m4 + temp11 * m8));
  out[8] =
    d *
    (temp12 * m7 +
      temp15 * m11 +
      temp16 * m15 -
      (temp13 * m7 + temp14 * m11 + temp17 * m15));
  out[9] =
    d *
    (temp13 * m3 +
      temp18 * m11 +
      temp21 * m15 -
      (temp12 * m3 + temp19 * m11 + temp20 * m15));
  out[10] =
    d *
    (temp14 * m3 +
      temp19 * m7 +
      temp22 * m15 -
      (temp15 * m3 + temp18 * m7 + temp23 * m15));
  out[11] =
    d *
    (temp17 * m3 +
      temp20 * m7 +
      temp23 * m11 -
      (temp16 * m3 + temp21 * m7 + temp22 * m11));
  out[12] =
    d *
    (temp14 * m10 +
      temp17 * m14 +
      temp13 * m6 -
      (temp16 * m14 + temp12 * m6 + temp15 * m10));
  out[13] =
    d *
    (temp20 * m14 +
      temp12 * m2 +
      temp19 * m10 -
      (temp18 * m10 + temp21 * m14 + temp13 * m2));
  out[14] =
    d *
    (temp18 * m6 +
      temp23 * m14 +
      temp15 * m2 -
      (temp22 * m14 + temp14 * m2 + temp19 * m6));
  out[15] =
    d *
    (temp22 * m10 +
      temp16 * m2 +
      temp21 * m6 -
      (temp20 * m6 + temp23 * m10 + temp17 * m2));

  return out;
};
