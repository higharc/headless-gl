'use strict'

const tape = require('tape')
const createContext = require('../index')

function createWebGL2Context () {
  return createContext(10, 10, { createWebGL2Context: true })
}

tape('webgl2 buffer targets can be bound', function (t) {
  const gl = createWebGL2Context()

  const targets = [
    [gl.ARRAY_BUFFER, gl.ARRAY_BUFFER_BINDING],
    [gl.ELEMENT_ARRAY_BUFFER, gl.ELEMENT_ARRAY_BUFFER_BINDING],
    [gl.COPY_READ_BUFFER, gl.COPY_READ_BUFFER_BINDING],
    [gl.COPY_WRITE_BUFFER, gl.COPY_WRITE_BUFFER_BINDING],
    [gl.PIXEL_PACK_BUFFER, gl.PIXEL_PACK_BUFFER_BINDING],
    [gl.PIXEL_UNPACK_BUFFER, gl.PIXEL_UNPACK_BUFFER_BINDING],
    [gl.TRANSFORM_FEEDBACK_BUFFER, gl.TRANSFORM_FEEDBACK_BUFFER_BINDING],
    [gl.UNIFORM_BUFFER, gl.UNIFORM_BUFFER_BINDING]
  ]

  for (const [target, binding] of targets) {
    const buffer = gl.createBuffer()
    gl.bindBuffer(target, buffer)
    t.equals(gl.getError(), gl.NO_ERROR, 'bindBuffer(' + target + ') succeeds')
    t.equals(gl.getParameter(binding), buffer, 'buffer is bound to ' + target)

    gl.bindBuffer(target, null)
    t.equals(gl.getParameter(binding), null, 'buffer is unbound from ' + target)
  }

  t.end()
})

tape('webgl2 buffer targets are rejected by a webgl1 context', function (t) {
  const gl = createContext(10, 10)
  const buffer = gl.createBuffer()

  // These enums are not exposed by a WebGL 1.0 context, so use their values.
  const targets = [
    0x8F36, // COPY_READ_BUFFER
    0x8F37, // COPY_WRITE_BUFFER
    0x88EB, // PIXEL_PACK_BUFFER
    0x88EC, // PIXEL_UNPACK_BUFFER
    0x8C8E, // TRANSFORM_FEEDBACK_BUFFER
    0x8A11 // UNIFORM_BUFFER
  ]

  for (const target of targets) {
    gl.bindBuffer(target, buffer)
    t.equals(gl.getError(), gl.INVALID_ENUM, 'bindBuffer(' + target + ') is an invalid enum')

    gl.bufferData(target, 16, gl.STATIC_DRAW)
    t.equals(gl.getError(), gl.INVALID_ENUM, 'bufferData(' + target + ') is an invalid enum')

    gl.getBufferParameter(target, gl.BUFFER_SIZE)
    t.equals(gl.getError(), gl.INVALID_ENUM, 'getBufferParameter(' + target + ') is an invalid enum')
  }

  gl.bindBufferBase(0x8C8E, 0, buffer)
  t.equals(gl.getError(), gl.INVALID_ENUM, 'bindBufferBase is not available')
  gl.bindBufferRange(0x8C8E, 0, buffer, 0, 16)
  t.equals(gl.getError(), gl.INVALID_ENUM, 'bindBufferRange is not available')

  t.end()
})

