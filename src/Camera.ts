import {
  CAMERA_DISTANCE,
  ORBIT_POINT,
  INITIAL_AZIMUTH,
  INITIAL_ELEVATION,
  MIN_AZIMUTH,
  MAX_AZIMUTH,
  MIN_ELEVATION,
  MAX_ELEVATION,
} from "./constants";

import {
  makeIdentityMatrix,
  makeXRotationMatrix,
  makeYRotationMatrix,
  premultiplyMatrix,
  clamp,
} from "./mathUtils";
import { Matrix4, Vector3 } from "./types";

class Camera {
  private azimuth: number;
  private elevation: number;
  private viewMatrix: Matrix4;
  private position: Vector3;
  private changed: boolean;
  private orbitTranslationMatrix: Matrix4;
  private xRotationMatrix: Matrix4;
  private yRotationMatrix: Matrix4;
  private distanceTranslationMatrix: Matrix4;

  constructor() {
    this.azimuth = INITIAL_AZIMUTH;
    this.elevation = INITIAL_ELEVATION;
    this.viewMatrix = makeIdentityMatrix(new Float32Array(16));
    this.position = [0, 0, 0];
    this.changed = true;

    // Initialize matrices
    this.orbitTranslationMatrix = makeIdentityMatrix(new Float32Array(16));
    this.xRotationMatrix = new Float32Array(16);
    this.yRotationMatrix = new Float32Array(16);
    this.distanceTranslationMatrix = makeIdentityMatrix(new Float32Array(16));
  }

  public changeAzimuth(deltaAzimuth: number): void {
    this.azimuth += deltaAzimuth;
    this.azimuth = clamp(this.azimuth, MIN_AZIMUTH, MAX_AZIMUTH);
    this.changed = true;
  }

  public changeElevation(deltaElevation: number): void {
    this.elevation += deltaElevation;
    this.elevation = clamp(this.elevation, MIN_ELEVATION, MAX_ELEVATION);
    this.changed = true;
  }

  public getPosition(): Vector3 {
    return this.position;
  }

  public getViewMatrix(): Matrix4 {
    if (this.changed) {
      // Reset view matrix to identity
      makeIdentityMatrix(this.viewMatrix);

      // Set up transformation matrices
      makeXRotationMatrix(this.xRotationMatrix, this.elevation);
      makeYRotationMatrix(this.yRotationMatrix, this.azimuth);
      this.distanceTranslationMatrix[14] = -CAMERA_DISTANCE;
      this.orbitTranslationMatrix[12] = -ORBIT_POINT[0];
      this.orbitTranslationMatrix[13] = -ORBIT_POINT[1];
      this.orbitTranslationMatrix[14] = -ORBIT_POINT[2];

      // Apply transformations in order
      premultiplyMatrix(
        this.viewMatrix,
        this.viewMatrix,
        this.orbitTranslationMatrix
      );
      premultiplyMatrix(this.viewMatrix, this.viewMatrix, this.yRotationMatrix);
      premultiplyMatrix(this.viewMatrix, this.viewMatrix, this.xRotationMatrix);
      premultiplyMatrix(
        this.viewMatrix,
        this.viewMatrix,
        this.distanceTranslationMatrix
      );

      // Update camera position based on transformations
      this.position[0] =
        CAMERA_DISTANCE *
          Math.sin(Math.PI / 2 - this.elevation) *
          Math.sin(-this.azimuth) +
        ORBIT_POINT[0];
      this.position[1] =
        CAMERA_DISTANCE * Math.cos(Math.PI / 2 - this.elevation) +
        ORBIT_POINT[1];
      this.position[2] =
        CAMERA_DISTANCE *
          Math.sin(Math.PI / 2 - this.elevation) *
          Math.cos(-this.azimuth) +
        ORBIT_POINT[2];

      this.changed = false;
    }

    return this.viewMatrix;
  }
}

export default Camera;
