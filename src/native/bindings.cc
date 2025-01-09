/*
 * bindings.cc
 *
 *  Created on: Dec 13, 2011
 *      Author: ngk437
 */

#include <cstdlib>
#include "webgl.h"

Nan::Persistent<v8::FunctionTemplate> WEBGL_TEMPLATE;

#define JS_GL_METHOD(webgl_name, method_name) \
    Nan::SetPrototypeTemplate(                \
        webgl_template, webgl_name, Nan::New<v8::FunctionTemplate>(WebGLRenderingContext::method_name))

#define JS_CONSTANT(x, v)      \
    Nan::SetPrototypeTemplate( \
        webgl_template, #x, Nan::New<v8::Integer>(v))

#define JS_GL_CONSTANT(name) JS_CONSTANT(name, GL_##name)

NAN_MODULE_INIT(Init)
{
    v8::Local<v8::FunctionTemplate> webgl_template =
        Nan::New<v8::FunctionTemplate>(WebGLRenderingContext::New);

    webgl_template->InstanceTemplate()->SetInternalFieldCount(1);
    webgl_template->SetClassName(
        Nan::New<v8::String>("WebGLRenderingContext").ToLocalChecked());

    /* WebGL methods */
    JS_GL_METHOD("_drawArraysInstancedANGLE", DrawArraysInstancedANGLE);
    JS_GL_METHOD("_drawElementsInstancedANGLE", DrawElementsInstancedANGLE);
    JS_GL_METHOD("_vertexAttribDivisorANGLE", VertexAttribDivisorANGLE);

    JS_GL_METHOD("getUniform", GetUniform);
    JS_GL_METHOD("uniform1f", Uniform1f);
    JS_GL_METHOD("uniform2f", Uniform2f);
    JS_GL_METHOD("uniform3f", Uniform3f);
    JS_GL_METHOD("uniform4f", Uniform4f);
    JS_GL_METHOD("uniform1i", Uniform1i);
    JS_GL_METHOD("uniform2i", Uniform2i);
    JS_GL_METHOD("uniform3i", Uniform3i);
    JS_GL_METHOD("uniform4i", Uniform4i);
    JS_GL_METHOD("pixelStorei", PixelStorei);
    JS_GL_METHOD("bindAttribLocation", BindAttribLocation);
    JS_GL_METHOD("getError", GetError);
    JS_GL_METHOD("drawArrays", DrawArrays);
    JS_GL_METHOD("uniformMatrix2fv", UniformMatrix2fv);
    JS_GL_METHOD("uniformMatrix3fv", UniformMatrix3fv);
    JS_GL_METHOD("uniformMatrix4fv", UniformMatrix4fv);
    JS_GL_METHOD("generateMipmap", GenerateMipmap);
    JS_GL_METHOD("getAttribLocation", GetAttribLocation);
    JS_GL_METHOD("depthFunc", DepthFunc);
    JS_GL_METHOD("viewport", Viewport);
    JS_GL_METHOD("createShader", CreateShader);
    JS_GL_METHOD("shaderSource", ShaderSource);
    JS_GL_METHOD("compileShader", CompileShader);
    JS_GL_METHOD("getShaderParameter", GetShaderParameter);
    JS_GL_METHOD("getShaderInfoLog", GetShaderInfoLog);
    JS_GL_METHOD("createProgram", CreateProgram);
    JS_GL_METHOD("attachShader", AttachShader);
    JS_GL_METHOD("linkProgram", LinkProgram);
    JS_GL_METHOD("getProgramParameter", GetProgramParameter);
    JS_GL_METHOD("getUniformLocation", GetUniformLocation);
    JS_GL_METHOD("clearColor", ClearColor);
    JS_GL_METHOD("clearDepth", ClearDepth);
    JS_GL_METHOD("disable", Disable);
    JS_GL_METHOD("createTexture", CreateTexture);
    JS_GL_METHOD("bindTexture", BindTexture);
    JS_GL_METHOD("texImage2D", TexImage2D);
    JS_GL_METHOD("texParameteri", TexParameteri);
    JS_GL_METHOD("texParameterf", TexParameterf);
    JS_GL_METHOD("clear", Clear);
    JS_GL_METHOD("useProgram", UseProgram);
    JS_GL_METHOD("createFramebuffer", CreateFramebuffer);
    JS_GL_METHOD("bindFramebuffer", BindFramebuffer);
    JS_GL_METHOD("framebufferTexture2D", FramebufferTexture2D);
    JS_GL_METHOD("createBuffer", CreateBuffer);
    JS_GL_METHOD("bindBuffer", BindBuffer);
    JS_GL_METHOD("bufferData", BufferData);
    JS_GL_METHOD("bufferSubData", BufferSubData);
    JS_GL_METHOD("enable", Enable);
    JS_GL_METHOD("blendEquation", BlendEquation);
    JS_GL_METHOD("blendFunc", BlendFunc);
    JS_GL_METHOD("enableVertexAttribArray", EnableVertexAttribArray);
    JS_GL_METHOD("vertexAttribPointer", VertexAttribPointer);
    JS_GL_METHOD("activeTexture", ActiveTexture);
    JS_GL_METHOD("drawElements", DrawElements);
    JS_GL_METHOD("flush", Flush);
    JS_GL_METHOD("finish", Finish);
    JS_GL_METHOD("vertexAttrib1f", VertexAttrib1f);
    JS_GL_METHOD("vertexAttrib2f", VertexAttrib2f);
    JS_GL_METHOD("vertexAttrib3f", VertexAttrib3f);
    JS_GL_METHOD("vertexAttrib4f", VertexAttrib4f);
    JS_GL_METHOD("blendColor", BlendColor);
    JS_GL_METHOD("blendEquationSeparate", BlendEquationSeparate);
    JS_GL_METHOD("blendFuncSeparate", BlendFuncSeparate);
    JS_GL_METHOD("clearStencil", ClearStencil);
    JS_GL_METHOD("colorMask", ColorMask);
    JS_GL_METHOD("copyTexImage2D", CopyTexImage2D);
    JS_GL_METHOD("copyTexSubImage2D", CopyTexSubImage2D);
    JS_GL_METHOD("cullFace", CullFace);
    JS_GL_METHOD("depthMask", DepthMask);
    JS_GL_METHOD("depthRange", DepthRange);
    JS_GL_METHOD("disableVertexAttribArray", DisableVertexAttribArray);
    JS_GL_METHOD("hint", Hint);
    JS_GL_METHOD("isEnabled", IsEnabled);
    JS_GL_METHOD("lineWidth", LineWidth);
    JS_GL_METHOD("polygonOffset", PolygonOffset);
    JS_GL_METHOD("scissor", Scissor);
    JS_GL_METHOD("stencilFunc", StencilFunc);
    JS_GL_METHOD("stencilFuncSeparate", StencilFuncSeparate);
    JS_GL_METHOD("stencilMask", StencilMask);
    JS_GL_METHOD("stencilMaskSeparate", StencilMaskSeparate);
    JS_GL_METHOD("stencilOp", StencilOp);
    JS_GL_METHOD("stencilOpSeparate", StencilOpSeparate);
    JS_GL_METHOD("bindRenderbuffer", BindRenderbuffer);
    JS_GL_METHOD("createRenderbuffer", CreateRenderbuffer);
    JS_GL_METHOD("deleteBuffer", DeleteBuffer);
    JS_GL_METHOD("deleteFramebuffer", DeleteFramebuffer);
    JS_GL_METHOD("deleteProgram", DeleteProgram);
    JS_GL_METHOD("deleteRenderbuffer", DeleteRenderbuffer);
    JS_GL_METHOD("deleteShader", DeleteShader);
    JS_GL_METHOD("deleteTexture", DeleteTexture);
    JS_GL_METHOD("detachShader", DetachShader);
    JS_GL_METHOD("framebufferRenderbuffer", FramebufferRenderbuffer);
    JS_GL_METHOD("getVertexAttribOffset", GetVertexAttribOffset);
    JS_GL_METHOD("isBuffer", IsBuffer);
    JS_GL_METHOD("isFramebuffer", IsFramebuffer);
    JS_GL_METHOD("isProgram", IsProgram);
    JS_GL_METHOD("isRenderbuffer", IsRenderbuffer);
    JS_GL_METHOD("isShader", IsShader);
    JS_GL_METHOD("isTexture", IsTexture);
    JS_GL_METHOD("renderbufferStorage", RenderbufferStorage);
    JS_GL_METHOD("getShaderSource", GetShaderSource);
    JS_GL_METHOD("validateProgram", ValidateProgram);
    JS_GL_METHOD("texSubImage2D", TexSubImage2D);
    JS_GL_METHOD("readPixels", ReadPixels);
    JS_GL_METHOD("getTexParameter", GetTexParameter);
    JS_GL_METHOD("getActiveAttrib", GetActiveAttrib);
    JS_GL_METHOD("getActiveUniform", GetActiveUniform);
    JS_GL_METHOD("getAttachedShaders", GetAttachedShaders);
    JS_GL_METHOD("getParameter", GetParameter);
    JS_GL_METHOD("getBufferParameter", GetBufferParameter);
    JS_GL_METHOD("getFramebufferAttachmentParameter", GetFramebufferAttachmentParameter);
    JS_GL_METHOD("getProgramInfoLog", GetProgramInfoLog);
    JS_GL_METHOD("getRenderbufferParameter", GetRenderbufferParameter);
    JS_GL_METHOD("getVertexAttrib", GetVertexAttrib);
    JS_GL_METHOD("getSupportedExtensions", GetSupportedExtensions);
    JS_GL_METHOD("getExtension", GetExtension);
    JS_GL_METHOD("checkFramebufferStatus", CheckFramebufferStatus);
    JS_GL_METHOD("getShaderPrecisionFormat", GetShaderPrecisionFormat);
    JS_GL_METHOD("frontFace", FrontFace);
    JS_GL_METHOD("sampleCoverage", SampleCoverage);
    JS_GL_METHOD("destroy", Destroy);
    JS_GL_METHOD("drawBuffersWEBGL", DrawBuffersWEBGL);
    JS_GL_METHOD("extWEBGL_draw_buffers", EXTWEBGL_draw_buffers);
    JS_GL_METHOD("createVertexArrayOES", CreateVertexArrayOES);
    JS_GL_METHOD("deleteVertexArrayOES", DeleteVertexArrayOES);
    JS_GL_METHOD("isVertexArrayOES", IsVertexArrayOES);
    JS_GL_METHOD("bindVertexArrayOES", BindVertexArrayOES);

    // Windows defines a macro called NO_ERROR which messes this up
    Nan::SetPrototypeTemplate(
        webgl_template,
        "NO_ERROR",
        Nan::New<v8::Integer>(GL_NO_ERROR));
    JS_GL_CONSTANT(INVALID_ENUM);
    JS_GL_CONSTANT(INVALID_VALUE);
    JS_GL_CONSTANT(INVALID_OPERATION);
    JS_GL_CONSTANT(OUT_OF_MEMORY);

    // OpenGL ES 2.1 constants
    Nan::SetPrototypeTemplate(
        webgl_template, "DEPTH_STENCIL", Nan::New<v8::Integer>(GL_DEPTH_STENCIL_OES));

    Nan::SetPrototypeTemplate(
        webgl_template, "DEPTH_STENCIL_ATTACHMENT", Nan::New<v8::Integer>(0x821A));

    JS_GL_CONSTANT(MAX_VERTEX_UNIFORM_VECTORS);
    JS_GL_CONSTANT(MAX_VARYING_VECTORS);
    JS_GL_CONSTANT(MAX_FRAGMENT_UNIFORM_VECTORS);
    JS_GL_CONSTANT(RGB565);
    JS_GL_CONSTANT(STENCIL_INDEX8);
    JS_GL_CONSTANT(FRAMEBUFFER_INCOMPLETE_DIMENSIONS);
    JS_GL_CONSTANT(DEPTH_BUFFER_BIT);
    JS_GL_CONSTANT(STENCIL_BUFFER_BIT);
    JS_GL_CONSTANT(COLOR_BUFFER_BIT);
    JS_GL_CONSTANT(POINTS);
    JS_GL_CONSTANT(LINES);
    JS_GL_CONSTANT(LINE_LOOP);
    JS_GL_CONSTANT(LINE_STRIP);
    JS_GL_CONSTANT(TRIANGLES);
    JS_GL_CONSTANT(TRIANGLE_STRIP);
    JS_GL_CONSTANT(TRIANGLE_FAN);
    JS_GL_CONSTANT(ZERO);
    JS_GL_CONSTANT(ONE);
    JS_GL_CONSTANT(SRC_COLOR);
    JS_GL_CONSTANT(ONE_MINUS_SRC_COLOR);
    JS_GL_CONSTANT(SRC_ALPHA);
    JS_GL_CONSTANT(ONE_MINUS_SRC_ALPHA);
    JS_GL_CONSTANT(DST_ALPHA);
    JS_GL_CONSTANT(ONE_MINUS_DST_ALPHA);
    JS_GL_CONSTANT(DST_COLOR);
    JS_GL_CONSTANT(ONE_MINUS_DST_COLOR);
    JS_GL_CONSTANT(SRC_ALPHA_SATURATE);
    JS_GL_CONSTANT(FUNC_ADD);
    JS_GL_CONSTANT(BLEND_EQUATION);
    JS_GL_CONSTANT(BLEND_EQUATION_RGB);
    JS_GL_CONSTANT(BLEND_EQUATION_ALPHA);
    JS_GL_CONSTANT(FUNC_SUBTRACT);
    JS_GL_CONSTANT(FUNC_REVERSE_SUBTRACT);
    JS_GL_CONSTANT(BLEND_DST_RGB);
    JS_GL_CONSTANT(BLEND_SRC_RGB);
    JS_GL_CONSTANT(BLEND_DST_ALPHA);
    JS_GL_CONSTANT(BLEND_SRC_ALPHA);
    JS_GL_CONSTANT(CONSTANT_COLOR);
    JS_GL_CONSTANT(ONE_MINUS_CONSTANT_COLOR);
    JS_GL_CONSTANT(CONSTANT_ALPHA);
    JS_GL_CONSTANT(ONE_MINUS_CONSTANT_ALPHA);
    JS_GL_CONSTANT(BLEND_COLOR);
    JS_GL_CONSTANT(ARRAY_BUFFER);
    JS_GL_CONSTANT(ELEMENT_ARRAY_BUFFER);
    JS_GL_CONSTANT(ARRAY_BUFFER_BINDING);
    JS_GL_CONSTANT(ELEMENT_ARRAY_BUFFER_BINDING);
    JS_GL_CONSTANT(STREAM_DRAW);
    JS_GL_CONSTANT(STATIC_DRAW);
    JS_GL_CONSTANT(DYNAMIC_DRAW);
    JS_GL_CONSTANT(BUFFER_SIZE);
    JS_GL_CONSTANT(BUFFER_USAGE);
    JS_GL_CONSTANT(CURRENT_VERTEX_ATTRIB);
    JS_GL_CONSTANT(FRONT);
    JS_GL_CONSTANT(BACK);
    JS_GL_CONSTANT(FRONT_AND_BACK);
    JS_GL_CONSTANT(TEXTURE_2D);
    JS_GL_CONSTANT(CULL_FACE);
    JS_GL_CONSTANT(BLEND);
    JS_GL_CONSTANT(DITHER);
    JS_GL_CONSTANT(STENCIL_TEST);
    JS_GL_CONSTANT(DEPTH_TEST);
    JS_GL_CONSTANT(SCISSOR_TEST);
    JS_GL_CONSTANT(POLYGON_OFFSET_FILL);
    JS_GL_CONSTANT(SAMPLE_ALPHA_TO_COVERAGE);
    JS_GL_CONSTANT(SAMPLE_COVERAGE);
    JS_GL_CONSTANT(CW);
    JS_GL_CONSTANT(CCW);
    JS_GL_CONSTANT(LINE_WIDTH);
    JS_GL_CONSTANT(ALIASED_POINT_SIZE_RANGE);
    JS_GL_CONSTANT(ALIASED_LINE_WIDTH_RANGE);
    JS_GL_CONSTANT(CULL_FACE_MODE);
    JS_GL_CONSTANT(FRONT_FACE);
    JS_GL_CONSTANT(DEPTH_RANGE);
    JS_GL_CONSTANT(DEPTH_WRITEMASK);
    JS_GL_CONSTANT(DEPTH_CLEAR_VALUE);
    JS_GL_CONSTANT(DEPTH_FUNC);
    JS_GL_CONSTANT(STENCIL_CLEAR_VALUE);
    JS_GL_CONSTANT(STENCIL_FUNC);
    JS_GL_CONSTANT(STENCIL_FAIL);
    JS_GL_CONSTANT(STENCIL_PASS_DEPTH_FAIL);
    JS_GL_CONSTANT(STENCIL_PASS_DEPTH_PASS);
    JS_GL_CONSTANT(STENCIL_REF);
    JS_GL_CONSTANT(STENCIL_VALUE_MASK);
    JS_GL_CONSTANT(STENCIL_WRITEMASK);
    JS_GL_CONSTANT(STENCIL_BACK_FUNC);
    JS_GL_CONSTANT(STENCIL_BACK_FAIL);
    JS_GL_CONSTANT(STENCIL_BACK_PASS_DEPTH_FAIL);
    JS_GL_CONSTANT(STENCIL_BACK_PASS_DEPTH_PASS);
    JS_GL_CONSTANT(STENCIL_BACK_REF);
    JS_GL_CONSTANT(STENCIL_BACK_VALUE_MASK);
    JS_GL_CONSTANT(STENCIL_BACK_WRITEMASK);
    JS_GL_CONSTANT(VIEWPORT);
    JS_GL_CONSTANT(SCISSOR_BOX);
    JS_GL_CONSTANT(COLOR_CLEAR_VALUE);
    JS_GL_CONSTANT(COLOR_WRITEMASK);
    JS_GL_CONSTANT(UNPACK_ALIGNMENT);
    JS_GL_CONSTANT(PACK_ALIGNMENT);
    JS_GL_CONSTANT(MAX_TEXTURE_SIZE);
    JS_GL_CONSTANT(MAX_VIEWPORT_DIMS);
    JS_GL_CONSTANT(SUBPIXEL_BITS);
    JS_GL_CONSTANT(RED_BITS);
    JS_GL_CONSTANT(GREEN_BITS);
    JS_GL_CONSTANT(BLUE_BITS);
    JS_GL_CONSTANT(ALPHA_BITS);
    JS_GL_CONSTANT(DEPTH_BITS);
    JS_GL_CONSTANT(STENCIL_BITS);
    JS_GL_CONSTANT(POLYGON_OFFSET_UNITS);
    JS_GL_CONSTANT(POLYGON_OFFSET_FACTOR);
    JS_GL_CONSTANT(TEXTURE_BINDING_2D);
    JS_GL_CONSTANT(SAMPLE_BUFFERS);
    JS_GL_CONSTANT(SAMPLES);
    JS_GL_CONSTANT(SAMPLE_COVERAGE_VALUE);
    JS_GL_CONSTANT(SAMPLE_COVERAGE_INVERT);
    JS_GL_CONSTANT(COMPRESSED_TEXTURE_FORMATS);
    JS_GL_CONSTANT(DONT_CARE);
    JS_GL_CONSTANT(FASTEST);
    JS_GL_CONSTANT(NICEST);
    JS_GL_CONSTANT(GENERATE_MIPMAP_HINT);
    JS_GL_CONSTANT(BYTE);
    JS_GL_CONSTANT(UNSIGNED_BYTE);
    JS_GL_CONSTANT(SHORT);
    JS_GL_CONSTANT(UNSIGNED_SHORT);
    JS_GL_CONSTANT(INT);
    JS_GL_CONSTANT(UNSIGNED_INT);
    JS_GL_CONSTANT(FLOAT);
    JS_GL_CONSTANT(DEPTH_COMPONENT);
    JS_GL_CONSTANT(ALPHA);
    JS_GL_CONSTANT(RGB);
    JS_GL_CONSTANT(RGBA);
    JS_GL_CONSTANT(LUMINANCE);
    JS_GL_CONSTANT(LUMINANCE_ALPHA);
    JS_GL_CONSTANT(UNSIGNED_SHORT_4_4_4_4);
    JS_GL_CONSTANT(UNSIGNED_SHORT_5_5_5_1);
    JS_GL_CONSTANT(UNSIGNED_SHORT_5_6_5);
    JS_GL_CONSTANT(FRAGMENT_SHADER);
    JS_GL_CONSTANT(VERTEX_SHADER);
    JS_GL_CONSTANT(MAX_VERTEX_ATTRIBS);
    JS_GL_CONSTANT(MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    JS_GL_CONSTANT(MAX_VERTEX_TEXTURE_IMAGE_UNITS);
    JS_GL_CONSTANT(MAX_TEXTURE_IMAGE_UNITS);
    JS_GL_CONSTANT(SHADER_TYPE);
    JS_GL_CONSTANT(DELETE_STATUS);
    JS_GL_CONSTANT(LINK_STATUS);
    JS_GL_CONSTANT(VALIDATE_STATUS);
    JS_GL_CONSTANT(ATTACHED_SHADERS);
    JS_GL_CONSTANT(ACTIVE_UNIFORMS);
    JS_GL_CONSTANT(ACTIVE_ATTRIBUTES);
    JS_GL_CONSTANT(SHADING_LANGUAGE_VERSION);
    JS_GL_CONSTANT(CURRENT_PROGRAM);
    JS_GL_CONSTANT(NEVER);
    JS_GL_CONSTANT(LESS);
    JS_GL_CONSTANT(EQUAL);
    JS_GL_CONSTANT(LEQUAL);
    JS_GL_CONSTANT(GREATER);
    JS_GL_CONSTANT(NOTEQUAL);
    JS_GL_CONSTANT(GEQUAL);
    JS_GL_CONSTANT(ALWAYS);
    JS_GL_CONSTANT(KEEP);
    JS_GL_CONSTANT(REPLACE);
    JS_GL_CONSTANT(INCR);
    JS_GL_CONSTANT(DECR);
    JS_GL_CONSTANT(INVERT);
    JS_GL_CONSTANT(INCR_WRAP);
    JS_GL_CONSTANT(DECR_WRAP);
    JS_GL_CONSTANT(VENDOR);
    JS_GL_CONSTANT(RENDERER);
    JS_GL_CONSTANT(NEAREST);
    JS_GL_CONSTANT(LINEAR);
    JS_GL_CONSTANT(NEAREST_MIPMAP_NEAREST);
    JS_GL_CONSTANT(LINEAR_MIPMAP_NEAREST);
    JS_GL_CONSTANT(NEAREST_MIPMAP_LINEAR);
    JS_GL_CONSTANT(LINEAR_MIPMAP_LINEAR);
    JS_GL_CONSTANT(TEXTURE_MAG_FILTER);
    JS_GL_CONSTANT(TEXTURE_MIN_FILTER);
    JS_GL_CONSTANT(TEXTURE_WRAP_S);
    JS_GL_CONSTANT(TEXTURE_WRAP_T);
    JS_GL_CONSTANT(TEXTURE);
    JS_GL_CONSTANT(TEXTURE_CUBE_MAP);
    JS_GL_CONSTANT(TEXTURE_BINDING_CUBE_MAP);
    JS_GL_CONSTANT(TEXTURE_CUBE_MAP_POSITIVE_X);
    JS_GL_CONSTANT(TEXTURE_CUBE_MAP_NEGATIVE_X);
    JS_GL_CONSTANT(TEXTURE_CUBE_MAP_POSITIVE_Y);
    JS_GL_CONSTANT(TEXTURE_CUBE_MAP_NEGATIVE_Y);
    JS_GL_CONSTANT(TEXTURE_CUBE_MAP_POSITIVE_Z);
    JS_GL_CONSTANT(TEXTURE_CUBE_MAP_NEGATIVE_Z);
    JS_GL_CONSTANT(MAX_CUBE_MAP_TEXTURE_SIZE);
    JS_GL_CONSTANT(TEXTURE0);
    JS_GL_CONSTANT(TEXTURE1);
    JS_GL_CONSTANT(TEXTURE2);
    JS_GL_CONSTANT(TEXTURE3);
    JS_GL_CONSTANT(TEXTURE4);
    JS_GL_CONSTANT(TEXTURE5);
    JS_GL_CONSTANT(TEXTURE6);
    JS_GL_CONSTANT(TEXTURE7);
    JS_GL_CONSTANT(TEXTURE8);
    JS_GL_CONSTANT(TEXTURE9);
    JS_GL_CONSTANT(TEXTURE10);
    JS_GL_CONSTANT(TEXTURE11);
    JS_GL_CONSTANT(TEXTURE12);
    JS_GL_CONSTANT(TEXTURE13);
    JS_GL_CONSTANT(TEXTURE14);
    JS_GL_CONSTANT(TEXTURE15);
    JS_GL_CONSTANT(TEXTURE16);
    JS_GL_CONSTANT(TEXTURE17);
    JS_GL_CONSTANT(TEXTURE18);
    JS_GL_CONSTANT(TEXTURE19);
    JS_GL_CONSTANT(TEXTURE20);
    JS_GL_CONSTANT(TEXTURE21);
    JS_GL_CONSTANT(TEXTURE22);
    JS_GL_CONSTANT(TEXTURE23);
    JS_GL_CONSTANT(TEXTURE24);
    JS_GL_CONSTANT(TEXTURE25);
    JS_GL_CONSTANT(TEXTURE26);
    JS_GL_CONSTANT(TEXTURE27);
    JS_GL_CONSTANT(TEXTURE28);
    JS_GL_CONSTANT(TEXTURE29);
    JS_GL_CONSTANT(TEXTURE30);
    JS_GL_CONSTANT(TEXTURE31);
    JS_GL_CONSTANT(ACTIVE_TEXTURE);
    JS_GL_CONSTANT(REPEAT);
    JS_GL_CONSTANT(CLAMP_TO_EDGE);
    JS_GL_CONSTANT(MIRRORED_REPEAT);
    JS_GL_CONSTANT(FLOAT_VEC2);
    JS_GL_CONSTANT(FLOAT_VEC3);
    JS_GL_CONSTANT(FLOAT_VEC4);
    JS_GL_CONSTANT(INT_VEC2);
    JS_GL_CONSTANT(INT_VEC3);
    JS_GL_CONSTANT(INT_VEC4);
    JS_GL_CONSTANT(BOOL);
    JS_GL_CONSTANT(BOOL_VEC2);
    JS_GL_CONSTANT(BOOL_VEC3);
    JS_GL_CONSTANT(BOOL_VEC4);
    JS_GL_CONSTANT(FLOAT_MAT2);
    JS_GL_CONSTANT(FLOAT_MAT3);
    JS_GL_CONSTANT(FLOAT_MAT4);
    JS_GL_CONSTANT(SAMPLER_2D);
    JS_GL_CONSTANT(SAMPLER_CUBE);
    JS_GL_CONSTANT(VERTEX_ATTRIB_ARRAY_ENABLED);
    JS_GL_CONSTANT(VERTEX_ATTRIB_ARRAY_SIZE);
    JS_GL_CONSTANT(VERTEX_ATTRIB_ARRAY_STRIDE);
    JS_GL_CONSTANT(VERTEX_ATTRIB_ARRAY_TYPE);
    JS_GL_CONSTANT(VERTEX_ATTRIB_ARRAY_NORMALIZED);
    JS_GL_CONSTANT(VERTEX_ATTRIB_ARRAY_POINTER);
    JS_GL_CONSTANT(VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
    JS_GL_CONSTANT(COMPILE_STATUS);
    JS_GL_CONSTANT(LOW_FLOAT);
    JS_GL_CONSTANT(MEDIUM_FLOAT);
    JS_GL_CONSTANT(HIGH_FLOAT);
    JS_GL_CONSTANT(LOW_INT);
    JS_GL_CONSTANT(MEDIUM_INT);
    JS_GL_CONSTANT(HIGH_INT);
    JS_GL_CONSTANT(FRAMEBUFFER);
    JS_GL_CONSTANT(RENDERBUFFER);
    JS_GL_CONSTANT(RGBA4);
    JS_GL_CONSTANT(RGB5_A1);
    JS_GL_CONSTANT(DEPTH_COMPONENT16);
    JS_GL_CONSTANT(RENDERBUFFER_WIDTH);
    JS_GL_CONSTANT(RENDERBUFFER_HEIGHT);
    JS_GL_CONSTANT(RENDERBUFFER_INTERNAL_FORMAT);
    JS_GL_CONSTANT(RENDERBUFFER_RED_SIZE);
    JS_GL_CONSTANT(RENDERBUFFER_GREEN_SIZE);
    JS_GL_CONSTANT(RENDERBUFFER_BLUE_SIZE);
    JS_GL_CONSTANT(RENDERBUFFER_ALPHA_SIZE);
    JS_GL_CONSTANT(RENDERBUFFER_DEPTH_SIZE);
    JS_GL_CONSTANT(RENDERBUFFER_STENCIL_SIZE);
    JS_GL_CONSTANT(FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE);
    JS_GL_CONSTANT(FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);
    JS_GL_CONSTANT(FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL);
    JS_GL_CONSTANT(FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE);
    JS_GL_CONSTANT(COLOR_ATTACHMENT0);
    JS_GL_CONSTANT(DEPTH_ATTACHMENT);
    JS_GL_CONSTANT(STENCIL_ATTACHMENT);
    JS_GL_CONSTANT(NONE);
    JS_GL_CONSTANT(FRAMEBUFFER_COMPLETE);
    JS_GL_CONSTANT(FRAMEBUFFER_INCOMPLETE_ATTACHMENT);
    JS_GL_CONSTANT(FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT);
    JS_GL_CONSTANT(FRAMEBUFFER_UNSUPPORTED);
    JS_GL_CONSTANT(FRAMEBUFFER_BINDING);
    JS_GL_CONSTANT(RENDERBUFFER_BINDING);
    JS_GL_CONSTANT(MAX_RENDERBUFFER_SIZE);
    JS_GL_CONSTANT(INVALID_FRAMEBUFFER_OPERATION);

    /* WebGL-specific enums */
    JS_CONSTANT(STENCIL_INDEX, 0x1901);
    JS_CONSTANT(UNPACK_FLIP_Y_WEBGL, 0x9240);
    JS_CONSTANT(UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0x9241);
    JS_CONSTANT(CONTEXT_LOST_WEBGL, 0x9242);
    JS_CONSTANT(UNPACK_COLORSPACE_CONVERSION_WEBGL, 0x9243);
    JS_CONSTANT(BROWSER_DEFAULT_WEBGL, 0x9244);
    JS_CONSTANT(VERSION, 0x1F02);
    JS_CONSTANT(IMPLEMENTATION_COLOR_READ_TYPE, 0x8B9A);
    JS_CONSTANT(IMPLEMENTATION_COLOR_READ_FORMAT, 0x8B9B);

    // Export template
    WEBGL_TEMPLATE.Reset(webgl_template);
    Nan::Set(
        target, Nan::New<v8::String>("WebGLRenderingContext").ToLocalChecked(), Nan::GetFunction(webgl_template).ToLocalChecked());

    // Export helper methods for clean up and error handling
    Nan::Export(target, "cleanup", WebGLRenderingContext::DisposeAll);
    Nan::Export(target, "setError", WebGLRenderingContext::SetError);
}

NODE_MODULE(webgl, Init)
