import {color3ComponentsToNumber, colorNumberTo3Components, hslToRgb, rgbNumberToColorString, rgbToHsl} from "common/color_utils"
import {cycledRequestAnimationFrame} from "common/cycled_request_animation_frame"
import {tag} from "common/tag"
import * as Matter from "lib/matterjs/matter"
import {makeBottomBar} from "sketches/zen_blockbreaker/bottom_bar"

const blockColors = [0x000000, 0x53bc01, 0xffeb03, 0xffa801, 0xf93a1d, 0xe21a5f, 0x572c62, 0xa1ccd3, 0x006898]
const ballColors = blockColors.map(color => {
	const hsl = colorNumberTo3Components(rgbToHsl(color))
	hsl[1] = Math.min(255, hsl[1] * 1.25)
	hsl[2] = Math.min(255, hsl[2] * 1.25)
	return hslToRgb(color3ComponentsToNumber(hsl))
})

export function main(container: HTMLElement): void {
	const initialTicksPerFrame = 3
	const speedMult = 0.5 / initialTicksPerFrame
	const sideCount = 4

	const wrap = document.createElement("div")
	wrap.style.cssText = "width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-between"
	container.appendChild(wrap)

	const bottomBar = makeBottomBar({
		initialSpeed: initialTicksPerFrame,
		colors: blockColors,
		onSpeedChange: speed => blockbreaker.setTicksPerFrame(speed)
	})
	bottomBar.onStatsUpdate(new Map(new Array(sideCount).fill(null).map((_, i) => [i + 1, 0])))
	wrap.appendChild(bottomBar.root)

	const rect = container.getBoundingClientRect()
	const bottomBarHeight = bottomBar.root.getBoundingClientRect().height
	const width = rect.width
	const height = rect.height - bottomBarHeight
	const screenSpacePx = width * height
	const blockSizePx = Math.floor(Math.sqrt(screenSpacePx) / 25)

	const blockbreaker: ZenBlockbreaker = new ZenBlockbreaker({
		ticksPerFrame: initialTicksPerFrame,
		ballSpeed: speedMult * ((height + width) / blockSizePx),
		// TODO: think about something more interesting here. fill the whole screen with the board..?
		// also block size may be related to DPI
		blockSizePx,
		height: Math.floor(height / blockSizePx),
		width: Math.floor(width / blockSizePx),
		sideCount,
		onStatsChange: () => bottomBar.onStatsUpdate(blockbreaker.stats)
	})

	bottomBar.root.before(blockbreaker.root)
	bottomBar.onStatsUpdate(blockbreaker.stats)

	blockbreaker.run()
}

interface Params {
	readonly ticksPerFrame: number
	readonly blockSizePx: number
	readonly width: number // blocks
	readonly height: number // blocks
	readonly ballSpeed: number // blocks per second
	readonly sideCount: number
	onStatsChange(): void
}

/** Multiplier of matter.js scale
 * matter.js starts to work weird if numbers are small
 * so we multiply those numbers by this value */
const matterMul = 100

class ZenBlockbreaker {
	readonly root: HTMLElement
	private readonly matter: Matter.Engine
	private readonly render: Matter.Render
	private ticksPerFrame: number
	readonly stats = new Map<number, number>()

	constructor(private readonly params: Params) {
		this.root = tag()

		this.ticksPerFrame = params.ticksPerFrame
		this.matter = Matter.Engine.create({
			gravity: {x: 0, y: 0},
			enableSleeping: true
		})

		this.makeWalls()
		this.makeBlocks()
		this.makeBalls()

		this.render = Matter.Render.create({
			element: this.root,
			engine: this.matter,
			options: {
				width: this.params.width * this.params.blockSizePx,
				height: this.params.height * this.params.blockSizePx,
				wireframes: false
			}
		})
		Matter.Render.lookAt(this.render, {
			min: {x: 0, y: 0},
			max: {x: this.params.width * matterMul, y: this.params.height * matterMul}
		})

		Matter.Events.on(this.matter, "collisionEnd", (e: Matter.IEventCollision<Matter.Engine>) => {
			for(const pair of e.pairs){
				this.processCollision(pair)
			}
		})
	}

	setTicksPerFrame(ticksPerFrame: number): void {
		this.ticksPerFrame = ticksPerFrame
	}

	private makeBlocks(): void {
		const cx = this.params.width / 2
		const cy = this.params.height / 2
		for(let x = 0; x < this.params.width; x++){
			for(let y = 0; y < this.params.height; y++){
				const bx = x + 0.5
				const by = y + 0.5
				const angle = Math.atan2(by - cy, bx - cx)

				let part = angle / (Math.PI * 2)
				while(part < 0){
					part++
				}
				part *= this.params.sideCount
				part = Math.floor(part)

				const color = part + 1
				this.makeBlock(bx, by, color)
			}
		}
	}

	private makeBalls(): void {
		const partSector = (Math.PI * 2) / this.params.sideCount
		for(let part = 0; part < this.params.sideCount; part++){
			const angle = (part + 0.5) * partSector
			const sin = Math.sin(angle)
			const cos = Math.cos(angle)
			const distanceToHWall = Math.abs(Math.abs(cos) < 0.01 ? this.params.height / 2 : (this.params.width / 2) / cos)
			const distanceToWWall = Math.abs(Math.abs(sin) < 0.01 ? this.params.width / 2 : (this.params.height / 2) / sin)
			const distanceToWall = Math.min(distanceToHWall, distanceToWWall)
			const distanceToBall = Math.abs(distanceToWall / 2)
			const x = (distanceToBall * cos) + this.params.width / 2
			const y = (distanceToBall * sin) + this.params.height / 2
			this.makeBall(x, y, part + 1)
		}
	}

