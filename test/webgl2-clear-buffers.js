'use strict'

const tape = require('tape')
const createContext = require('../index')

for (const [method, ArrayType, formatName, typeName, color] of [
  ['clearBufferfv', Float32Array, 'RGBA8', 'UNSIGNED_BYTE', [0.25, 0.5, 0.75, 1]],
  ['clearBufferiv', Int32Array, 'RGBA32I', 'INT', [-7, 17, -99, 255]],
  ['clearBufferuiv', Uint32Array, 'RGBA32UI', 'UNSIGNED_INT', [7, 17, 999, 4294967295]]
]) {
  tape(method + ' accepts arrays, views, and source offsets without changing failed clears', function (t) {
    const gl = createContext(2, 2, { createWebGL2Context: true })
    t.ok(gl, 'creates a WebGL2 context')
    if (!gl) return t.end()
    try {
      const framebuffer = gl.createFramebuffer()
      const attachment = gl.createRenderbuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
      gl.bindRenderbuffer(gl.RENDERBUFFER, attachment)
      gl.renderbufferStorage(gl.RENDERBUFFER, gl[formatName], 2, 2)
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, attachment)
      t.equal(gl.checkFramebufferStatus(gl.FRAMEBUFFER), gl.FRAMEBUFFER_COMPLETE, 'color attachment is complete')
      const integer = ArrayType !== Float32Array
      const pixels = integer ? new ArrayType(4) : new Uint8Array(4)
      const expected = integer ? color : [64, 128, 191, 255]
      const checkPixels = label => {
        gl.readPixels(0, 0, 1, 1, integer ? gl.RGBA_INTEGER : gl.RGBA, gl[typeName], pixels)
        t.equal(gl.getError(), gl.NO_ERROR, label + ' readback succeeds')
        t.deepEqual(Array.from(pixels), expected, label + ' color matches')
      }
      const storage = new ArrayType([123, 123, ...color, 123])
      for (const [values, offset, label] of [
        [color, 0, 'ordinary array'],
        [[123, ...color], 1, 'array source offset'],
        [storage.subarray(2, 6), 0, 'typed-array byte offset'],
        [storage.subarray(1), 1, 'combined byte and source offsets']
      ]) {
        gl[method](gl.COLOR, 0, values, offset)
        t.equal(gl.getError(), gl.NO_ERROR, label + ' clears')
        checkPixels(label)
      }
      for (const [values, offset] of [
        [[], 0], [new ArrayType(3), 0], [storage.subarray(2, 5), 0],
        [color, 1], [color, -1], [color, 0xffffffff], [storage, storage.length]
      ]) {
        gl[method](gl.COLOR, 0, values, offset)
        t.equal(gl.getError(), gl.INVALID_VALUE, 'insufficient values or out-of-range offset is rejected')
        checkPixels('rejected clear')
      }
      for (const values of [null, undefined, {}, new ArrayBuffer(16), new DataView(new ArrayBuffer(16)), new Float64Array(4)]) {
        t.throws(() => gl[method](gl.COLOR, 0, values), TypeError, 'invalid input throws without crashing')
        checkPixels('invalid input')
      }
      const detached = new ArrayType(4)
      structuredClone(detached.buffer, { transfer: [detached.buffer] })
      t.throws(() => gl[method](gl.COLOR, 0, detached), TypeError, 'detached view is rejected')
      checkPixels('detached view')
      const throwing = [...color]
      Object.defineProperty(throwing, 1, { get () { throw new Error('value conversion failed') } })
      t.throws(() => gl[method](gl.COLOR, 0, throwing), /value conversion failed/, 'getter exception propagates')
      checkPixels('throwing getter')
      gl[method](gl.FRAMEBUFFER, 0, color)
      t.equal(gl.getError(), gl.INVALID_ENUM, 'invalid buffer enum is rejected')
    } finally {
      gl.getExtension('STACKGL_destroy_context').destroy()
      t.end()
    }
  })
}

tape('depth and stencil clears accept one value at an offset', function (t) {
  const gl = createContext(2, 2, { createWebGL2Context: true, stencil: true })
  try {
    gl.clearBufferfv(gl.DEPTH, 0, new Float32Array([99, 0.5]).subarray(1))
    t.equal(gl.getError(), gl.NO_ERROR, 'depth typed-array subview')
    gl.clearBufferiv(gl.STENCIL, 0, [99, 7], 1)
    t.equal(gl.getError(), gl.NO_ERROR, 'stencil array offset')
    gl.clearBufferuiv(gl.DEPTH, 0, [1])
    t.equal(gl.getError(), gl.INVALID_ENUM, 'unsigned clear accepts only color')
    gl.clearBufferfv(gl.STENCIL, 0, [1])
    t.equal(gl.getError(), gl.INVALID_ENUM, 'float clear rejects stencil')
    gl.clearBufferiv(gl.DEPTH, 0, [1])
    t.equal(gl.getError(), gl.INVALID_ENUM, 'signed clear rejects depth')
  } finally {
    gl.getExtension('STACKGL_destroy_context').destroy()
    t.end()
  }
})
