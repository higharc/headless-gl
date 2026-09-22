'use strict'

const tape = require('tape')
const createContext = require('../index')
const makeProgram = require('./util/make-program')

const VERT_SRC = `#version 300 es
uniform Transform {
  mat4 uModel;
  vec4 uColor;
} transform;
uniform Lighting {
  highp vec4 uDirection;
} lighting;
void main () {
  gl_Position = transform.uModel * transform.uColor + lighting.uDirection;
}`

const FRAG_SRC = `#version 300 es
precision mediump float;
uniform Lighting {
  highp vec4 uDirection;
} lighting;
out vec4 fragColor;
void main () {
  fragColor = lighting.uDirection;
}`

function createWebGL2Context () {
  return createContext(10, 10, { createWebGL2Context: true })
}

function makeBlockProgram (gl) {
  const program = makeProgram(gl, VERT_SRC, FRAG_SRC)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error('the test program failed to link: ' + gl.getProgramInfoLog(program))
  }
  return program
}

tape('getUniformBlockIndex', function (t) {
  const gl = createWebGL2Context()
  const program = makeBlockProgram(gl)

  const transform = gl.getUniformBlockIndex(program, 'Transform')
  const lighting = gl.getUniformBlockIndex(program, 'Lighting')
  t.equals(gl.getError(), gl.NO_ERROR, 'no error is generated')
  t.ok(transform < gl.getProgramParameter(program, gl.ACTIVE_UNIFORM_BLOCKS), 'Transform is an active block')
  t.ok(lighting < gl.getProgramParameter(program, gl.ACTIVE_UNIFORM_BLOCKS), 'Lighting is an active block')
  t.notEquals(transform, lighting, 'the two blocks have different indices')

  t.equals(gl.getUniformBlockIndex(program, 'Missing'), gl.INVALID_INDEX, 'an unknown block is INVALID_INDEX')

  t.throws(function () {
    gl.getUniformBlockIndex(42, 'Transform')
  }, TypeError, 'a non-object program throws')

  gl.getUniformBlockIndex(null, 'Transform')
  t.equals(gl.getError(), gl.INVALID_VALUE, 'a null program is an invalid value')

  t.end()
})

tape('getActiveUniformBlockName', function (t) {
  const gl = createWebGL2Context()
  const program = makeBlockProgram(gl)

  const index = gl.getUniformBlockIndex(program, 'Transform')
  t.equals(gl.getActiveUniformBlockName(program, index), 'Transform', 'the block name is read back')
  t.equals(gl.getError(), gl.NO_ERROR, 'no error is generated')

  const blocks = gl.getProgramParameter(program, gl.ACTIVE_UNIFORM_BLOCKS)
  t.equals(gl.getActiveUniformBlockName(program, blocks), null, 'an out of range index returns null')
  t.equals(gl.getError(), gl.INVALID_VALUE, 'and generates an invalid value error')

  t.end()
})

tape('getActiveUniformBlockParameter', function (t) {
  const gl = createWebGL2Context()
  const program = makeBlockProgram(gl)

  const transform = gl.getUniformBlockIndex(program, 'Transform')
  const lighting = gl.getUniformBlockIndex(program, 'Lighting')

  const activeUniforms = gl.getActiveUniformBlockParameter(program, transform, gl.UNIFORM_BLOCK_ACTIVE_UNIFORMS)
  t.equals(activeUniforms, 2, 'Transform has two active uniforms')
  t.equals(typeof activeUniforms, 'number', 'the active uniform count is a number')

  const dataSize = gl.getActiveUniformBlockParameter(program, transform, gl.UNIFORM_BLOCK_DATA_SIZE)
  t.ok(dataSize >= 80, 'the block is big enough for a mat4 and a vec4')

  t.equals(gl.getActiveUniformBlockParameter(program, transform, gl.UNIFORM_BLOCK_BINDING), 0,
    'blocks are bound to binding point zero by default')

  const indices = gl.getActiveUniformBlockParameter(program, transform, gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES)
  t.ok(indices instanceof Uint32Array, 'the active uniform indices are a Uint32Array')
  t.equals(indices.length, 2, 'there is one index per active uniform')

  t.equals(gl.getActiveUniformBlockParameter(program, transform, gl.UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER), true,
    'Transform is referenced by the vertex shader')
  t.equals(gl.getActiveUniformBlockParameter(program, transform, gl.UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER), false,
    'Transform is not referenced by the fragment shader')
  t.equals(gl.getActiveUniformBlockParameter(program, lighting, gl.UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER), true,
    'Lighting is referenced by the fragment shader')
  t.equals(gl.getError(), gl.NO_ERROR, 'no error is generated')

  t.equals(gl.getActiveUniformBlockParameter(program, transform, gl.UNIFORM_BLOCK_INDEX), null,
    'an unsupported pname returns null')
  t.equals(gl.getError(), gl.INVALID_ENUM, 'and generates an invalid enum error')

  const blocks = gl.getProgramParameter(program, gl.ACTIVE_UNIFORM_BLOCKS)
  t.equals(gl.getActiveUniformBlockParameter(program, blocks, gl.UNIFORM_BLOCK_DATA_SIZE), null,
    'an out of range block index returns null')
  t.equals(gl.getError(), gl.INVALID_VALUE, 'and generates an invalid value error')

  t.end()
})

