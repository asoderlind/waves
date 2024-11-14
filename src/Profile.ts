import {
  PROFILE_AMPLITUDE,
  PROFILE_OMEGA,
  PROFILE_PHI,
  PROFILE_STEP,
  PROFILE_OFFSET,
  PROFILE_COLOR,
  PROFILE_LINE_WIDTH,
  CHOPPINESS_SCALE,
} from "./constants";

class Profile {
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not get 2D context for the canvas.");
    }
    this.context = context;
    this.width = canvas.width;
    this.height = canvas.height;

    this.context.strokeStyle = PROFILE_COLOR;
    this.context.lineWidth = PROFILE_LINE_WIDTH;
  }

  private evaluateX(x: number, choppiness: number): number {
    return (
      x -
      choppiness *
        CHOPPINESS_SCALE *
        PROFILE_AMPLITUDE *
        Math.sin(x * PROFILE_OMEGA + PROFILE_PHI)
    );
  }

  private evaluateY(x: number): number {
    return (
      PROFILE_AMPLITUDE * Math.cos(x * PROFILE_OMEGA + PROFILE_PHI) +
      PROFILE_OFFSET
    );
  }

  public render(choppiness: number): void {
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.beginPath();
    this.context.moveTo(this.evaluateX(0, choppiness), this.evaluateY(0));
    for (let x = 0; x <= this.width; x += PROFILE_STEP) {
      this.context.lineTo(this.evaluateX(x, choppiness), this.evaluateY(x));
    }
    this.context.stroke();
  }
}

// Create a default instance with the initial choppiness
export default Profile;