tape('webgl2 buffer data can be uploaded and queried', function (t) {
  const gl = createWebGL2Context()
  const buffer = gl.createBuffer()

  gl.bindBuffer(gl.UNIFORM_BUFFER, buffer)
  gl.bufferData(gl.UNIFORM_BUFFER, 16, gl.DYNAMIC_READ)
  t.equals(gl.getError(), gl.NO_ERROR, 'bufferData succeeds')
  t.equals(gl.getBufferParameter(gl.UNIFORM_BUFFER, gl.BUFFER_SIZE), 16, 'buffer size is reported')
  t.equals(gl.getBufferParameter(gl.UNIFORM_BUFFER, gl.BUFFER_USAGE), gl.DYNAMIC_READ, 'buffer usage is reported')

  gl.bufferSubData(gl.UNIFORM_BUFFER, 4, new Uint8Array(4))
  t.equals(gl.getError(), gl.NO_ERROR, 'bufferSubData succeeds')

  gl.bufferSubData(gl.UNIFORM_BUFFER, 16, new Uint8Array(4))
  t.equals(gl.getError(), gl.INVALID_VALUE, 'bufferSubData past the end of the buffer fails')

  gl.bindBuffer(gl.UNIFORM_BUFFER, null)
  gl.bufferData(gl.UNIFORM_BUFFER, 16, gl.STATIC_DRAW)
  t.equals(gl.getError(), gl.INVALID_OPERATION, 'bufferData without a bound buffer fails')

  t.end()
})

tape('webgl2 element array buffers cannot be used as other data', function (t) {
  const gl = createWebGL2Context()

  const elementBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer)
  gl.bindBuffer(gl.UNIFORM_BUFFER, elementBuffer)
  t.equals(gl.getError(), gl.INVALID_OPERATION, 'an element array buffer cannot be bound as other data')
  t.equals(gl.getParameter(gl.UNIFORM_BUFFER_BINDING), null, 'the binding point is untouched')

  const dataBuffer = gl.createBuffer()
  gl.bindBuffer(gl.UNIFORM_BUFFER, dataBuffer)
  gl.bindBuffer(gl.PIXEL_PACK_BUFFER, dataBuffer)
  t.equals(gl.getError(), gl.NO_ERROR, 'other data buffers can be bound to several targets')
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dataBuffer)
  t.equals(gl.getError(), gl.INVALID_OPERATION, 'an other data buffer cannot be bound as an element array buffer')
  t.equals(gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING), elementBuffer, 'the binding point is untouched')

  // The copy binding points type a buffer that doesn't have a type yet as
  // other data.
  const copyBuffer = gl.createBuffer()
  gl.bindBuffer(gl.COPY_READ_BUFFER, copyBuffer)
  t.equals(gl.getError(), gl.NO_ERROR, 'an untyped buffer can be bound for copying')
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, copyBuffer)
  t.equals(gl.getError(), gl.INVALID_OPERATION, 'a buffer first bound for copying is other data')

  // They leave the type of an already typed buffer untouched, though.
  gl.bindBuffer(gl.COPY_READ_BUFFER, elementBuffer)
  gl.bindBuffer(gl.COPY_WRITE_BUFFER, elementBuffer)
  t.equals(gl.getError(), gl.NO_ERROR, 'an element array buffer can be bound for copying')
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer)
  t.equals(gl.getError(), gl.NO_ERROR, 'and stays an element array buffer')

  gl.bindBuffer(gl.COPY_READ_BUFFER, dataBuffer)
  t.equals(gl.getError(), gl.NO_ERROR, 'an other data buffer can be bound for copying')
  gl.bindBuffer(gl.UNIFORM_BUFFER, dataBuffer)
  t.equals(gl.getError(), gl.NO_ERROR, 'and stays other data')

  t.end()
})

