'use strict'

const tape = require('tape')
const createContext = require('../index')
const makeProgram = require('./util/make-program')

const VERT_SRC = `#version 300 es
uniform uint uScalar;
uniform uvec3 uVector;
uniform mat2x3 uMatrix;
void main () {
  gl_Position = vec4(float(uScalar) + float(uVector.x) + uMatrix[0][0], 0, 0, 1);
}`

const FRAG_SRC = `#version 300 es
precision mediump float;
uniform mediump sampler2DArray uSampler;
out vec4 fragColor;
void main () {
  fragColor = texture(uSampler, vec3(0, 0, 0));
}`

tape('webgl2 version strings', function (t) {
  const gl1 = createContext(10, 10)
  t.ok(/^WebGL 1\.0 /.test(gl1.getParameter(gl1.VERSION)), 'webgl1 reports a WebGL 1.0 version')
  t.equals(gl1.getParameter(gl1.SHADING_LANGUAGE_VERSION), 'WebGL GLSL ES 1.0 stack-gl', 'webgl1 reports a GLSL ES 1.0 version')

  const gl2 = createContext(10, 10, { createWebGL2Context: true })
  t.ok(/^WebGL 2\.0 /.test(gl2.getParameter(gl2.VERSION)), 'webgl2 reports a WebGL 2.0 version')
  t.equals(gl2.getParameter(gl2.SHADING_LANGUAGE_VERSION), 'WebGL GLSL ES 3.00 stack-gl', 'webgl2 reports a GLSL ES 3.00 version')

  t.end()
})

tape('webgl2 texParameterf parameters', function (t) {
  const gl = createContext(10, 10, { createWebGL2Context: true })
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())

  const pnames = [
    [gl.TEXTURE_BASE_LEVEL, 0],
    [gl.TEXTURE_MAX_LEVEL, 4],
    [gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE],
    [gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL],
    [gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE]
  ]

  for (const [pname, param] of pnames) {
    gl.texParameterf(gl.TEXTURE_2D, pname, param)
    t.equals(gl.getError(), gl.NO_ERROR, 'texParameterf(' + pname + ') is accepted')
    t.equals(gl.getTexParameter(gl.TEXTURE_2D, pname), param, 'texParameterf(' + pname + ') takes effect')
  }

  // The LOD limits are floats, but native getTexParameter reads everything
  // except the anisotropy parameter with glGetTexParameteriv, so they're
  // rounded on the way back and only their acceptance can be checked here.
  for (const [pname, param] of [[gl.TEXTURE_MIN_LOD, -0.5], [gl.TEXTURE_MAX_LOD, 2.5]]) {
    gl.texParameterf(gl.TEXTURE_2D, pname, param)
    t.equals(gl.getError(), gl.NO_ERROR, 'texParameterf(' + pname + ') is accepted')
    gl.getTexParameter(gl.TEXTURE_2D, pname)
    t.equals(gl.getError(), gl.NO_ERROR, 'getTexParameter(' + pname + ') is accepted')
  }

  const gl1 = createContext(10, 10)
  gl1.bindTexture(gl1.TEXTURE_2D, gl1.createTexture())
  // TEXTURE_WRAP_R, which doesn't exist in WebGL 1.0.
  gl1.texParameterf(gl1.TEXTURE_2D, 0x8072, gl1.CLAMP_TO_EDGE)
  t.equals(gl1.getError(), gl1.INVALID_ENUM, 'webgl2 parameters are rejected by a webgl1 context')

  t.end()
})