	private processCollision(collision: Matter.Pair): void {
		const ballAndColor = this.getBallFromCollision(collision)
		if(!ballAndColor){
			// what?
			return
		}

		const [ball, ballColor] = ballAndColor
		const velocityAngle = Math.atan2(ball.velocity.y, ball.velocity.x)
		// if we don't do this - ball will gradually lose speed, which is bad
		// yes, everything has restitution = 1 and friction = 0
		// but the very nature of incremental simulations is lossy, no way around this
		this.setBallSpeed(ball, velocityAngle)

		const blockAndColor = this.getBlockFromCollision(collision)
		if(!blockAndColor){
			// wall?
			return
		}
		const [block, blockColor] = blockAndColor
		this.setBlockColor(block, blockColor, ballColor)
		this.params.onStatsChange()
	}

	private setBallSpeed(ball: Matter.Body, angle: number): void {
		Matter.Body.setVelocity(ball, {
			x: Math.cos(angle) * this.params.ballSpeed,
			y: Math.sin(angle) * this.params.ballSpeed
		})
	}

	private makeBlock(x: number, y: number, color: number): void {
		const block = Matter.Bodies.rectangle(x * matterMul, y * matterMul, 1 * matterMul, 1 * matterMul, {
			isStatic: true,
			isSleeping: true,
			render: {
				fillStyle: "black"
			},
			plugin: {
				blockColor: 0
			},
			restitution: 1,
			label: `Block at ${x},${y}`,
			collisionFilter: {
				group: 0,
				category: 0,
				mask: 0
			}
		})

		this.setBlockColor(block, null, color)

		Matter.Composite.add(this.matter.world, [block])
	}

	private setBlockColor(block: Matter.Body, oldColor: number | null, newColor: number): void {
		if(oldColor !== null){
			this.stats.set(oldColor, (this.stats.get(oldColor) ?? 0) - 1)
		}
		this.stats.set(newColor, (this.stats.get(newColor) ?? 0) + 1)

		block.render.fillStyle = rgbNumberToColorString(blockColors[newColor]!)
		block.plugin.blockColor = newColor
		block.collisionFilter.category = 1 << newColor
		block.collisionFilter.mask = 0x8fffffff & (~(1 << newColor))
	}

	private getBlockFromCollision(pair: Matter.Pair): [Matter.Body, number] | null {
		let color = this.getBlockColor(pair.bodyA)
		if(color !== null){
			return [pair.bodyA, color]
		}
		color = this.getBlockColor(pair.bodyB)
		if(color !== null){
			return [pair.bodyB, color]
		}
		return null
	}

	private getBlockColor(block: Matter.Body): number | null {
		return block.plugin.blockColor ?? null
	}

	private makeBall(x: number, y: number, color: number): void {
		const ball = Matter.Bodies.circle(x * matterMul, y * matterMul, 0.5 * matterMul, {
			isStatic: false,
			render: {
				fillStyle: rgbNumberToColorString(ballColors[color]!)
			},
			plugin: {
				ballColor: color
			},
			restitution: 1,
			friction: 0,
			frictionAir: 0,
			frictionStatic: 0,
			label: "Ball " + color,
			collisionFilter: {
				group: 0,
				category: 1 << color,
				mask: 0x8fffffff & (~(1 << color))
			}
		})

		const angle = Math.random() * Math.PI * 2
		this.setBallSpeed(ball, angle)

		Matter.Composite.add(this.matter.world, [ball])
	}

	private getBallFromCollision(pair: Matter.Pair): [Matter.Body, number] | null {
		let color = this.getBallColor(pair.bodyA)
		if(color !== null){
			return [pair.bodyA, color]
		}
		color = this.getBallColor(pair.bodyB)
		if(color !== null){
			return [pair.bodyB, color]
		}
		return null
	}

	private getBallColor(body: Matter.Body): number | null {
		return body.plugin.ballColor ?? null
	}

	private makeWalls(): void {
		const wallThickness = 10
		const wallProps: Matter.IChamferableBodyDefinition = {
			isStatic: true,
			isSleeping: true,
			render: {fillStyle: "black"},
			restitution: 1,
			label: "wall"
		}
		Matter.Composite.add(this.matter.world, [
			Matter.Bodies.rectangle(
				(this.params.width / 2) * matterMul, (-wallThickness / 2) * matterMul,
				(this.params.width + (wallThickness * 2)) * matterMul, wallThickness * matterMul,
				wallProps
			),
			Matter.Bodies.rectangle(
				(this.params.width / 2) * matterMul, ((wallThickness / 2) + this.params.height) * matterMul,
				(this.params.width + (wallThickness * 2)) * matterMul, wallThickness * matterMul,
				wallProps
			),
			Matter.Bodies.rectangle(
				(-wallThickness / 2) * matterMul, (this.params.height / 2) * matterMul,
				wallThickness * matterMul, (this.params.height + (wallThickness * 2)) * matterMul,
				wallProps
			),
			Matter.Bodies.rectangle(
				((wallThickness / 2) + this.params.width) * matterMul, (this.params.height / 2) * matterMul,
				wallThickness * matterMul, (this.params.height + (wallThickness * 2)) * matterMul,
				wallProps
			)
		])
	}

	run(): void {
		Matter.Render.run(this.render)
		const stop = cycledRequestAnimationFrame(this.root, delta => {
			delta /= 1000 // delta in seconds
			if(delta > 0.1){
				return
			}

			try {
				void delta
				for(let i = 0; i < this.ticksPerFrame; i++){
					Matter.Engine.update(this.matter, delta * 1000)
				}
			} catch(e){
				stop()
				throw e
			}
		}, () => {
			Matter.Render.stop(this.render)
		})
	}
}