import {rgbNumberToColorString, transformColorHsl} from "common/color_utils"
import {cycledRequestAnimationFrame} from "common/cycled_request_animation_frame"
import {svgTag, tag} from "common/tag"
import * as Matter from "lib/matterjs/matter"
import {BallTail} from "sketches/zen_blockbreaker/ball_tail"

interface Params {
	readonly ticksPerFrame: number
	readonly blockSizePx: number
	readonly width: number // blocks
	readonly height: number // blocks
	readonly ballSpeed: number // blocks per second
	readonly sideCount: number
	readonly colors: readonly number[]
	readonly render: "matterjs" | "svg"
	readonly tailLength: number // seconds
	onStatsChange(): void
}

interface Ball {
	readonly body: Matter.Body
	readonly el: SVGCircleElement | null
	readonly color: number
	readonly tail: BallTail | null
}

interface Block {
	readonly body: Matter.Body
	readonly el: SVGRectElement | null
	color: number
}

/** Multiplier of matter.js scale
 * matter.js starts to work weird if numbers are small
 * so we multiply those numbers by this value */
const matterMul = 100

export class ZenBlockbreaker {
	readonly root: HTMLElement
	private readonly matter: Matter.Engine
	private render: Matter.Render | null = null
	private svg: SVGSVGElement | null = null
	private ticksPerFrame: number
	readonly stats = new Map<number, number>()
	readonly balls: Ball[] = []
	private readonly blockColors: readonly number[]
	private timePassed = 0

	constructor(private readonly params: Params) {
		this.blockColors = this.params.colors.map(color => transformColorHsl(color,
			([h, s, l]) => [h, s * 0.75, l * 0.9]
		))

		this.root = tag()

		this.ticksPerFrame = params.ticksPerFrame
		this.matter = Matter.Engine.create({
			gravity: {x: 0, y: 0},
			enableSleeping: true
		})

		if(this.params.render === "matterjs"){
			this.makeMatterjsRender()
		} else {
			this.makeSvgRender()
		}

		this.makeWalls()
		this.makeBlocks()
		this.makeBalls()

		Matter.Events.on(this.matter, "collisionEnd", (e: Matter.IEventCollision<Matter.Engine>) => {
			for(const pair of e.pairs){
				this.processCollision(pair)
			}
		})
	}

	private makeSvgRender(): void {
		this.svg = svgTag({tagName: "svg"})
		this.svg.setAttribute("width", this.params.width + "")
		this.svg.setAttribute("height", this.params.height + "")
		this.svg.setAttribute("viewBox", `0 0 ${this.params.width} ${this.params.height}`)
		this.svg.style.width = (this.params.width * this.params.blockSizePx) + "px"
		this.svg.style.height = (this.params.height * this.params.blockSizePx) + "px"
		this.root.appendChild(this.svg)
	}

	private makeMatterjsRender(): void {
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
		const ball = this.getBallFromCollision(collision)
		if(!ball){
			// what?
			return
		}

		const velocityAngle = Math.atan2(ball.body.velocity.y, ball.body.velocity.x)
		// if we don't do this - ball will gradually lose speed, which is bad
		// yes, everything has restitution = 1 and friction = 0
		// but the very nature of incremental simulations is lossy, no way around this
		this.setBallSpeed(ball, velocityAngle)

		const block = this.getBlockFromCollision(collision)
		if(!block){
			// wall?
			return
		}
		this.setBlockColor(block, block.color, ball.color)
		this.params.onStatsChange()
	}

	private setBallSpeed(ball: Ball, angle: number): void {
		Matter.Body.setVelocity(ball.body, {
			x: Math.cos(angle) * this.params.ballSpeed,
			y: Math.sin(angle) * this.params.ballSpeed
		})
	}

