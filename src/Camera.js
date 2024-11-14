import {
  INITIAL_SIZE,
  INITIAL_WIND,
  INITIAL_CHOPPINESS,
  CLEAR_COLOR,
  GEOMETRY_ORIGIN,
  SUN_DIRECTION,
  OCEAN_COLOR,
  SKY_COLOR,
  EXPOSURE,
  GEOMETRY_RESOLUTION,
  GEOMETRY_SIZE,
  RESOLUTION,
  SIZE_OF_FLOAT,
  OCEAN_COORDINATES_UNIT,
  INITIAL_SPECTRUM_UNIT,
  SPECTRUM_UNIT,
  DISPLACEMENT_MAP_UNIT,
  NORMAL_MAP_UNIT,
  PING_PHASE_UNIT,
  PONG_PHASE_UNIT,
  PING_TRANSFORM_UNIT,
  PONG_TRANSFORM_UNIT,
  PROFILE_AMPLITUDE,
  PROFILE_OMEGA,
  PROFILE_PHI,
  PROFILE_STEP,
  PROFILE_OFFSET,
  PROFILE_COLOR,
  PROFILE_LINE_WIDTH,
  CHOPPINESS_SCALE,
  FOV,
  NEAR,
  FAR,
  MIN_ASPECT,
  WIND_SPEED_DECIMAL_PLACES,
  SIZE_DECIMAL_PLACES,
  CHOPPINESS_DECIMAL_PLACES,
  SENSITIVITY,
  WIND_SPEED_X,
  MIN_WIND_SPEED_Z,
  WIND_SPEED_OFFSET,
  OVERLAY_DIV_ID,
  PROFILE_CANVAS_ID,
  SIMULATOR_CANVAS_ID,
  UI_DIV_ID,
  CAMERA_DIV_ID,
  WIND_SPEED_DIV_ID,
  WIND_SPEED_SPAN_ID,
  CHOPPINESS_DIV_ID,
  SIZE_SLIDER_X,
  SIZE_SLIDER_Z,
  SIZE_SLIDER_LENGTH,
  MIN_SIZE,
  MAX_SIZE,
  SIZE_SLIDER_BREADTH,
  SIZE_HANDLE_SIZE,
  CHOPPINESS_SLIDER_X,
  CHOPPINESS_SLIDER_Z,
  CHOPPINESS_SLIDER_LENGTH,
  MIN_CHOPPINESS,
  MAX_CHOPPINESS,
  CHOPPINESS_SLIDER_BREADTH,
  CHOPPINESS_HANDLE_SIZE,
  ARROW_TIP_RADIUS,
  SIZE_HANDLE_RADIUS,
  CHOPPINESS_HANDLE_RADIUS,
  NONE,
  ORBITING,
  ROTATING,
  SLIDING_SIZE,
  SLIDING_CHOPPINESS,
  CAMERA_DISTANCE,
  ORBIT_POINT,
  INITIAL_AZIMUTH,
  INITIAL_ELEVATION,
  MIN_AZIMUTH,
  MAX_AZIMUTH,
  MIN_ELEVATION,
  MAX_ELEVATION,
  makeIdentityMatrix,
  makeXRotationMatrix,
  makeYRotationMatrix,
  setVector4,
  projectVector4,
  transformVectorByMatrix,
  invertMatrix,
  premultiplyMatrix,
  makePerspectiveMatrix,
  clamp,
  log2,
  buildProgramWrapper,
  buildShader,
  buildTexture,
  buildFramebuffer,
  toCSSMatrix,
  setPerspective,
  setTransform,
  setText,
  getMousePosition,
  hasWebGLSupportWithExtensions,
  requestAnimationFrame,
} from "./shared.js";
class Camera {
  constructor() {
    let azimuth = INITIAL_AZIMUTH,
      elevation = INITIAL_ELEVATION,
      viewMatrix = makeIdentityMatrix(new Float32Array(16)),
      position = new Float32Array(3),
      changed = true;

    this.changeAzimuth = function (deltaAzimuth) {
      azimuth += deltaAzimuth;
      azimuth = clamp(azimuth, MIN_AZIMUTH, MAX_AZIMUTH);
      changed = true;
    };

    this.changeElevation = function (deltaElevation) {
      elevation += deltaElevation;
      elevation = clamp(elevation, MIN_ELEVATION, MAX_ELEVATION);
      changed = true;
    };

    this.getPosition = function () {
      return position;
    };

    let orbitTranslationMatrix = makeIdentityMatrix(new Float32Array(16)),
      xRotationMatrix = new Float32Array(16),
      yRotationMatrix = new Float32Array(16),
      distanceTranslationMatrix = makeIdentityMatrix(new Float32Array(16));

    this.getViewMatrix = function () {
      if (changed) {
        makeIdentityMatrix(viewMatrix);

        makeXRotationMatrix(xRotationMatrix, elevation);
        makeYRotationMatrix(yRotationMatrix, azimuth);
        distanceTranslationMatrix[14] = -CAMERA_DISTANCE;
        orbitTranslationMatrix[12] = -ORBIT_POINT[0];
        orbitTranslationMatrix[13] = -ORBIT_POINT[1];
        orbitTranslationMatrix[14] = -ORBIT_POINT[2];

        premultiplyMatrix(viewMatrix, viewMatrix, orbitTranslationMatrix);
        premultiplyMatrix(viewMatrix, viewMatrix, yRotationMatrix);
        premultiplyMatrix(viewMatrix, viewMatrix, xRotationMatrix);
        premultiplyMatrix(viewMatrix, viewMatrix, distanceTranslationMatrix);

        position[0] =
          CAMERA_DISTANCE *
            Math.sin(Math.PI / 2 - elevation) *
            Math.sin(-azimuth) +
          ORBIT_POINT[0];
        position[1] =
          CAMERA_DISTANCE * Math.cos(Math.PI / 2 - elevation) + ORBIT_POINT[1];
        position[2] =
          CAMERA_DISTANCE *
            Math.sin(Math.PI / 2 - elevation) *
            Math.cos(-azimuth) +
          ORBIT_POINT[2];

        changed = false;
      }

      return viewMatrix;
    };
  }
}
export default Camera;