tape('getUniformIndices and getActiveUniforms', function (t) {
  const gl = createWebGL2Context()
  const program = makeBlockProgram(gl)

  const indices = gl.getUniformIndices(program, ['Transform.uModel', 'Transform.uColor', 'Lighting.uDirection'])
  t.equals(gl.getError(), gl.NO_ERROR, 'no error is generated')
  t.ok(Array.isArray(indices), 'the indices are a plain array')
  t.equals(indices.length, 3, 'one index per name')
  for (const index of indices) {
    t.notEquals(index, gl.INVALID_INDEX, `the uniform ${index} was found`)
  }

  t.equals(gl.getUniformIndices(program, ['Nope'])[0], gl.INVALID_INDEX, 'an unknown uniform is INVALID_INDEX')

  const types = gl.getActiveUniforms(program, indices, gl.UNIFORM_TYPE)
  t.deepEquals(types, [gl.FLOAT_MAT4, gl.FLOAT_VEC4, gl.FLOAT_VEC4], 'the uniform types are read back')

  const sizes = gl.getActiveUniforms(program, indices, gl.UNIFORM_SIZE)
  t.deepEquals(sizes, [1, 1, 1], 'the uniform sizes are read back')

  const blockIndices = gl.getActiveUniforms(program, indices, gl.UNIFORM_BLOCK_INDEX)
  t.equals(blockIndices[0], blockIndices[1], 'the Transform uniforms share a block')
  t.notEquals(blockIndices[0], blockIndices[2], 'the Lighting uniform is in another block')

  const offsets = gl.getActiveUniforms(program, indices, gl.UNIFORM_OFFSET)
  t.equals(offsets[0], 0, 'the first uniform is at offset zero')
  t.ok(offsets[1] >= 64, 'the second uniform follows the mat4')

  t.deepEquals(gl.getActiveUniforms(program, indices, gl.UNIFORM_ARRAY_STRIDE), [0, 0, 0],
    'the non-array uniforms have no array stride')
  t.ok(gl.getActiveUniforms(program, indices, gl.UNIFORM_MATRIX_STRIDE)[0] > 0, 'the mat4 has a matrix stride')

  const rowMajor = gl.getActiveUniforms(program, indices, gl.UNIFORM_IS_ROW_MAJOR)
  t.deepEquals(rowMajor, [false, false, false], 'the uniforms are read back as column major booleans')
  t.equals(gl.getError(), gl.NO_ERROR, 'no error is generated')

  t.equals(gl.getActiveUniforms(program, indices, gl.UNIFORM_BLOCK_DATA_SIZE), null, 'an unsupported pname returns null')
  t.equals(gl.getError(), gl.INVALID_ENUM, 'and generates an invalid enum error')

  t.equals(gl.getActiveUniforms(program, [0xFFFF], gl.UNIFORM_TYPE), null, 'an out of range index returns null')
  t.equals(gl.getError(), gl.INVALID_VALUE, 'and generates an invalid value error')

  t.throws(function () {
    gl.getUniformIndices(program, 'Transform.uModel')
  }, TypeError, 'a non-sequence of names throws')
  t.throws(function () {
    gl.getActiveUniforms(program, 0, gl.UNIFORM_TYPE)
  }, TypeError, 'a non-sequence of indices throws')

  t.end()
})

