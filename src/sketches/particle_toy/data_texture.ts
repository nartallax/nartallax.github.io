export const particlesCount = 128000
export const dataTextureSize = 2 ** Math.ceil(Math.log2(Math.ceil(Math.sqrt(particlesCount))))

function createDataTexture(gl: WebGL2RenderingContext, data: Uint32Array): WebGLTexture {
	const tex = gl.createTexture()
	if(!tex){
		throw new Error("No texture was created")
	}
	gl.bindTexture(gl.TEXTURE_2D, tex)
	gl.texImage2D(
		gl.TEXTURE_2D,
		0, // mip level
		gl.R32UI, // internal format
		dataTextureSize, // width
		dataTextureSize, // height
		0, // border
		gl.RED_INTEGER, // format
		gl.UNSIGNED_INT, // type
		data,
		0
	)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
	return tex
}

function createFramebuffer(gl: WebGL2RenderingContext, tex: WebGLTexture): WebGLFramebuffer {
	const fb = gl.createFramebuffer()
	if(!fb){
		throw new Error("Cannot create webgl framebuffer")
	}
	gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
	return fb
}

export class DataTexture {

	private readonly _texture: WebGLTexture

	constructor(gl: WebGL2RenderingContext, data: Uint32Array) {
		this._texture = createDataTexture(gl, data)
	}

	get texture(): WebGLTexture {
		return this._texture
	}

	get inputTexture(): WebGLTexture {
		return this._texture
	}

}

export class DataTexturePair {
	private readonly a: WebGLTexture
	private readonly b: WebGLTexture
	private aIsActive = true

	constructor(gl: WebGL2RenderingContext, data: Uint32Array) {
		this.a = createDataTexture(gl, data)
		this.b = createDataTexture(gl, data)
	}

	get texture(): WebGLTexture {
		return this.aIsActive ? this.a : this.b
	}

	get inputTexture(): WebGLTexture {
		return this.aIsActive ? this.b : this.a
	}

	swap(): void {
		this.aIsActive = !this.aIsActive
	}
}

export class FrameBufferTexturePair {
	private readonly _textureA: WebGLTexture
	private readonly _textureB: WebGLTexture
	private readonly _framebufferA: WebGLFramebuffer
	private readonly _framebufferB: WebGLFramebuffer
	private activeA = true

	constructor(private readonly gl: WebGL2RenderingContext, data: Uint32Array) {
		this._textureA = createDataTexture(gl, data)
		this._textureB = createDataTexture(gl, data)
		this._framebufferA = createFramebuffer(gl, this._textureA)
		this._framebufferB = createFramebuffer(gl, this._textureB)
	}

	get texture(): WebGLTexture {
		return this.activeA ? this._textureA : this._textureB
	}

	get framebuffer(): WebGLFramebuffer {
		// inverted logic here - if A is active, then we cannot write into A
		return this.activeA ? this._framebufferB : this._framebufferA
	}

	swap(): void {
		this.activeA = !this.activeA
	}

	withFramebufferActive<T>(action: () => T): T {
		try {
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)
			return action()
		} finally {
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
		}
	}

}