export const log2 = function (number) {
  return Math.log(number) / Math.log(2);
};

export const buildProgramWrapper = function (
  gl,
  vertexShader,
  fragmentShader,
  attributeLocations
) {
  const programWrapper = {};

  const program = gl.createProgram();
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
  const uniformLocations = {};
  const numberOfUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < numberOfUniforms; i += 1) {
    const activeUniform = gl.getActiveUniform(program, i),
      uniformLocation = gl.getUniformLocation(program, activeUniform.name);
    uniformLocations[activeUniform.name] = uniformLocation;
  }

  programWrapper.program = program;
  programWrapper.uniformLocations = uniformLocations;

  return programWrapper;
};

export const buildShader = function (gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

export const buildTexture = function (
  gl,
  unit,
  format,
  type,
  width,
  height,
  data,
  wrapS,
  wrapT,
  minFilter,
  magFilter
) {
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, type, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
  return texture;
};

export const buildFramebuffer = function (gl, attachment) {
  const framebuffer = gl.createFramebuffer();
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

export const epsilon = function (x) {
  return Math.abs(x) < 0.000001 ? 0 : x;
};

export const toCSSMatrix = function (m) {
  //flip y to make css and webgl coordinates consistent
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

export const setPerspective = function (element, value) {
  element.style.WebkitPerspective = value;
  element.style.perspective = value;
};

export const setTransformOrigin = function (element, value) {
  element.style.WebkitTransformOrigin = value;
  element.style.transformOrigin = value;
};

export const setTransform = function (element, value) {
  element.style.WebkitTransform = value;
  element.style.transform = value;
};

export const setText = function (element, value, decimalPlaces) {
  element.textContent = value.toFixed(decimalPlaces);
};

export const getMousePosition = function (event, element) {
  const boundingRect = element.getBoundingClientRect();
  return {
    x: event.clientX - boundingRect.left,
    y: event.clientY - boundingRect.top,
  };
};

export const hasWebGLSupportWithExtensions = function (extensions) {
  let canvas = document.createElement("canvas");
  let gl = null;
  try {
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  } catch (e) {
    return false;
  }
  if (gl === null) {
    return false;
  }

  for (let i = 0; i < extensions.length; ++i) {
    if (gl.getExtension(extensions[i]) === null) {
      return false;
    }
  }

  return true;
};

export const requestAnimationFrame = window.requestAnimationFrame;
