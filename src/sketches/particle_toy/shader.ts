import glslUtils from "./shaders/utils.glsl"
import drawFragmentShaderCode from "./shaders/draw_fragment.glsl"
import drawVertexShaderCode from "./shaders/draw_vertex.glsl"
import dataVertexShaderCode from "./shaders/data_vertex.glsl"
import dataFragmentShaderCode from "./shaders/data_fragment.glsl"
import {GlUtils} from "common/gl_utils"
import {dataTextureSize} from "sketches/particle_toy/data_texture"

function addUtils(code: string): string {
	return `#version 300 es\n#define DATA_TEXTURE_SIZE ${dataTextureSize}.0\n` + glslUtils + "\n" + code
}

export abstract class Shader {

	protected readonly program: WebGLProgram
	protected readonly shaders: readonly WebGLShader[]

	constructor(protected readonly gl: WebGL2RenderingContext, vertexCode: string, fragmentCode: string) {
		const {program, shaders} = GlUtils.makeProgram(gl,
			addUtils(vertexCode),
			addUtils(fragmentCode)
		)
		this.program = program
		this.shaders = shaders
	}

	use(): void {
		this.gl.useProgram(this.program)
	}

	delete(): void {
		this.gl.deleteProgram(this.program)
		for(const shader of this.shaders){
			this.gl.deleteShader(shader)
		}
	}

}

type Attrib = number
type Uniform = WebGLUniformLocation | null

export class DrawShader extends Shader {

	readonly positionX: Uniform
	readonly positionY: Uniform
	readonly id: Attrib
	readonly screenSize: Uniform

	constructor(gl: WebGL2RenderingContext) {
		super(gl, drawVertexShaderCode, drawFragmentShaderCode)
		this.positionX = gl.getUniformLocation(this.program, "positionX")
		this.positionY = gl.getUniformLocation(this.program, "positionY")
		this.id = gl.getAttribLocation(this.program, "id")
		this.screenSize = gl.getUniformLocation(this.program, "screenSize")
	}
}

export class DataShader extends Shader {

	// textures
	readonly positionX: Uniform
	readonly positionY: Uniform
	readonly speedX: Uniform
	readonly speedY: Uniform

	// uniforms
	readonly screenSize: Uniform
	readonly deltaTime: Uniform
	readonly gravity: Uniform
	readonly bounce: Uniform
	readonly firstMovedParticleIndex: Uniform
	readonly lastMovedParticleIndex: Uniform
	readonly sprayX: Uniform
	readonly sprayY: Uniform
	readonly sprayDirection: Uniform
	readonly sprayPower: Uniform
	readonly spraySpread: Uniform
	readonly sprayIntensity: Uniform

	// attribs
	readonly vertex: Attrib

	constructor(gl: WebGL2RenderingContext) {
		super(gl, dataVertexShaderCode, dataFragmentShaderCode)
		this.screenSize = gl.getUniformLocation(this.program, "screenSize")
		this.positionX = gl.getUniformLocation(this.program, "positionX")
		this.positionY = gl.getUniformLocation(this.program, "positionY")
		this.speedX = gl.getUniformLocation(this.program, "speedX")
		this.speedY = gl.getUniformLocation(this.program, "speedY")
		this.deltaTime = gl.getUniformLocation(this.program, "deltaTime")
		this.vertex = gl.getAttribLocation(this.program, "vertex")
		this.firstMovedParticleIndex = gl.getUniformLocation(this.program, "firstMovedParticleIndex")
		this.lastMovedParticleIndex = gl.getUniformLocation(this.program, "lastMovedParticleIndex")
		this.gravity = gl.getUniformLocation(this.program, "gravity")
		this.bounce = gl.getUniformLocation(this.program, "bounce")
		this.sprayX = gl.getUniformLocation(this.program, "sprayX")
		this.sprayY = gl.getUniformLocation(this.program, "sprayY")
		this.sprayDirection = gl.getUniformLocation(this.program, "sprayDirection")
		this.sprayPower = gl.getUniformLocation(this.program, "sprayPower")
		this.spraySpread = gl.getUniformLocation(this.program, "spraySpread")
		this.sprayIntensity = gl.getUniformLocation(this.program, "sprayIntensity")
	}

}