tape('webgl2 getUniform types', function (t) {
  const gl = createContext(10, 10, { createWebGL2Context: true })
  const program = makeProgram(gl, VERT_SRC, FRAG_SRC)
  t.ok(gl.getProgramParameter(program, gl.LINK_STATUS), 'the program links')
  gl.useProgram(program)

  gl.uniform1ui(gl.getUniformLocation(program, 'uScalar'), 7)
  const scalar = gl.getUniform(program, gl.getUniformLocation(program, 'uScalar'))
  t.equals(scalar, 7, 'uint is read back')

  gl.uniform3uiv(gl.getUniformLocation(program, 'uVector'), [1, 2, 3])
  const vector = gl.getUniform(program, gl.getUniformLocation(program, 'uVector'))
  t.ok(vector instanceof Uint32Array, 'uvec3 is read back as a Uint32Array')
  t.deepEquals(Array.from(vector), [1, 2, 3], 'uvec3 is read back')

  gl.uniform3ui(gl.getUniformLocation(program, 'uVector'), 4, 5, 6)
  t.deepEquals(Array.from(gl.getUniform(program, gl.getUniformLocation(program, 'uVector'))), [4, 5, 6], 'uniform3ui sets uvec3')
  t.equals(gl.getError(), gl.NO_ERROR, 'no error from uint setters')

  gl.uniformMatrix2x3fv(gl.getUniformLocation(program, 'uMatrix'), false, [1, 2, 3, 4, 5, 6])
  const matrix = gl.getUniform(program, gl.getUniformLocation(program, 'uMatrix'))
  t.ok(matrix instanceof Float32Array, 'mat2x3 is read back as a Float32Array')
  t.deepEquals(Array.from(matrix), [1, 2, 3, 4, 5, 6], 'mat2x3 is read back')

  gl.uniformMatrix2x3fv(gl.getUniformLocation(program, 'uMatrix'), true, [1, 2, 3, 4, 5, 6])
  t.deepEquals(Array.from(gl.getUniform(program, gl.getUniformLocation(program, 'uMatrix'))), [1, 3, 5, 2, 4, 6], 'mat2x3 can be set transposed')

  gl.uniformMatrix2x3fv(gl.getUniformLocation(program, 'uMatrix'), false, [1, 2, 3, 4])
  t.equals(gl.getError(), gl.INVALID_VALUE, 'wrong matrix data length is rejected')

  gl.uniform1i(gl.getUniformLocation(program, 'uSampler'), 3)
  t.equals(gl.getUniform(program, gl.getUniformLocation(program, 'uSampler')), 3, 'sampler2DArray is read back')

  t.end()
})

tape('webgl2 uint uniform setters with null location', function (t) {
  const gl = createContext(10, 10, { createWebGL2Context: true })
  const program = makeProgram(gl, VERT_SRC, FRAG_SRC)
  gl.useProgram(program)

  gl.uniform1ui(null, 1)
  gl.uniform2ui(null, 1, 2)
  gl.uniform3ui(null, 1, 2, 3)
  gl.uniform4ui(null, 1, 2, 3, 4)
  gl.uniform1uiv(null, [1])
  gl.uniform2uiv(null, [1, 2])
  gl.uniform3uiv(null, [1, 2, 3])
  gl.uniform4uiv(null, new Uint32Array([1, 2, 3, 4]))
  t.equals(gl.getError(), gl.NO_ERROR, 'null location is silently ignored')

  gl.uniform1ui(gl.getUniformLocation(program, 'uVector'), 1)
  t.equals(gl.getError(), gl.INVALID_OPERATION, 'size mismatch is rejected')

  t.end()
})

tape('webgl2 non-square matrix uniform setters with null location', function (t) {
  const gl = createContext(10, 10, { createWebGL2Context: true })
  const program = makeProgram(gl, VERT_SRC, FRAG_SRC)
  gl.useProgram(program)

  gl.uniformMatrix2x3fv(null, false, new Float32Array(6))
  gl.uniformMatrix3x2fv(null, false, new Float32Array(6))
  gl.uniformMatrix2x4fv(null, false, new Float32Array(8))
  gl.uniformMatrix4x2fv(null, false, new Float32Array(8))
  gl.uniformMatrix3x4fv(null, false, new Float32Array(12))
  gl.uniformMatrix4x3fv(null, false, new Float32Array(12))
  t.equals(gl.getError(), gl.NO_ERROR, 'null location is silently ignored')

  t.end()
})
