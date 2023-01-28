import glslUtils from "./shaders/utils.glsl"
import drawFragmentShaderCode from "./shaders/draw_fragment.glsl"
import drawVertexShaderCode from "./shaders/draw_vertex.glsl"
import calcPosVertexShaderCode from "./shaders/calc_pos_vertex.glsl"
import calcPosFragmentShaderCode from "./shaders/calc_pos_fragment.glsl"
import calcSpeedVertexShaderCode from "./shaders/calc_speed_vertex.glsl"
import calcSpeedFragmentShaderCode from "./shaders/calc_speed_fragment.glsl"
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

	readonly position: Uniform
	readonly id: Attrib
	readonly screenSize: Uniform

	constructor(gl: WebGL2RenderingContext) {
		super(gl, drawVertexShaderCode, drawFragmentShaderCode)
		this.position = gl.getUniformLocation(this.program, "position")
		this.id = gl.getAttribLocation(this.program, "id")
		this.screenSize = gl.getUniformLocation(this.program, "screenSize")
	}
}

export class CalcPosShader extends Shader {

	readonly screenSize: Uniform
	readonly position: Uniform
	readonly speed: Uniform
	readonly vertex: Attrib
	readonly deltaTime: Uniform
	readonly firstMovedParticleIndex: Uniform
	readonly lastMovedParticleIndex: Uniform

	constructor(gl: WebGL2RenderingContext) {
		super(gl, calcPosVertexShaderCode, calcPosFragmentShaderCode)
		this.screenSize = gl.getUniformLocation(this.program, "screenSize")
		this.position = gl.getUniformLocation(this.program, "position")
		this.speed = gl.getUniformLocation(this.program, "speed")
		this.deltaTime = gl.getUniformLocation(this.program, "deltaTime")
		this.vertex = gl.getAttribLocation(this.program, "vertex")
		this.firstMovedParticleIndex = gl.getUniformLocation(this.program, "firstMovedParticleIndex")
		this.lastMovedParticleIndex = gl.getUniformLocation(this.program, "lastMovedParticleIndex")
	}
}

export class CalcSpeedShader extends Shader {
	readonly screenSize: Uniform
	readonly position: Uniform
	readonly speed: Uniform
	readonly vertex: Attrib
	readonly deltaTime: Uniform
	readonly gravity: Uniform

	constructor(gl: WebGL2RenderingContext) {
		super(gl, calcSpeedVertexShaderCode, calcSpeedFragmentShaderCode)
		this.screenSize = gl.getUniformLocation(this.program, "screenSize")
		this.position = gl.getUniformLocation(this.program, "position")
		this.speed = gl.getUniformLocation(this.program, "speed")
		this.deltaTime = gl.getUniformLocation(this.program, "deltaTime")
		this.gravity = gl.getUniformLocation(this.program, "gravity")
		this.vertex = gl.getAttribLocation(this.program, "vertex")
	}
}