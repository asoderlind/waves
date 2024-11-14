import {
  UI_COLOR,
  ARROW_ORIGIN,
  ARROW_SHAFT_WIDTH,
  ARROW_HEAD_WIDTH,
  ARROW_HEAD_HEIGHT,
  ARROW_OFFSET,
  WIND_SCALE,
  MIN_WIND_SPEED,
  MAX_WIND_SPEED,
} from "./constants.ts";

import {
  addToVector,
  subtractFromVector,
  multiplyVectorByScalar,
  distanceBetweenVectors,
  lengthOfVector,
  setTransformOrigin,
  setTransform,
} from "./shared.js";
class Arrow {
  constructor(parent, valueX, valueY) {
    const arrow = [valueX * WIND_SCALE, 0.0, valueY * WIND_SCALE];
    const tip = addToVector([], ARROW_ORIGIN, arrow);

    const shaftDiv = document.createElement("div");
    shaftDiv.style.position = "absolute";
    shaftDiv.style.width = ARROW_SHAFT_WIDTH + "px";
    shaftDiv.style.background = UI_COLOR;
    setTransformOrigin(shaftDiv, "center top");
    setTransform(
      shaftDiv,
      "translate3d(" +
        (ARROW_ORIGIN[0] - ARROW_SHAFT_WIDTH / 2) +
        "px, " +
        ARROW_ORIGIN[1] +
        "px, " +
        ARROW_ORIGIN[2] +
        "px) rotateX(90deg)"
    );
    parent.appendChild(shaftDiv);

    const headDiv = document.createElement("div");
    headDiv.style.position = "absolute";
    headDiv.style.borderStyle = "solid";
    headDiv.style.borderColor =
      UI_COLOR + " transparent transparent transparent";
    headDiv.style.borderWidth =
      ARROW_HEAD_HEIGHT +
      "px " +
      ARROW_HEAD_WIDTH / 2 +
      "px 0px " +
      ARROW_HEAD_WIDTH / 2 +
      "px";
    setTransformOrigin(headDiv, "center top");
    setTransform(
      headDiv,
      "translate3d(" +
        (ARROW_ORIGIN[0] - ARROW_HEAD_WIDTH / 2) +
        "px, " +
        ARROW_ORIGIN[1] +
        "px, " +
        ARROW_ORIGIN[2] +
        "px) rotateX(90deg)"
    );
    parent.appendChild(headDiv);

    const render = function () {
      const angle = Math.atan2(arrow[2], arrow[0]);

      const arrowLength = lengthOfVector(arrow);

      shaftDiv.style.height =
        arrowLength - ARROW_HEAD_HEIGHT + 1 + ARROW_OFFSET + "px";
      setTransform(
        shaftDiv,
        "translate3d(" +
          (ARROW_ORIGIN[0] - ARROW_SHAFT_WIDTH / 2) +
          "px, " +
          ARROW_ORIGIN[1] +
          "px, " +
          ARROW_ORIGIN[2] +
          "px) rotateX(90deg) rotateZ(" +
          (angle - Math.PI / 2) +
          "rad) translateY(" +
          -ARROW_OFFSET +
          "px)"
      );
      setTransform(
        headDiv,
        "translate3d(" +
          (ARROW_ORIGIN[0] - ARROW_HEAD_WIDTH / 2) +
          "px, " +
          ARROW_ORIGIN[1] +
          "px, " +
          ARROW_ORIGIN[2] +
          "px) rotateX(90deg) rotateZ(" +
          (angle - Math.PI / 2) +
          "rad) translateY(" +
          (arrowLength - ARROW_HEAD_HEIGHT - 1) +
          "px)"
      );
    };

    this.update = function (mouseX, mouseZ) {
      arrow = [mouseX, 0, mouseZ];
      subtractFromVector(arrow, arrow, ARROW_ORIGIN);

      const arrowLength = lengthOfVector(arrow);
      if (arrowLength > MAX_WIND_SPEED * WIND_SCALE) {
        multiplyVectorByScalar(
          arrow,
          arrow,
          (MAX_WIND_SPEED * WIND_SCALE) / arrowLength
        );
      } else if (lengthOfVector(arrow) < MIN_WIND_SPEED * WIND_SCALE) {
        multiplyVectorByScalar(
          arrow,
          arrow,
          (MIN_WIND_SPEED * WIND_SCALE) / arrowLength
        );
      }

      addToVector(tip, ARROW_ORIGIN, arrow);

      render();

      valueX = arrow[0] / WIND_SCALE;
      valueY = arrow[2] / WIND_SCALE;
    };

    this.getValue = function () {
      return lengthOfVector(arrow) / WIND_SCALE;
    };

    this.getValueX = function () {
      return valueX;
    };

    this.getValueY = function () {
      return valueY;
    };

    this.distanceToTip = function (vector) {
      return distanceBetweenVectors(tip, vector);
    };

    this.getTipZ = function () {
      return tip[2];
    };

    render();
  }
}

export default Arrow;
