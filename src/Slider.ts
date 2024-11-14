import {
  HANDLE_COLOR,
  SLIDER_LEFT_COLOR,
  SLIDER_RIGHT_COLOR,
} from "./constants";

import { distanceBetweenVectors, clamp } from "./mathUtils";

import { setTransformOrigin, setTransform } from "./shared";

// Define type for 3D vector
type Vector3 = [number, number, number];

class Slider {
  private length: number;
  private minValue: number;
  private maxValue: number;
  private value: number;
  private sliderBreadth: number;
  private handleSize: number;
  private handleX: number;
  private handleDiv: HTMLDivElement;
  private sliderLeftDiv: HTMLDivElement;
  private sliderRightDiv: HTMLDivElement;
  private x: number;
  private z: number;

  constructor(
    parent: HTMLElement,
    x: number,
    z: number,
    length: number,
    minValue: number,
    maxValue: number,
    value: number,
    sliderBreadth: number,
    handleSize: number
  ) {
    this.x = x;
    this.z = z;
    this.length = length;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.value = value;
    this.sliderBreadth = sliderBreadth;
    this.handleSize = handleSize;

    // Initialize slider left section
    this.sliderLeftDiv = document.createElement("div");
    this.sliderLeftDiv.style.position = "absolute";
    this.sliderLeftDiv.style.width = `${length}px`;
    this.sliderLeftDiv.style.height = `${sliderBreadth}px`;
    this.sliderLeftDiv.style.backgroundColor = SLIDER_LEFT_COLOR;
    setTransformOrigin(this.sliderLeftDiv, "center top");
    setTransform(
      this.sliderLeftDiv,
      `translate3d(${x}px, 0, ${z}px) rotateX(90deg)`
    );
    parent.appendChild(this.sliderLeftDiv);

    // Initialize slider right section
    this.sliderRightDiv = document.createElement("div");
    this.sliderRightDiv.style.position = "absolute";
    this.sliderRightDiv.style.width = `${length}px`;
    this.sliderRightDiv.style.height = `${sliderBreadth}px`;
    this.sliderRightDiv.style.backgroundColor = SLIDER_RIGHT_COLOR;
    setTransformOrigin(this.sliderRightDiv, "center top");
    setTransform(
      this.sliderRightDiv,
      `translate3d(${x}px, 0, ${z}px) rotateX(90deg)`
    );
    parent.appendChild(this.sliderRightDiv);

    // Initialize handle
    this.handleDiv = document.createElement("div");
    this.handleDiv.style.position = "absolute";
    this.handleDiv.style.width = `${handleSize}px`;
    this.handleDiv.style.height = `${handleSize}px`;
    this.handleDiv.style.borderRadius = `${handleSize * 0.5}px`;
    this.handleDiv.style.background = HANDLE_COLOR;
    setTransformOrigin(this.handleDiv, "center top");
    setTransform(
      this.handleDiv,
      `translate3d(${x}px, 0px, ${z}px) rotateX(90deg)`
    );
    parent.appendChild(this.handleDiv);

    // Calculate initial handle position
    this.handleX =
      x +
      ((value - minValue) / (maxValue - minValue)) * length -
      this.handleDiv.offsetWidth / 2;

    this.render();
  }

  private render(): void {
    const fraction =
      (this.value - this.minValue) / (this.maxValue - this.minValue);

    setTransform(
      this.handleDiv,
      `translate3d(${this.handleX - this.handleDiv.offsetWidth * 0.5}px, 0, ${
        this.z - this.handleDiv.offsetHeight * 0.5
      }px) rotateX(90deg)`
    );

    this.sliderLeftDiv.style.width = `${fraction * this.length}px`;
    this.sliderRightDiv.style.width = `${(1.0 - fraction) * this.length}px`;
    setTransform(
      this.sliderRightDiv,
      `translate3d(${this.x + fraction * this.length}px, 0, ${
        this.z
      }px) rotateX(90deg)`
    );
  }

  public update(mouseX: number, callback: (value: number) => void): void {
    this.handleX = clamp(mouseX, this.x, this.x + this.length);
    const fraction = clamp((mouseX - this.x) / this.length, 0.0, 1.0);
    this.value = this.minValue + fraction * (this.maxValue - this.minValue);

    callback(this.value);

    this.render();
  }

  public getValue(): number {
    return this.value;
  }

  public distanceToHandle(vector: Vector3): number {
    return distanceBetweenVectors([this.handleX, 0, this.z], vector);
  }
}

export default Slider;
