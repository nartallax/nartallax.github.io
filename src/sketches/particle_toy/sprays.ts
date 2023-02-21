import {Uniform} from "common/gl_utils"
import {DataShader} from "sketches/particle_toy/shader"

export type Spray = {
	x: number
	y: number
	direction: number
	power: number
	spread: number
	intensity: number // particles per frame
}

export const zeroSpray: Spray = {x: 0, y: 0, direction: 0, power: 0, spread: 0, intensity: 0}
export const sprays: Spray[] = [{...zeroSpray}, {...zeroSpray}, {...zeroSpray}, {...zeroSpray}]

function uploadFloatSprayField(gl: WebGL2RenderingContext, uniform: Uniform, field: keyof Spray) {
	gl.uniform4f(uniform, sprays[0]![field], sprays[1]![field], sprays[2]![field], sprays[3]![field])
}

function uploadUintSprayField(gl: WebGL2RenderingContext, uniform: Uniform, field: keyof Spray) {
	gl.uniform4ui(uniform, sprays[0]![field], sprays[1]![field], sprays[2]![field], sprays[3]![field])
}

export let particlesMovedPerSecond = 0
export function uploadSprays(gl: WebGL2RenderingContext, shader: DataShader): void {
	particlesMovedPerSecond = sprays
		.filter(spray => spray.x !== 0 && spray.y !== 0)
		.map(spray => spray.intensity)
		.reduce((a, b) => a + b, 0)

	uploadFloatSprayField(gl, shader.sprayX, "x")
	uploadFloatSprayField(gl, shader.sprayY, "y")
	uploadFloatSprayField(gl, shader.sprayDirection, "direction")
	uploadFloatSprayField(gl, shader.sprayPower, "power")
	uploadFloatSprayField(gl, shader.spraySpread, "spread")
	uploadUintSprayField(gl, shader.sprayIntensity, "intensity")
}