tape('webgl2 indexed buffer bindings', function (t) {
  const gl = createWebGL2Context()
  const buffer = gl.createBuffer()

  gl.bindBuffer(gl.UNIFORM_BUFFER, buffer)
  gl.bufferData(gl.UNIFORM_BUFFER, 256, gl.STATIC_DRAW)
  gl.bindBuffer(gl.UNIFORM_BUFFER, null)

  gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, buffer)
  t.equals(gl.getError(), gl.NO_ERROR, 'bindBufferBase succeeds')
  t.equals(gl.getParameter(gl.UNIFORM_BUFFER_BINDING), buffer, 'bindBufferBase also sets the generic binding')

  gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, null)
  t.equals(gl.getParameter(gl.UNIFORM_BUFFER_BINDING), null, 'bindBufferBase(null) clears the generic binding')

  gl.bindBufferRange(gl.UNIFORM_BUFFER, 0, buffer, 0, 16)
  t.equals(gl.getError(), gl.NO_ERROR, 'bindBufferRange succeeds')
  t.equals(gl.getParameter(gl.UNIFORM_BUFFER_BINDING), buffer, 'bindBufferRange also sets the generic binding')

  gl.bindBufferBase(gl.ARRAY_BUFFER, 0, buffer)
  t.equals(gl.getError(), gl.INVALID_ENUM, 'bindBufferBase only accepts the indexed targets')
  gl.bindBufferRange(gl.ARRAY_BUFFER, 0, buffer, 0, 16)
  t.equals(gl.getError(), gl.INVALID_ENUM, 'bindBufferRange only accepts the indexed targets')

  // A failed binding leaves the generic binding point untouched.
  const maxBindings = gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS)
  gl.bindBufferBase(gl.UNIFORM_BUFFER, maxBindings, buffer)
  t.equals(gl.getError(), gl.INVALID_VALUE, 'bindBufferBase rejects an out of range index')
  t.equals(gl.getParameter(gl.UNIFORM_BUFFER_BINDING), buffer, 'the generic binding is untouched')

  t.end()
})

tape('indexed buffer bindings set the webgl2 buffer type', function (t) {
  const gl = createWebGL2Context()

  const elementBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer)
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, elementBuffer)
  t.equals(gl.getError(), gl.INVALID_OPERATION, 'an element array buffer cannot be bound as other data')
  t.equals(gl.getParameter(gl.TRANSFORM_FEEDBACK_BUFFER_BINDING), null, 'the binding point is untouched')

  const dataBuffer = gl.createBuffer()
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, dataBuffer)
  t.equals(gl.getError(), gl.NO_ERROR, 'a new buffer can be bound to an indexed binding point')
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dataBuffer)
  t.equals(gl.getError(), gl.INVALID_OPERATION, 'the buffer is now other data')

  t.end()
})

tape('deleting a buffer unbinds it from webgl2 targets', function (t) {
  const gl = createWebGL2Context()
  const buffer = gl.createBuffer()

  gl.bindBuffer(gl.UNIFORM_BUFFER, buffer)
  gl.bindBuffer(gl.COPY_READ_BUFFER, buffer)
  gl.deleteBuffer(buffer)

  t.equals(gl.getParameter(gl.UNIFORM_BUFFER_BINDING), null, 'the uniform buffer binding is cleared')
  t.equals(gl.getParameter(gl.COPY_READ_BUFFER_BINDING), null, 'the copy read buffer binding is cleared')
  t.equals(gl.getError(), gl.NO_ERROR, 'no error is generated')

  t.end()
})

tape('element array buffers written through the copy binding points', function (t) {
  const gl = createWebGL2Context()
  const buffer = gl.createBuffer()

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2]), gl.STATIC_DRAW)

  // Resizing through a copy binding point has to keep the shadow copy of the
  // element data in sync with the buffer size.
  gl.bindBuffer(gl.COPY_WRITE_BUFFER, buffer)
  gl.bufferData(gl.COPY_WRITE_BUFFER, 1000, gl.STATIC_DRAW)
  t.equals(gl.getBufferParameter(gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_SIZE), 1000, 'the buffer is resized')

  gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint8Array(100))
  t.equals(gl.getError(), gl.NO_ERROR, 'the resized element data can be written')

  gl.bufferSubData(gl.COPY_WRITE_BUFFER, 900, new Uint8Array(100))
  t.equals(gl.getError(), gl.NO_ERROR, 'element data can be written through a copy binding point')

  // Shrinking through a copy binding point has to be tracked as well.
  gl.bufferData(gl.COPY_WRITE_BUFFER, new Uint16Array([0, 1, 2]), gl.STATIC_DRAW)
  gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint8Array(6))
  t.equals(gl.getError(), gl.NO_ERROR, 'the shrunk element data can be written')
  gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint8Array(8))
  t.equals(gl.getError(), gl.INVALID_VALUE, 'writing past the shrunk element data fails')

  t.end()
})
