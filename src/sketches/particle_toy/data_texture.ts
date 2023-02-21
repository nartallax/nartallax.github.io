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

export type DataTexture = DataTextureSingle | DataTexturePair

export class DataTextureSingle {

	private readonly _texture: WebGLTexture

	constructor(gl: WebGL2RenderingContext, data: Uint32Array) {
		this._texture = createDataTexture(gl, data)
	}

	get texture(): WebGLTexture {
		return this._texture
	}

	get receivingTexture(): WebGLTexture {
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

	get receivingTexture(): WebGLTexture {
		return this.aIsActive ? this.b : this.a
	}

	swap(): void {
		this.aIsActive = !this.aIsActive
	}
}