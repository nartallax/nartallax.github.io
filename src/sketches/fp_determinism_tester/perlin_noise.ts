import {makeRandomGenerator} from "common/seeded_random"
import {cos, sin} from "sketches/fp_determinism_tester/trigonometry"
import {XY} from "sketches/random_rhombus_tilings/triangle_grid"

const makeKey = (x: number, y: number) => (x * 0xffffff) + y

/** Simple perlin noise generator.
Behaves weirdly if ints are passed to get() - will always return zero
Keep coords below 0xffffff */
export class PerlinNoiseGenerator {
	private readonly random: () => number
	private readonly gradients = new Map<number, XY>()

	constructor(seed: number, private readonly pi: number = Math.PI) {
		this.random = makeRandomGenerator(seed)
	}

	private randomVector(): XY {
		const theta = this.random() * 2 * this.pi
		return {x: cos(theta), y: sin(theta)}
	}

	private dotProductGrid(x: number, y: number, vx: number, vy: number): number {
		let gradientVector = this.gradients.get(makeKey(vx, vy))
		if(!gradientVector){
			gradientVector = this.randomVector()
			this.gradients.set(makeKey(vx, vy), gradientVector)
		}
		const diffVector = {x: x - vx, y: y - vy}
		return diffVector.x * gradientVector.x + diffVector.y * gradientVector.y
	}

	private smootherstep(x: number): number {
		return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3
	}

	private interp(x: number, a: number, b: number): number {
		return a + this.smootherstep(x) * (b - a)
	}

	/** Returns perlin noise value in range (-1, 1) */
	get(x: number, y: number): number {
		const xInt = Math.floor(x)
		const yInt = Math.floor(y)
		// interpolate
		const topLeft = this.dotProductGrid(x, y, xInt, yInt)
		const topRight = this.dotProductGrid(x, y, xInt + 1, yInt)
		const bottomLeft = this.dotProductGrid(x, y, xInt, yInt + 1)
		const bottomRight = this.dotProductGrid(x, y, xInt + 1, yInt + 1)
		const xTop = this.interp(x - xInt, topLeft, topRight)
		const xBottom = this.interp(x - xInt, bottomLeft, bottomRight)
		return this.interp(y - yInt, xTop, xBottom)
	}
}