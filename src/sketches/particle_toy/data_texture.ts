export const particlesCount = 128000
export const dataTextureSize = 2 ** Math.ceil(Math.log2(Math.ceil(Math.sqrt(particlesCount))))

export const speedRange = 5000
export const angleRange = 3600

export function encodeFloat(value: number, range: number): number {
	return Math.floor((value / range) * 0x7fffffff) + 0x7fffffff
}

function createDataTexture(gl: WebGL2RenderingContext, data: Uint32Array, size: {x: number, y: number}): WebGLTexture {
	const tex = gl.createTexture()
	if(!tex){
		throw new Error("No texture was created")
	}
	uploadTextureData(gl, tex, data, size)
	return tex
}

function uploadTextureData(gl: WebGL2RenderingContext, tex: WebGLTexture, data: Uint32Array, size: {x: number, y: number}): void {
	gl.bindTexture(gl.TEXTURE_2D, tex)
	gl.texImage2D(
		gl.TEXTURE_2D,
		0, // mip level
		gl.R32UI, // internal format
		size.x, // width
		size.y, // height
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
}

export type DataTexture = DataTextureSingle | DataTexturePair

export class DataTextureSingle {

	private readonly _texture: WebGLTexture

	constructor(gl: WebGL2RenderingContext, data: Uint32Array, private readonly size: {x: number, y: number} = {x: dataTextureSize, y: dataTextureSize}) {
		this._texture = createDataTexture(gl, data, size)
	}

	get texture(): WebGLTexture {
		return this._texture
	}

	get receivingTexture(): WebGLTexture {
		return this._texture
	}

	upload(gl: WebGL2RenderingContext, data: Uint32Array): void {
		uploadTextureData(gl, this.texture, data, this.size)
	}

}

export class DataTexturePair {
	private readonly a: WebGLTexture
	private readonly b: WebGLTexture
	private aIsActive = true

	constructor(gl: WebGL2RenderingContext, data: Uint32Array, size: {x: number, y: number} = {x: dataTextureSize, y: dataTextureSize}) {
		this.a = createDataTexture(gl, data, size)
		this.b = createDataTexture(gl, data, size)
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