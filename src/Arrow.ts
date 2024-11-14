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
} from "./constants";

import {
  addToVector,
  subtractFromVector,
  multiplyVectorByScalar,
  distanceBetweenVectors,
  lengthOfVector,
} from "./mathUtils";

import { setTransformOrigin, setTransform } from "./shared";
import { Vector3 } from "./types";

// Define types for vectors

class Arrow {
  private arrow: Vector3;
  private tip: Vector3;
  private shaftDiv: HTMLDivElement;
  private headDiv: HTMLDivElement;
  private valueX: number;
  private valueY: number;

  constructor(parent: HTMLElement, valueX: number, valueY: number) {
    this.valueX = valueX;
    this.valueY = valueY;
    this.arrow = [valueX * WIND_SCALE, 0.0, valueY * WIND_SCALE];
    this.tip = addToVector([0, 0, 0], ARROW_ORIGIN as Vector3, this.arrow);

    // Create and style the shaft element
    this.shaftDiv = document.createElement("div");
    this.shaftDiv.style.position = "absolute";
    this.shaftDiv.style.width = `${ARROW_SHAFT_WIDTH}px`;
    this.shaftDiv.style.background = UI_COLOR;
    setTransformOrigin(this.shaftDiv, "center top");
    setTransform(
      this.shaftDiv,
      `translate3d(${ARROW_ORIGIN[0] - ARROW_SHAFT_WIDTH / 2}px, ${
        ARROW_ORIGIN[1]
      }px, ${ARROW_ORIGIN[2]}px) rotateX(90deg)`
    );
    parent.appendChild(this.shaftDiv);

    // Create and style the head element
    this.headDiv = document.createElement("div");
    this.headDiv.style.position = "absolute";
    this.headDiv.style.borderStyle = "solid";
    this.headDiv.style.borderColor = `${UI_COLOR} transparent transparent transparent`;
    this.headDiv.style.borderWidth = `${ARROW_HEAD_HEIGHT}px ${
      ARROW_HEAD_WIDTH / 2
    }px 0px ${ARROW_HEAD_WIDTH / 2}px`;
    setTransformOrigin(this.headDiv, "center top");
    setTransform(
      this.headDiv,
      `translate3d(${ARROW_ORIGIN[0] - ARROW_HEAD_WIDTH / 2}px, ${
        ARROW_ORIGIN[1]
      }px, ${ARROW_ORIGIN[2]}px) rotateX(90deg)`
    );
    parent.appendChild(this.headDiv);

    this.render();
  }

  private render(): void {
    const angle = Math.atan2(this.arrow[2], this.arrow[0]);
    const arrowLength = lengthOfVector(this.arrow);

    this.shaftDiv.style.height = `${
      arrowLength - ARROW_HEAD_HEIGHT + 1 + ARROW_OFFSET
    }px`;
    setTransform(
      this.shaftDiv,
      `translate3d(${ARROW_ORIGIN[0] - ARROW_SHAFT_WIDTH / 2}px, ${
        ARROW_ORIGIN[1]
      }px, ${ARROW_ORIGIN[2]}px) rotateX(90deg) rotateZ(${
        angle - Math.PI / 2
      }rad) translateY(${-ARROW_OFFSET}px)`
    );
    setTransform(
      this.headDiv,
      `translate3d(${ARROW_ORIGIN[0] - ARROW_HEAD_WIDTH / 2}px, ${
        ARROW_ORIGIN[1]
      }px, ${ARROW_ORIGIN[2]}px) rotateX(90deg) rotateZ(${
        angle - Math.PI / 2
      }rad) translateY(${arrowLength - ARROW_HEAD_HEIGHT - 1}px)`
    );
  }

  public update(mouseX: number, mouseZ: number): void {
    this.arrow = [mouseX, 0, mouseZ];
    subtractFromVector(this.arrow, this.arrow, ARROW_ORIGIN as Vector3);

    const arrowLength = lengthOfVector(this.arrow);
    if (arrowLength > MAX_WIND_SPEED * WIND_SCALE) {
      multiplyVectorByScalar(
        this.arrow,
        this.arrow,
        (MAX_WIND_SPEED * WIND_SCALE) / arrowLength
      );
    } else if (arrowLength < MIN_WIND_SPEED * WIND_SCALE) {
      multiplyVectorByScalar(
        this.arrow,
        this.arrow,
        (MIN_WIND_SPEED * WIND_SCALE) / arrowLength
      );
    }

    addToVector(this.tip, ARROW_ORIGIN as Vector3, this.arrow);

    this.render();

    this.valueX = this.arrow[0] / WIND_SCALE;
    this.valueY = this.arrow[2] / WIND_SCALE;
  }

  public getValue(): number {
    return lengthOfVector(this.arrow) / WIND_SCALE;
  }

  public getValueX(): number {
    return this.valueX;
  }

  public getValueY(): number {
    return this.valueY;
  }

  public distanceToTip(vector: Vector3): number {
    return distanceBetweenVectors(this.tip, vector);
  }

  public getTipZ(): number {
    return this.tip[2];
  }
}

export default Arrow;