tape('uniformBlockBinding and getIndexedParameter', function (t) {
  const gl = createWebGL2Context()
  const program = makeBlockProgram(gl)

  const transform = gl.getUniformBlockIndex(program, 'Transform')
  gl.uniformBlockBinding(program, transform, 1)
  t.equals(gl.getError(), gl.NO_ERROR, 'uniformBlockBinding succeeds')
  t.equals(gl.getActiveUniformBlockParameter(program, transform, gl.UNIFORM_BLOCK_BINDING), 1,
    'the block reports its new binding point')

  // Ranges have to start at a multiple of the implementation's alignment.
  const alignment = gl.getParameter(gl.UNIFORM_BUFFER_OFFSET_ALIGNMENT)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.UNIFORM_BUFFER, buffer)
  gl.bufferData(gl.UNIFORM_BUFFER, alignment * 2, gl.DYNAMIC_DRAW)

  t.equals(gl.getIndexedParameter(gl.UNIFORM_BUFFER_BINDING, 1), null, 'nothing is bound to binding point one yet')

  gl.bindBufferRange(gl.UNIFORM_BUFFER, 1, buffer, alignment, 128)
  t.equals(gl.getError(), gl.NO_ERROR, 'bindBufferRange succeeds')
  t.equals(gl.getIndexedParameter(gl.UNIFORM_BUFFER_BINDING, 1), buffer, 'the buffer wrapper is returned')
  t.equals(gl.getIndexedParameter(gl.UNIFORM_BUFFER_START, 1), alignment, 'the range start is returned')
  t.equals(gl.getIndexedParameter(gl.UNIFORM_BUFFER_SIZE, 1), 128, 'the range size is returned')

  gl.bindBufferBase(gl.UNIFORM_BUFFER, 2, buffer)
  t.equals(gl.getIndexedParameter(gl.UNIFORM_BUFFER_BINDING, 2), buffer, 'bindBufferBase binds the whole buffer')
  t.equals(gl.getIndexedParameter(gl.UNIFORM_BUFFER_START, 2), 0, 'the whole buffer starts at zero')

  t.equals(gl.getIndexedParameter(gl.TRANSFORM_FEEDBACK_BUFFER_BINDING, 0), null,
    'the transform feedback binding is empty')

  t.equals(gl.getIndexedParameter(gl.ARRAY_BUFFER_BINDING, 0), null, 'a non indexed target returns null')
  t.equals(gl.getError(), gl.INVALID_ENUM, 'and generates an invalid enum error')

  const maxBindings = gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS)
  t.equals(gl.getIndexedParameter(gl.UNIFORM_BUFFER_BINDING, maxBindings), null, 'an out of range index returns null')
  t.equals(gl.getError(), gl.INVALID_VALUE, 'and generates an invalid value error')

  // Deleting the buffer unbinds it everywhere, so the wrapper must be gone too.
  gl.deleteBuffer(buffer)
  t.equals(gl.getIndexedParameter(gl.UNIFORM_BUFFER_BINDING, 1), null, 'a deleted buffer is no longer bound')

  t.end()
})

tape('the uniform block api is rejected by a webgl1 context', function (t) {
  const gl = createContext(10, 10)
  const program = makeProgram(gl,
    'void main () { gl_Position = vec4(0, 0, 0, 1); }',
    'void main () { gl_FragColor = vec4(1); }')

  t.equals(gl.getUniformBlockIndex(program, 'Transform'), 0xFFFFFFFF, 'getUniformBlockIndex is INVALID_INDEX')
  t.equals(gl.getError(), gl.INVALID_ENUM, 'getUniformBlockIndex is an invalid enum')

  const queries = [
    ['getActiveUniformBlockName', () => gl.getActiveUniformBlockName(program, 0)],
    ['getActiveUniformBlockParameter', () => gl.getActiveUniformBlockParameter(program, 0, 0x8A40)],
    ['getUniformIndices', () => gl.getUniformIndices(program, ['uColor'])],
    ['getActiveUniforms', () => gl.getActiveUniforms(program, [0], 0x8A37)],
    ['getIndexedParameter', () => gl.getIndexedParameter(0x8A28, 0)]
  ]
  for (const [name, query] of queries) {
    t.equals(query(), null, name + ' returns null')
    t.equals(gl.getError(), gl.INVALID_ENUM, name + ' is an invalid enum')
  }

  gl.uniformBlockBinding(program, 0, 0)
  t.equals(gl.getError(), gl.INVALID_ENUM, 'uniformBlockBinding is an invalid enum')

  t.end()
})
