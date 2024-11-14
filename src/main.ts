import {
  INITIAL_SIZE,
  INITIAL_WIND,
  INITIAL_CHOPPINESS,
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
} from "./constants";

import {
  setVector4,
  projectVector4,
  transformVectorByMatrix,
  invertMatrix,
  premultiplyMatrix,
  makePerspectiveMatrix,
} from "./mathUtils";

import {
  toCSSMatrix,
  setPerspective,
  setTransform,
  setText,
  getMousePosition,
  hasWebGLSupportWithExtensions,
  requestAnimationFrame,
} from "./shared";

import Arrow from "./Arrow";
import Slider from "./Slider";
import Camera from "./Camera";
import Simulator from "./Simulator";
import Profile from "./Profile";
import { Vector3, Vector4 } from "./types";

const main = function () {
  const simulatorCanvas = document.getElementById(
    SIMULATOR_CANVAS_ID
  ) as HTMLCanvasElement;
  const overlayDiv = document.getElementById(OVERLAY_DIV_ID) as HTMLDivElement;
  const uiDiv = document.getElementById(UI_DIV_ID) as HTMLDivElement;
  const cameraDiv = document.getElementById(CAMERA_DIV_ID) as HTMLDivElement;
  const windDiv = document.getElementById(WIND_SPEED_DIV_ID) as HTMLDivElement;
  const windSpeedSpan = document.getElementById(
    WIND_SPEED_SPAN_ID
  ) as HTMLSpanElement;
  const choppinessDiv = document.getElementById(
    CHOPPINESS_DIV_ID
  ) as HTMLDivElement;
  const sizeSpan = document.getElementById("size-value") as HTMLSpanElement;

  setText(choppinessDiv, INITIAL_CHOPPINESS, CHOPPINESS_DECIMAL_PLACES);
  setText(sizeSpan, INITIAL_SIZE, SIZE_DECIMAL_PLACES);

  const camera = new Camera();
  const projectionMatrix = makePerspectiveMatrix(
    new Float32Array(16),
    FOV,
    MIN_ASPECT,
    NEAR,
    FAR
  );

  const simulator = new Simulator(
    simulatorCanvas,
    window.innerWidth,
    window.innerHeight
  );

  const profile = new Profile(
    document.getElementById(PROFILE_CANVAS_ID) as HTMLCanvasElement
  );
  const sizeSlider = new Slider(
    cameraDiv,
    SIZE_SLIDER_X,
    SIZE_SLIDER_Z,
    SIZE_SLIDER_LENGTH,
    MIN_SIZE,
    MAX_SIZE,
    INITIAL_SIZE,
    SIZE_SLIDER_BREADTH,
    SIZE_HANDLE_SIZE
  );
  const choppinessSlider = new Slider(
    cameraDiv,
    CHOPPINESS_SLIDER_X,
    CHOPPINESS_SLIDER_Z,
    CHOPPINESS_SLIDER_LENGTH,
    MIN_CHOPPINESS,
    MAX_CHOPPINESS,
    INITIAL_CHOPPINESS,
    CHOPPINESS_SLIDER_BREADTH,
    CHOPPINESS_HANDLE_SIZE
  );

  let width = window.innerWidth;
  let height = window.innerHeight;

  let lastMouseX = 0;
  let lastMouseY = 0;
  let mode = NONE;

  const setUIPerspective = function (height: number): void {
    const fovValue = (0.5 / Math.tan(FOV / 2)) * height;
    setPerspective(uiDiv, `${fovValue}px`);
  };

  const windArrow = new Arrow(cameraDiv, INITIAL_WIND[0], INITIAL_WIND[1]);
  setText(windSpeedSpan, windArrow.getValue(), WIND_SPEED_DECIMAL_PLACES);
  setTransform(
    windDiv,
    `translate3d(${WIND_SPEED_X}px, 0px, ${Math.max(
      MIN_WIND_SPEED_Z,
      windArrow.getTipZ() + WIND_SPEED_OFFSET
    )}px) rotateX(90deg)`
  );

  const inverseProjectionViewMatrix = new Float32Array(16);
  const nearPoint = [0, 0, 0, 0] as Vector4;
  const farPoint = [0, 0, 0, 0] as Vector4;

  const unproject = function (
    viewMatrix: Float32Array,
    x: number,
    y: number,
    width: number,
    height: number
  ): number[] {
    premultiplyMatrix(
      inverseProjectionViewMatrix,
      viewMatrix,
      projectionMatrix
    );
    invertMatrix(inverseProjectionViewMatrix, inverseProjectionViewMatrix);

    setVector4(
      nearPoint as Vector4,
      (x / width) * 2.0 - 1.0,
      ((height - y) / height) * 2.0 - 1.0,
      1.0,
      1.0
    );
    transformVectorByMatrix(nearPoint, nearPoint, inverseProjectionViewMatrix);

    setVector4(
      farPoint,
      (x / width) * 2.0 - 1.0,
      ((height - y) / height) * 2.0 - 1.0,
      -1.0,
      1.0
    );
    transformVectorByMatrix(farPoint, farPoint, inverseProjectionViewMatrix);

    const projectedNearPoint = [0, 0, 0] as Vector3;
    const projectedFarPoint = [0, 0, 0] as Vector3;
    projectVector4(projectedNearPoint, nearPoint);
    projectVector4(projectedFarPoint, farPoint);

    const t =
      -projectedNearPoint[1] / (projectedFarPoint[1] - projectedNearPoint[1]);
    const point = [
      projectedNearPoint[0] +
        t * (projectedFarPoint[0] - projectedNearPoint[0]),
      projectedNearPoint[1] +
        t * (projectedFarPoint[1] - projectedNearPoint[1]),
      projectedNearPoint[2] +
        t * (projectedFarPoint[2] - projectedNearPoint[2]),
    ];

    return point;
  };

  const onMouseDown = function (event: MouseEvent): void {
    event.preventDefault();
    const mousePosition = getMousePosition(event, uiDiv);
    const mouseX = mousePosition.x;
    const mouseY = mousePosition.y;
    const point = unproject(
      camera.getViewMatrix(),
      mouseX,
      mouseY,
      width,
      height
    ) as Vector3;

    if (windArrow.distanceToTip(point) < ARROW_TIP_RADIUS) {
      mode = ROTATING;
    } else if (sizeSlider.distanceToHandle(point) < SIZE_HANDLE_RADIUS) {
      mode = SLIDING_SIZE;
    } else if (
      choppinessSlider.distanceToHandle(point) < CHOPPINESS_HANDLE_RADIUS
    ) {
      mode = SLIDING_CHOPPINESS;
    } else {
      mode = ORBITING;
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    }
  };
  overlayDiv.addEventListener("mousedown", onMouseDown, false);

  overlayDiv.addEventListener("mousemove", function (event: MouseEvent): void {
    event.preventDefault();
    const mousePosition = getMousePosition(event, uiDiv);
    const mouseX = mousePosition.x;
    const mouseY = mousePosition.y;
    const point = unproject(
      camera.getViewMatrix(),
      mouseX,
      mouseY,
      width,
      height
    );

    if (
      windArrow.distanceToTip(point as Vector3) < ARROW_TIP_RADIUS ||
      mode === ROTATING
    ) {
      overlayDiv.style.cursor = "move";
    } else if (
      sizeSlider.distanceToHandle(point as Vector3) < SIZE_HANDLE_RADIUS ||
      choppinessSlider.distanceToHandle(point as Vector3) <
        CHOPPINESS_HANDLE_RADIUS ||
      mode === SLIDING_SIZE ||
      mode === SLIDING_CHOPPINESS
    ) {
      overlayDiv.style.cursor = "ew-resize";
    } else if (mode === ORBITING) {
      overlayDiv.style.cursor = "grabbing";
    } else {
      overlayDiv.style.cursor = "grab";
    }

    if (mode === ORBITING) {
      camera.changeAzimuth(((mouseX - lastMouseX) / width) * SENSITIVITY);
      camera.changeElevation(((mouseY - lastMouseY) / height) * SENSITIVITY);
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    } else if (mode === ROTATING) {
      windArrow.update(point[0], point[2]);
      simulator.setWind(windArrow.getValueX(), windArrow.getValueY());
      setText(windSpeedSpan, windArrow.getValue(), WIND_SPEED_DECIMAL_PLACES);
      setTransform(
        windDiv,
        `translate3d(${WIND_SPEED_X}px, 0px, ${Math.max(
          MIN_WIND_SPEED_Z,
          windArrow.getTipZ() + WIND_SPEED_OFFSET
        )}px) rotateX(90deg)`
      );
    } else if (mode === SLIDING_SIZE) {
      sizeSlider.update(point[0], (size: number) => {
        simulator.setSize(size);
        setText(sizeSpan, size, SIZE_DECIMAL_PLACES);
      });
    } else if (mode === SLIDING_CHOPPINESS) {
      choppinessSlider.update(point[0], (choppiness: number) => {
        simulator.setChoppiness(choppiness);
        setText(choppinessDiv, choppiness, CHOPPINESS_DECIMAL_PLACES);
        profile.render(choppiness);
      });
    }
  });

  overlayDiv.addEventListener("mouseup", (event: MouseEvent): void => {
    event.preventDefault();
    mode = NONE;
  });

  window.addEventListener("mouseout", (event: MouseEvent): void => {
    const from = event.relatedTarget || (event.target as Element);
    if (!from || (from as any).nodeName === "HTML") {
      mode = NONE;
    }
  });

  const onresize = function (): void {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    overlayDiv.style.width = `${windowWidth}px`;
    overlayDiv.style.height = `${windowHeight}px`;

    if (windowWidth / windowHeight > MIN_ASPECT) {
      makePerspectiveMatrix(
        projectionMatrix,
        FOV,
        windowWidth / windowHeight,
        NEAR,
        FAR
      );
      simulator.resize(windowWidth, windowHeight);
      uiDiv.style.width = `${windowWidth}px`;
      uiDiv.style.height = `${windowHeight}px`;
      cameraDiv.style.width = `${windowWidth}px`;
      cameraDiv.style.height = `${windowHeight}px`;
      simulatorCanvas.style.top = "0px";
      uiDiv.style.top = "0px";
      setUIPerspective(windowHeight);
      width = windowWidth;
      height = windowHeight;
    } else {
      const newHeight = windowWidth / MIN_ASPECT;
      makePerspectiveMatrix(
        projectionMatrix,
        FOV,
        windowWidth / newHeight,
        NEAR,
        FAR
      );
      simulator.resize(windowWidth, newHeight);
      simulatorCanvas.style.top = `${(windowHeight - newHeight) * 0.5}px`;
      uiDiv.style.top = `${(windowHeight - newHeight) * 0.5}px`;
      setUIPerspective(newHeight);
      uiDiv.style.width = `${windowWidth}px`;
      uiDiv.style.height = `${newHeight}px`;
      cameraDiv.style.width = `${windowWidth}px`;
      cameraDiv.style.height = `${newHeight}px`;
      width = windowWidth;
      height = newHeight;
    }
  };

  window.addEventListener("resize", onresize);
  onresize();

  let lastTime = new Date().getTime();
  const render = function (currentTime: number): void {
    const deltaTime = (currentTime - lastTime) / 1000 || 0.0;
    lastTime = currentTime;

    const fovValue = (0.5 / Math.tan(FOV / 2)) * height;
    setTransform(
      cameraDiv,
      `translate3d(0px, 0px, ${fovValue}px) ${toCSSMatrix(
        camera.getViewMatrix() as any
      )} translate3d(${width / 2}px, ${height / 2}px, 0px)`
    );
    simulator.render(
      deltaTime,
      projectionMatrix,
      camera.getViewMatrix(),
      camera.getPosition()
    );

    requestAnimationFrame(render);
  };
  render(performance.now());
};

if (
  hasWebGLSupportWithExtensions([
    "OES_texture_float",
    "OES_texture_float_linear",
  ])
) {
  main();
} else {
  (document.getElementById("error") as HTMLDivElement).style.display = "block";
  (document.getElementById("footer") as HTMLDivElement).style.display = "none";
}
