export type Uniform = ReturnType<WebGL2RenderingContext["getUniformLocation"]>
export type Attrib = ReturnType<WebGL2RenderingContext["getAttribLocation"]>

// assorted utility functions for webgl
export namespace GlUtils {

	export function getGlContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
		const gl = canvas.getContext("webgl2")
		if(!gl){
			throw new Error("No webgl2 available.")
		}
		gl.enable(gl.BLEND)
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
		gl.disable(gl.SCISSOR_TEST) // can be good, need further investigation
		gl.disable(gl.CULL_FACE)
		gl.disable(gl.DEPTH_TEST)
		gl.disable(gl.POLYGON_OFFSET_FILL)
		gl.disable(gl.STENCIL_TEST)
		return gl
	}

	export function makeShader(gl: WebGL2RenderingContext, type: "vertex" | "fragment", code: string): WebGLShader {
		let shader: WebGLShader | null = null
		try {
			shader = gl.createShader(type === "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER)
			if(!shader){
				throw new Error("No shader is created of type " + type)
			}
			gl.shaderSource(shader, code)
			gl.compileShader(shader)

			const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
			const log = gl.getShaderInfoLog(shader)
			if(!success){
				console.log(code)
				throw new Error("Failed to compile shader of type " + type + ": " + log)
			} else if(log){
				console.warn("WebGL " + type + " shader compile log: ", log)
			}

			return shader
		} catch(e){
			gl.deleteShader(shader)
			throw e
		}
	}

	export function makeProgram(gl: WebGL2RenderingContext, vertexShaderCode: string, fragmentShaderCode: string): {program: WebGLProgram, shaders: WebGLShader[]} {
		let fragShader: WebGLShader | null = null
		let vertShader: WebGLShader | null = null
		let program: WebGLProgram | null = null
		try {
			fragShader = makeShader(gl, "fragment", fragmentShaderCode)
			vertShader = makeShader(gl, "vertex", vertexShaderCode)
			program = gl.createProgram()
			if(!program){
				throw new Error("No webgl program was created.")
			}

			gl.attachShader(program, fragShader)
			gl.attachShader(program, vertShader)
			gl.linkProgram(program)

			const success = gl.getProgramParameter(program, gl.LINK_STATUS)
			const log = gl.getProgramInfoLog(program)
			if(!success){
				throw new Error("Failed to link program: " + log)
			} else if(log){
				console.warn("WebGL program log: ", log)
			}

			return {program, shaders: [fragShader, vertShader]}
		} catch(e){
			fragShader && gl.deleteShader(fragShader)
			vertShader && gl.deleteShader(vertShader)
			program && gl.deleteProgram(program)
			throw e
		}
	}

	export function setViewportSizeByCanvas(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement): {width: number, height: number} {
		const width = canvas.clientWidth * window.devicePixelRatio
		const height = canvas.clientHeight * window.devicePixelRatio
		// why do we need this...? is this a lost useless part of some extremely outdated tutorial?
		canvas.width = width
		canvas.height = height
		gl.viewport(0, 0, width, height)
		return {width, height}
	}

	export function loadTexture(gl: WebGL2RenderingContext, url: string): Promise<WebGLTexture> {
		return new Promise((ok, bad) => {
			const img = new Image()
			img.onload = () => {
				try {
					const tex = makeBindSetupTexture(gl)
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
					gl.generateMipmap(gl.TEXTURE_2D)
					ok(tex)
				} catch(e){
					bad(e)
				}
			}
			img.onerror = () => bad(new Error("Failed to load texture: " + url))
			img.src = url
		})
	}

	function makeBindSetupTexture(gl: WebGL2RenderingContext): WebGLTexture {
		const tex = gl.createTexture()
		if(!tex){
			throw new Error("No texture was created.")
		}
		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, tex)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
		return tex
	}

	const squareVertexData: readonly number[] = [0, 0, 1, 0, 1, 1, 0, 1]
	const squareIndexData: readonly number[] = [0, 1, 2, 0, 2, 3]

	/** Make vertex buffer that contains 2d coordinates for a square with side length = 1 */
	export function makeSquareVertexBuffer(gl: WebGL2RenderingContext): WebGLBuffer {
		const buffer = makeBindBuffer(gl, gl.ARRAY_BUFFER)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVertexData), gl.STATIC_DRAW)
		return buffer
	}

	/** Make corresponding index buffer for vertex from `makeSquareVertexBuffer()` */
	export function makeSquareIndexBuffer(gl: WebGL2RenderingContext): WebGLBuffer {
		const buffer = makeBindBuffer(gl, gl.ELEMENT_ARRAY_BUFFER)
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(squareIndexData), gl.STATIC_DRAW)
		return buffer
	}

	export function makeBindBuffer(gl: WebGL2RenderingContext, target: GLenum): WebGLBuffer {
		const buf = gl.createBuffer()
		if(!buf){
			throw new Error("Buffer was not created.")
		}
		gl.bindBuffer(target, buf)
		return buf
	}

	export function makeBindVAO(gl: WebGL2RenderingContext): WebGLVertexArrayObject {
		const vao = gl.createVertexArray()
		if(!vao){
			throw new Error("VAO was not created.")
		}
		gl.bindVertexArray(vao)
		return vao
	}

}