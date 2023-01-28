import {cycledRequestAnimationFrame} from "common/cycled_request_animation_frame"
import {GlUtils} from "common/gl_utils"
import {dataTextureSize, FrameBufferTexturePair, particlesCount} from "sketches/particle_toy/data_texture"
import {FpsCounter} from "sketches/particle_toy/fps_counter"
import {CalcPosShader, CalcSpeedShader, DrawShader} from "sketches/particle_toy/shader"

// const coordsScale = {x: 0xffff / rootSize.width, y: 0xffff / rootSize.height}
function packSignedCoordsPair(range: {x: number, y: number}, x: number, y: number): number {
	return (((x * (0xffff / range.x)) + 0x8fff) & 0xffff) | ((((y * (0xffff / range.y)) + 0x8fff) & 0xffff) << 0x10)
}

function packCoordsPair(range: {x: number, y: number}, x: number, y: number): number {
	return ((x * (0xffff / range.x)) & 0xffff) | (((y * (0xffff / range.y)) & 0xffff) << 0x10)
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
	const positionTexture = new FrameBufferTexturePair(gl, makeDataArray(i => packCoordsPair(coordsRange, i * 10, i * 20)))
	const speedTexture = new FrameBufferTexturePair(gl, makeDataArray(() => packSignedCoordsPair(
		{x: 0x8fff, y: 0x8fff},
		(Math.random() - 0.5) * 100,
		(Math.random() - 0.5) * 100)
	))

	const calcSpeedShader = new CalcSpeedShader(gl)
	const calcPosShader = new CalcPosShader(gl)
	const drawShader = new DrawShader(gl)

	calcSpeedShader.use()
	gl.uniform2f(calcSpeedShader.screenSize, rootSize.width, rootSize.height)
	gl.uniform1i(calcSpeedShader.position, 0)
	gl.uniform1i(calcSpeedShader.speed, 1)
	gl.uniform1f(calcSpeedShader.gravity, 50)
	const calcSpeedVao = GlUtils.makeBindVAO(gl)
	gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer)
	gl.enableVertexAttribArray(calcSpeedShader.vertex)
	gl.vertexAttribPointer(calcSpeedShader.vertex, 2, gl.FLOAT, false, 0, 0)

	calcPosShader.use()
	gl.uniform2f(calcPosShader.screenSize, rootSize.width, rootSize.height)
	gl.uniform1i(calcPosShader.position, 0)
	gl.uniform1i(calcPosShader.speed, 1)
	const calcPosVao = GlUtils.makeBindVAO(gl)
	gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer)
	gl.enableVertexAttribArray(calcPosShader.vertex)
	gl.vertexAttribPointer(calcPosShader.vertex, 2, gl.FLOAT, false, 0, 0)

	drawShader.use()
	gl.uniform2f(drawShader.screenSize, rootSize.width, rootSize.height)
	gl.uniform1i(drawShader.position, 0)
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

		// calc speed step
		speedTexture.withFramebufferActive(() => {
			calcSpeedShader.use()
			gl.viewport(0, 0, dataTextureSize, dataTextureSize)
			gl.uniform1f(calcSpeedShader.deltaTime, deltaTime)

			gl.activeTexture(gl.TEXTURE0)
			gl.bindTexture(gl.TEXTURE_2D, positionTexture.texture)
			gl.activeTexture(gl.TEXTURE1)
			gl.bindTexture(gl.TEXTURE_2D, speedTexture.texture)

			gl.bindVertexArray(calcSpeedVao)
			gl.drawArrays(gl.TRIANGLES, 0, 6)
		})
		speedTexture.swap()

		// calc pos step
		positionTexture.withFramebufferActive(() => {
			calcPosShader.use()
			gl.viewport(0, 0, dataTextureSize, dataTextureSize)
			gl.uniform1f(calcPosShader.deltaTime, deltaTime)
			gl.uniform1ui(calcPosShader.firstMovedParticleIndex, firstMovedParticleIndex)
			gl.uniform1ui(calcPosShader.lastMovedParticleIndex, lastMovedParticleIndex)

			gl.activeTexture(gl.TEXTURE0)
			gl.bindTexture(gl.TEXTURE_2D, positionTexture.texture)
			gl.activeTexture(gl.TEXTURE1)
			gl.bindTexture(gl.TEXTURE_2D, speedTexture.texture)

			gl.bindVertexArray(calcPosVao)
			gl.drawArrays(gl.TRIANGLES, 0, 6)
		})
		positionTexture.swap()

		// draw step
		drawShader.use()
		gl.bindFramebuffer(gl.FRAMEBUFFER, null)
		gl.viewport(0, 0, rootSize.width, rootSize.height)

		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, positionTexture.texture)

		gl.bindVertexArray(drawVao)
		gl.drawArrays(gl.POINTS, 0, particlesCount)
	}

	cycledRequestAnimationFrame(deltaTime => {
		if(deltaTime > 50){
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