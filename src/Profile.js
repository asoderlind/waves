import {
  INITIAL_CHOPPINESS,
  PROFILE_AMPLITUDE,
  PROFILE_OMEGA,
  PROFILE_PHI,
  PROFILE_STEP,
  PROFILE_OFFSET,
  PROFILE_COLOR,
  PROFILE_LINE_WIDTH,
  CHOPPINESS_SCALE,
} from "./shared.js";

class Profile {
  constructor(canvas) {
    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    context.strokeStyle = PROFILE_COLOR;
    context.lineWidth = PROFILE_LINE_WIDTH;

    const evaluateX = function (x, choppiness) {
      return (
        x -
        choppiness *
          CHOPPINESS_SCALE *
          PROFILE_AMPLITUDE *
          Math.sin(x * PROFILE_OMEGA + PROFILE_PHI)
      );
    };

    const evaluateY = function (x) {
      return (
        PROFILE_AMPLITUDE * Math.cos(x * PROFILE_OMEGA + PROFILE_PHI) +
        PROFILE_OFFSET
      );
    };

    this.render = function (choppiness) {
      context.clearRect(0, 0, width, height);
      context.beginPath();
      context.moveTo(evaluateX(0, choppiness), evaluateY(0));
      for (let x = 0; x <= width; x += PROFILE_STEP) {
        context.lineTo(evaluateX(x, choppiness), evaluateY(x));
      }
      context.stroke();
    };
    this.render(INITIAL_CHOPPINESS);
  }
}
export default Profile;
