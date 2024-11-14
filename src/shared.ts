type AttributeLocations = { [key: string]: number };
type UniformLocations = { [key: string]: WebGLUniformLocation | null };

// Program Wrapper Function
export const buildProgramWrapper = function (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
  attributeLocations: AttributeLocations
): { program: WebGLProgram; uniformLocations: UniformLocations } {
  const programWrapper: {
    program?: WebGLProgram;
    uniformLocations?: UniformLocations;
  } = {};

  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create WebGL program.");
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  for (const attributeName in attributeLocations) {
    gl.bindAttribLocation(
      program,
      attributeLocations[attributeName],
      attributeName
    );
  }

  gl.linkProgram(program);

  const uniformLocations: UniformLocations = {};
  const numberOfUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < numberOfUniforms; i++) {
    const activeUniform = gl.getActiveUniform(program, i);
    if (activeUniform) {
      uniformLocations[activeUniform.name] = gl.getUniformLocation(
        program,
        activeUniform.name
      );
    }
  }

  programWrapper.program = program;
  programWrapper.uniformLocations = uniformLocations;

  return programWrapper as {
    program: WebGLProgram;
    uniformLocations: UniformLocations;
  };
};

// Shader Builder Function
export const buildShader = function (
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create WebGL shader.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

// Texture Builder Function
export const buildTexture = function (
  gl: WebGLRenderingContext,
  unit: number,
  format: number,
  type: number,
  width: number,
  height: number,
  data: ArrayBufferView | null,
  wrapS: number,
  wrapT: number,
  minFilter: number,
  magFilter: number
): WebGLTexture {
  const texture = gl.createTexture();
  if (!texture) throw new Error("Unable to create WebGL texture.");
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, type, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
  return texture;
};

// Framebuffer Builder Function
export const buildFramebuffer = function (
  gl: WebGLRenderingContext,
  attachment: WebGLTexture
): WebGLFramebuffer {
  const framebuffer = gl.createFramebuffer();
  if (!framebuffer) throw new Error("Unable to create WebGL framebuffer.");
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    attachment,
    0
  );
  return framebuffer;
};

// Utility Functions
export const epsilon = (x: number): number => (Math.abs(x) < 0.000001 ? 0 : x);

export const toCSSMatrix = (m: number[]): string => {
  return (
    "matrix3d(" +
    epsilon(m[0]) +
    "," +
    -epsilon(m[1]) +
    "," +
    epsilon(m[2]) +
    "," +
    epsilon(m[3]) +
    "," +
    epsilon(m[4]) +
    "," +
    -epsilon(m[5]) +
    "," +
    epsilon(m[6]) +
    "," +
    epsilon(m[7]) +
    "," +
    epsilon(m[8]) +
    "," +
    -epsilon(m[9]) +
    "," +
    epsilon(m[10]) +
    "," +
    epsilon(m[11]) +
    "," +
    epsilon(m[12]) +
    "," +
    -epsilon(m[13]) +
    "," +
    epsilon(m[14]) +
    "," +
    epsilon(m[15]) +
    ")"
  );
};

export const setPerspective = (element: HTMLElement, value: string): void => {
  element.style.webkitPerspective = value;
  element.style.perspective = value;
};

export const setTransformOrigin = (
  element: HTMLElement,
  value: string
): void => {
  element.style.webkitTransformOrigin = value;
  element.style.transformOrigin = value;
};

export const setTransform = (element: HTMLElement, value: string): void => {
  element.style.webkitTransform = value;
  element.style.transform = value;
};

export const setText = (
  element: HTMLElement,
  value: number,
  decimalPlaces: number
): void => {
  element.textContent = value.toFixed(decimalPlaces);
};

export const getMousePosition = (
  event: MouseEvent,
  element: HTMLElement
): { x: number; y: number } => {
  const boundingRect = element.getBoundingClientRect();
  return {
    x: event.clientX - boundingRect.left,
    y: event.clientY - boundingRect.top,
  };
};

export const hasWebGLSupportWithExtensions = (
  extensions: string[]
): boolean => {
  const canvas = document.createElement("canvas");
  let gl: WebGLRenderingContext | null = null;
  try {
    gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as any);
  } catch {
    return false;
  }
  if (!gl) return false;

  return extensions.every((ext) => gl.getExtension(ext) !== null);
};

export const requestAnimationFrame = window.requestAnimationFrame || (() => {});
