'use strict'

const { spawnSync } = require('child_process')
const tape = require('tape')
const createContext = require('../index')
const { gl: nativeGL } = require('../src/javascript/native-gl')
const makeProgram = require('./util/make-program')
const drawTriangle = require('./util/draw-triangle')

function checkInterruptedUpload (t, createWebGL2Context) {
  const gl = createContext(4, 4, { createWebGL2Context })
  const program = makeProgram(gl,
    'attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }',
    'precision mediump float; uniform mat4 transform; void main() { gl_FragColor = transform * vec4(1.0, 0.0, 0.0, 0.0); }')
  t.ok(gl.getProgramParameter(program, gl.LINK_STATUS), 'program links')
  gl.useProgram(program)
  const location = gl.getUniformLocation(program, 'transform')
  const matrix = new Float32Array([0.25, 0.5, 0.75, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  let other = createContext(4, 4, { createWebGL2Context })
  const registry = new FinalizationRegistry(() => {
    t.pass('the other context was collected')
    t.end()
  })
  registry.register(other, null)
  t.timeoutAfter(10000)
  let conversions = 0

  // Coercion runs after the native setter makes gl current. It gives disposal a
  // deterministic interruption point, like GC during typed-array materialization.
  nativeGL.uniformMatrix4fv.call(location._program._ctx, {
    valueOf () {
      ++conversions
      other = null
      global.gc()
      return location._
    }
  }, false, matrix)

  t.equal(conversions, 1, 'disposal interrupted the native upload')
  t.deepEqual(gl.getUniform(program, location), matrix, 'the interrupted upload reaches the original context')
  drawTriangle(gl)
  const pixel = new Uint8Array(4)
  gl.readPixels(1, 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel)
  t.deepEqual(Array.from(pixel), [64, 128, 191, 255], 'rendering uses the uploaded matrix')
  t.equal(gl.getError(), gl.NO_ERROR, 'no GL error')
  gl.getExtension('STACKGL_destroy_context').destroy()
}

for (const createWebGL2Context of [false, true]) {
  const version = createWebGL2Context ? 'WebGL2' : 'WebGL1'
  if (process.argv.includes('--gc-child')) {
    tape(version + ' upload survives GC of another context', function (t) {
      checkInterruptedUpload(t, createWebGL2Context)
    })
  } else {
    tape(version + ' can destroy the current context and use a sibling', function (t) {
      const gl = createContext(4, 4, { createWebGL2Context })
      const other = createContext(4, 4, { createWebGL2Context })
      const destroy = other.getExtension('STACKGL_destroy_context')
      destroy.destroy()
      gl.clearColor(1, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      const pixel = new Uint8Array(4)
      gl.readPixels(1, 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel)
      t.deepEqual(Array.from(pixel), [255, 0, 0, 255], 'the sibling still renders after disposal')
      t.equal(gl.getError(), gl.NO_ERROR, 'no GL error')
      gl.getExtension('STACKGL_destroy_context').destroy()
      t.end()
    })
  }
}

if (!process.argv.includes('--gc-child')) {
  tape('context collection during native uploads', function (t) {
    const result = spawnSync(process.execPath, ['--expose-gc', __filename, '--gc-child'], {
      encoding: 'utf8',
      timeout: 30000
    })
    t.error(result.error, 'GC subprocess completes')
    if (result.status !== 0) {
      t.comment(result.stdout + result.stderr)
    }
    t.equal(result.status, 0, 'WebGL1 and WebGL2 uploads survive context collection')
    t.end()
  })
}