	private makeBlock(x: number, y: number, color: number): void {
		const body = Matter.Bodies.rectangle(x * matterMul, y * matterMul, 1 * matterMul, 1 * matterMul, {
			isStatic: true,
			isSleeping: true,
			render: {
				fillStyle: "black"
			},
			restitution: 1,
			label: `Block at ${x},${y}`,
			collisionFilter: {
				group: 0,
				category: 0,
				mask: 0
			}
		})
		Matter.Composite.add(this.matter.world, [body])

		let block: Block = {body, color, el: null}
		if(this.params.render === "svg"){
			const el = svgTag({tagName: "rect",
				attrs: {
					fill: "block",
					width: 1,
					height: 1,
					x: x - 0.5,
					y: y - 0.5
				}})
			this.svg!.appendChild(el)

			block = {...block, el}
		}

		body.plugin.block = block

		this.setBlockColor(block, null, color)
	}

	private setBlockColor(block: Block, oldColor: number | null, newColor: number): void {
		if(oldColor !== null){
			this.stats.set(oldColor, (this.stats.get(oldColor) ?? 0) - 1)
		}
		this.stats.set(newColor, (this.stats.get(newColor) ?? 0) + 1)

		block.color = newColor
		block.body.collisionFilter.category = 1 << newColor
		block.body.collisionFilter.mask = 0x8fffffff & (~(1 << newColor))

		const colorStr = rgbNumberToColorString(this.blockColors[newColor]!)
		if(this.params.render === "matterjs"){
			block.body.render.fillStyle = colorStr
		} else {
			block.el!.style.fill = colorStr
		}
	}

	private getBlockFromCollision(pair: Matter.Pair): Block | null {
		return this.getBlock(pair.bodyA) ?? this.getBlock(pair.bodyB)
	}

	private getBlock(block: Matter.Body): Block | null {
		return block.plugin.block ?? null
	}

	private makeBall(x: number, y: number, color: number): void {
		const colorRgbSrc = this.params.colors[color]!
		const colorStr = rgbNumberToColorString(transformColorHsl(colorRgbSrc,
			([h, s, l]) => [h, s * 1.1, l * 1.25]
		))

		const body = Matter.Bodies.circle(x * matterMul, y * matterMul, 0.5 * matterMul, {
			isStatic: false,
			render: {
				fillStyle: colorStr
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

		Matter.Composite.add(this.matter.world, [body])

		let ball: Ball = {body, color, el: null, tail: null}

		if(this.params.render === "svg"){
			const tailColor = rgbNumberToColorString(transformColorHsl(colorRgbSrc,
				([h, s, l]) => [h, s * 0.9, l * 0.9]
			))
			const tail = new BallTail(this.params.tailLength, tailColor)
			this.svg!.appendChild(tail.el)

			const el = svgTag({tagName: "circle", attrs: {
				cx: x, cy: y, r: 0.5, fill: colorStr
			}})
			this.svg!.appendChild(el)

			ball = {...ball, el, tail}
		}

		body.plugin.ball = ball
		this.balls.push(ball)

		const angle = Math.random() * Math.PI * 2
		this.setBallSpeed(ball, angle)
	}

	private getBallFromCollision(pair: Matter.Pair): Ball | null {
		return this.getBall(pair.bodyA) ?? this.getBall(pair.bodyB)
	}

	private getBall(body: Matter.Body): Ball | null {
		return body.plugin.ball ?? null
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
		if(this.render){
			Matter.Render.run(this.render)
		}
		const stop = cycledRequestAnimationFrame(this.root, delta => {
			delta /= 1000 // delta in seconds
			if(delta > 0.1){
				return
			}

			try {
				for(let i = 0; i < this.ticksPerFrame; i++){
					this.timePassed += delta
					Matter.Engine.update(this.matter, delta * 1000)
				}
				if(this.params.render === "svg"){
					this.updateBallElements()
				}
			} catch(e){
				stop()
				throw e
			}
		}, () => {
			if(this.render){
				Matter.Render.stop(this.render)
			}
		})
	}

	private updateBallElements(): void {
		for(const ball of this.balls){
			const x = ball.body.position.x / matterMul
			const y = ball.body.position.y / matterMul

			const el = ball.el!
			el.setAttribute("cx", x + "")
			el.setAttribute("cy", y + "")

			ball.tail!.update(this.timePassed, x, y)
		}
	}
}