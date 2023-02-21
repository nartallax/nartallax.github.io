import {cycledRequestAnimationFrame} from "common/cycled_request_animation_frame"
import {GlUtils} from "common/gl_utils"
import {DataTexture, DataTexturePair, dataTextureSize, particlesCount} from "sketches/particle_toy/data_texture"
import {FpsCounter} from "sketches/particle_toy/fps_counter"
import {DataShader, DrawShader} from "sketches/particle_toy/shader"

// reading:
// https://webglfundamentals.org/webgl/lessons/webgl-gpgpu.html
// https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_draw_buffers

const speedRange = 5000

function withFramebuffer<T>(gl: WebGL2RenderingContext, action: () => T): T {
	try {
		const fb = gl.createFramebuffer()
		gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
		return action()
	} finally {
		gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	}
}

function bindTexturesToOutputBuffers(gl: WebGL2RenderingContext, textures: DataTexture[]): void {
	const drawBuffersInput: number[] = []
	for(let i = 0; i < textures.length; i++){
		const texture = textures[i]!
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, texture.receivingTexture, 0)
		drawBuffersInput.push(gl.COLOR_ATTACHMENT0 + i)
	}
	gl.drawBuffers(drawBuffersInput)
}

function bindTexturesToInputBuffers(gl: WebGL2RenderingContext, textures: DataTexture[]): void {
	for(let i = 0; i < textures.length; i++){
		const texture = textures[i]!
		gl.activeTexture(gl.TEXTURE0 + i)
		gl.bindTexture(gl.TEXTURE_2D, texture.texture)
	}
}

function encodeFloat(value: number, range: number): number {
	return Math.floor((value / range) * 0x7fffffff) + 0x7fffffff
}

export function main(root: HTMLElement): void {
	const canvas = document.createElement("canvas")
	// TODO: handle resize
	const rootSize = root.getBoundingClientRect()
	canvas.setAttribute("width", rootSize.width + "")
	canvas.setAttribute("height", rootSize.height + "")
	canvas.style.cssText = "position: absolute; top: 0; bottom: 0; left: 0; right: 0;"
	root.appendChild(canvas)

	const gl = canvas.getContext("webgl2")!
	// TODO: check caps and presence of context

	const idBuffer = makeIdBuffer(gl, particlesCount)
	const squareBuffer = makeSquareBuffer(gl)
	const coordsRange = {x: rootSize.width, y: rootSize.height}
	const positionXTexture = new DataTexturePair(gl, makeDataArray(() => encodeFloat(Math.random() * coordsRange.x, coordsRange.x)))
	const positionYTexture = new DataTexturePair(gl, makeDataArray(() => encodeFloat(Math.random() * coordsRange.y, coordsRange.y)))
	const speedXTexture = new DataTexturePair(gl, makeDataArray(() => encodeFloat((Math.random() - 0.5) * 100, speedRange)))
	const speedYTexture = new DataTexturePair(gl, makeDataArray(() => encodeFloat((Math.random() - 0.5) * 100, speedRange)))

	const dataShader = new DataShader(gl)
	const drawShader = new DrawShader(gl)

	const dataTextures = [positionXTexture, positionYTexture, speedXTexture, speedYTexture]
	dataShader.use()
	gl.uniform2f(dataShader.screenSize, coordsRange.x, coordsRange.y)
	gl.uniform1i(dataShader.positionX, 0)
	gl.uniform1i(dataShader.positionY, 1)
	gl.uniform1i(dataShader.speedX, 2)
	gl.uniform1i(dataShader.speedY, 3)
	gl.uniform1f(dataShader.gravity, 9.8)
	const dataShaderVao = GlUtils.makeBindVAO(gl)
	gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer)
	gl.enableVertexAttribArray(dataShader.vertex)
	gl.vertexAttribPointer(dataShader.vertex, 2, gl.FLOAT, false, 0, 0)

	const drawTextures = [positionXTexture, positionYTexture]
	drawShader.use()
	gl.uniform2f(drawShader.screenSize, coordsRange.x, coordsRange.y)
	gl.uniform1i(drawShader.positionX, 0)
	gl.uniform1i(drawShader.positionY, 1)
	const drawVao = GlUtils.makeBindVAO(gl)
	gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer)
	gl.enableVertexAttribArray(drawShader.id)
	gl.vertexAttribIPointer(drawShader.id, 1, gl.UNSIGNED_INT, 0, 0)

	let particleMovementPointer = 0
	const particlesMovedPerSecond = particlesCount / 10

	const fpsCounter = new FpsCounter()
	function drawFrame(deltaTime: number): void {
		fpsCounter.recordFrame(deltaTime)

		const firstMovedParticleIndex = particleMovementPointer
		const lastMovedParticleIndex = firstMovedParticleIndex + Math.floor(particlesMovedPerSecond * deltaTime)
		particleMovementPointer = lastMovedParticleIndex
		if(particleMovementPointer >= particlesCount){
			particleMovementPointer = 0
		}

		// data calc step
		withFramebuffer(gl, () => {
			dataShader.use()
			gl.viewport(0, 0, dataTextureSize, dataTextureSize)
			gl.uniform1f(dataShader.deltaTime, deltaTime)
			gl.uniform1ui(dataShader.firstMovedParticleIndex, firstMovedParticleIndex)
			gl.uniform1ui(dataShader.lastMovedParticleIndex, lastMovedParticleIndex)

			bindTexturesToInputBuffers(gl, dataTextures)
			bindTexturesToOutputBuffers(gl, dataTextures)

			gl.bindVertexArray(dataShaderVao)
			gl.drawArrays(gl.TRIANGLES, 0, 6)
		})

		for(const tex of dataTextures){
			tex.swap()
		}

		// draw step
		drawShader.use()
		gl.bindFramebuffer(gl.FRAMEBUFFER, null)
		gl.viewport(0, 0, rootSize.width, rootSize.height)

		bindTexturesToInputBuffers(gl, drawTextures)

		gl.bindVertexArray(drawVao)
		gl.drawArrays(gl.POINTS, 0, particlesCount)
	}

	cycledRequestAnimationFrame(deltaTime => {
		if(deltaTime > 250){
			return
		}

		drawFrame(deltaTime / 1000)
	})
}

function makeDataArray(getValue: (index: number) => number): Uint32Array {
	const data = new Array(dataTextureSize * dataTextureSize).fill(0).map((_, i) => getValue(i))
	return new Uint32Array(data)
}

function makeIdBuffer(gl: WebGL2RenderingContext, count: number): WebGLBuffer {
	const ids = new Array(count).fill(0).map((_, i) => i)
	const idBuffer = gl.createBuffer()
	if(!idBuffer){
		throw new Error("Cannot create webgl buffer")
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Uint32Array(ids), gl.STATIC_DRAW)
	return idBuffer
}

function makeSquareBuffer(gl: WebGL2RenderingContext): WebGLBuffer {
	const squareBuffer = gl.createBuffer()
	if(!squareBuffer){
		throw new Error("Cannot create webgl buffer")
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
	return squareBuffer
}