import {
  HANDLE_COLOR,
  SLIDER_LEFT_COLOR,
  SLIDER_RIGHT_COLOR,
} from "./constants";

import {
  distanceBetweenVectors,
  clamp,
  setTransformOrigin,
  setTransform,
} from "./shared.js";

class Slider {
  constructor(
    parent,
    x,
    z,
    length,
    minValue,
    maxValue,
    value,
    sliderBreadth,
    handleSize
  ) {
    const sliderLeftDiv = document.createElement("div");
    sliderLeftDiv.style.position = "absolute";
    sliderLeftDiv.style.width = length + "px";
    sliderLeftDiv.style.height = sliderBreadth + "px";
    sliderLeftDiv.style.backgroundColor = SLIDER_LEFT_COLOR;
    setTransformOrigin(sliderLeftDiv, "center top");
    setTransform(
      sliderLeftDiv,
      "translate3d(" + x + "px, 0, " + z + "px) rotateX(90deg)"
    );
    parent.appendChild(sliderLeftDiv);

    const sliderRightDiv = document.createElement("div");
    sliderRightDiv.style.position = "absolute";
    sliderRightDiv.style.width = length + "px";
    sliderRightDiv.style.height = sliderBreadth + "px";
    sliderRightDiv.style.backgroundColor = SLIDER_RIGHT_COLOR;
    setTransformOrigin(sliderRightDiv, "center top");
    setTransform(
      sliderRightDiv,
      "translate3d(" + x + "px, 0, " + z + "px) rotateX(90deg)"
    );
    parent.appendChild(sliderRightDiv);

    const handleDiv = document.createElement("div");
    handleDiv.style.position = "absolute";
    handleDiv.style.width = handleSize + "px";
    handleDiv.style.height = handleSize + "px";
    handleDiv.style.borderRadius = handleSize * 0.5 + "px";
    handleDiv.style.background = HANDLE_COLOR;
    setTransformOrigin(handleDiv, "center top");
    setTransform(
      handleDiv,
      "translate3d(" + x + "px, 0px, " + z + "px) rotateX(90deg)"
    );
    parent.appendChild(handleDiv);

    const handleX =
      x +
      ((value - minValue) / (maxValue - minValue)) * length -
      handleDiv.offsetWidth / 2;

    const render = function () {
      const fraction = (value - minValue) / (maxValue - minValue);

      setTransform(
        handleDiv,
        "translate3d(" +
          (handleX - handleDiv.offsetWidth * 0.5) +
          "px, 0, " +
          (z - handleDiv.offsetHeight * 0.5) +
          "px) rotateX(90deg)"
      );
      sliderLeftDiv.style.width = fraction * length + "px";
      sliderRightDiv.style.width = (1.0 - fraction) * length + "px";
      setTransform(
        sliderRightDiv,
        "translate3d(" +
          (x + fraction * length) +
          "px, 0, " +
          z +
          "px) rotateX(90deg)"
      );
    };

    this.update = function (mouseX, callback) {
      handleX = clamp(mouseX, x, x + length);
      const fraction = clamp((mouseX - x) / length, 0.0, 1.0);
      value = minValue + fraction * (maxValue - minValue);

      callback(value);

      render();
    };

    this.getValue = function () {
      return value;
    };

    this.distanceToHandle = function (vector) {
      return distanceBetweenVectors([handleX, 0, z], vector);
    };

    render();
  }
}

export default Slider;
