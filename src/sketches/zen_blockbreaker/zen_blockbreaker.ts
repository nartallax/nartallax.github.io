import {color3ComponentsToNumber, colorNumberTo3Components, hslToRgb, rgbNumberToColorString, rgbToHsl} from "common/color_utils"
import {cycledRequestAnimationFrame} from "common/cycled_request_animation_frame"
import {svgTag} from "common/tag"

const blockColors = [0x000000, 0x53bc01, 0xffeb03, 0xffa801, 0xf93a1d, 0xe21a5f, 0x572c62, 0xa1ccd3, 0x006898]
const ballColors = blockColors.map(color => {
	const hsl = colorNumberTo3Components(rgbToHsl(color))
	hsl[1] = Math.min(255, hsl[1] * 1.25)
	hsl[2] = Math.min(255, hsl[2] * 1.25)
	return hslToRgb(color3ComponentsToNumber(hsl))
})

export function main(container: HTMLElement): void {
	const boardSize = 4

	const blockbreaker = new ZenBlockbreaker({
		ticksPerFrame: 5,
		ballAngleVariation: Math.PI / 4,
		ballSpeed: 20,
		// TODO: think about something more interesting here. fill the whole screen with the board..?
		// also block size may be related to DPI
		blockSizePx: 20,
		height: boardSize,
		width: boardSize
	})

	const wrap = document.createElement("div")
	wrap.style.cssText = "width: 100%; height: 100%; display: flex; align-items: center; justify-content: center"
	wrap.appendChild(blockbreaker.el)
	container.appendChild(wrap)

	blockbreaker.run()
}

interface Params {
	readonly ticksPerFrame: number
	readonly blockSizePx: number
	readonly width: number // blocks
	readonly height: number // blocks
	readonly ballSpeed: number // blocks per second
	readonly ballAngleVariation: number // radians
}

interface Ball {
	x: number
	y: number
	readonly color: number
	readonly el: SVGCircleElement
	// only positive values, in [0, 2pi) range
	angle: number
}

interface Cell {
	readonly isDestructible: boolean
	color: number
	readonly el: SVGRectElement
}

const enum Side {
	top = 0,
	right = 1,
	bottom = 2,
	left = 3
}

interface XY {
	readonly x: number
	readonly y: number
}

interface Collision {
	readonly side: Side
	readonly cell: Cell
	readonly ballPosition: XY
	readonly distanceMoved: number
}

const cos45 = Math.cos(Math.PI / 4)
const ballRadius = 0.5
const wallsThickness = 2

class ZenBlockbreaker {
	readonly el: SVGSVGElement
	private readonly balls: readonly Ball[]
	private readonly cells: readonly (readonly Cell[])[]

	constructor(private readonly params: Params) {
		this.el = svgTag({tagName: "svg"})
		this.el.setAttribute("width", this.params.width + "")
		this.el.setAttribute("height", this.params.height + "")
		// FIXME
		// this.el.setAttribute("viewBox", `${wallsThickness} ${wallsThickness} ${this.params.width} ${this.params.height}`)
		this.el.setAttribute("viewBox", `-2 -2 ${this.params.width + 6} ${this.params.height + 6}`)
		this.el.style.width = (this.params.width * this.params.blockSizePx) + "px"
		this.el.style.height = (this.params.height * this.params.blockSizePx) + "px"

		this.cells = this.makeCells()
		this.balls = this.makeBalls()
	}

	run(): void {
		const stop = cycledRequestAnimationFrame(this.el, delta => {
			delta /= 1000 // delta in seconds
			if(delta > 0.1){
				return
			}

			try {
				void delta
				for(let i = 0; i < this.params.ticksPerFrame; i++){
					this.onTick(delta)
				}
			} catch(e){
				stop()
				throw e
			}
		})
	}

	private onTick(delta: number): void {
		for(const ball of this.balls){
			this.moveBallAndProcessCollisions(ball, delta)
			this.updateBallGraphics(ball)
		}
	}

	private makeBalls(): Ball[] {
		const x = (this.params.width / 2) + wallsThickness
		const y = (this.params.height / 2) + wallsThickness
		const el = svgTag({tagName: "circle", attrs: {
			cx: x, cy: y, r: ballRadius, fill: rgbNumberToColorString(ballColors[1]!)
		}})
		this.el.appendChild(el)
		return [{
			x, y, el,
			angle: Math.PI * 2 * Math.random(),
			color: 1
		}]
	}

	private makeCellElement(x: number, y: number, color: number): SVGRectElement {
		return svgTag({tagName: "rect",
			attrs: {
				fill: rgbNumberToColorString(blockColors[color]!),
				width: 1,
				height: 1,
				x,
				y: this.params.height - y + 1
			}})
	}

	private makeCells(): Cell[][] {
		const getCell = (x: number, y: number): Cell => {
			let result: Cell
			const onEdgeX = x < wallsThickness || x >= this.params.width + wallsThickness
			const onEdgeY = y < wallsThickness || y >= this.params.height + wallsThickness
			if(onEdgeX || onEdgeY){
				console.log({x, y})
				result = {
					isDestructible: false,
					color: 0,
					el: this.makeCellElement(x, y, 0)
				}
			} else {
				const nearEdgeX = x < this.params.width / 4 || x > this.params.width * 0.75
				const nearEdgeY = y < this.params.height / 4 || y > this.params.height * 0.75
				if(nearEdgeX || nearEdgeY){
					result = {
						isDestructible: true,
						color: 2,
						el: this.makeCellElement(x, y, 2)
					}
				} else {
					result = {
						isDestructible: true,
						color: 1,
						el: this.makeCellElement(x, y, 1)
					}
				}
			}

			this.el.appendChild(result.el)
			return result
		}

		return new Array(this.params.width + wallsThickness * 2)
			.fill(null)
			.map((_, x) => new Array(this.params.height + wallsThickness * 2)
				.fill(null)
				.map((_, y) => getCell(x, y))
			)
	}

	private tryFindCollisionPoint(color: number, cx: number, cy: number, dx: number, dy: number, angle: number): [
		collidingPosition: XY,
		diff: XY,
		cell: Cell,
		cellSide: Side
	] | null {
		const x = cx + dx
		const y = cy + dy
		const cell = this.cells[Math.floor(x)]![Math.floor(y)]!
		if(cell.color === color){
			return null
		}
		// this is kinda bad
		// but any attempt to generalize this failed
		// maybe I'm just bad at it
		const side = dx === 0 ? dy > 0 ? Side.bottom : Side.top
			: dy === 0 ? dx > 0 ? Side.left : Side.right
				: dx > 0
					? dy > 0 ? angle < Math.PI * 0.25 || angle > Math.PI * 1.25 ? Side.right : Side.bottom
						: angle < Math.PI * 0.75 || angle > Math.PI * 1.75 ? Side.left : Side.top
					: dy > 0 ? angle < Math.PI * 0.75 || angle > Math.PI * 1.75 ? Side.bottom : Side.right
						: angle < Math.PI * 0.25 || angle > Math.PI * 1.25 ? Side.top : Side.right

		return [{x, y}, {x: dx, y: dy}, cell, side]
	}

	private tryFindCollision(ball: Ball, maxDistance: number): Collision | null {
		const newX = Math.cos(ball.angle) * maxDistance + ball.x
		const newY = Math.sin(ball.angle) * maxDistance + ball.y
		const collision = this.tryFindCollisionPoint(ball.color, newX, newY, 0, -ballRadius, ball.angle)
			?? this.tryFindCollisionPoint(ball.color, newX, newY, 0, ballRadius, ball.angle)
			?? this.tryFindCollisionPoint(ball.color, newX, newY, -ballRadius, 0, ball.angle)
			?? this.tryFindCollisionPoint(ball.color, newX, newY, ballRadius, 0, ball.angle)
			?? this.tryFindCollisionPoint(ball.color, newX, newY, ballRadius * cos45, ballRadius * cos45, ball.angle)
			?? this.tryFindCollisionPoint(ball.color, newX, newY, ballRadius * cos45, -ballRadius * cos45, ball.angle)
			?? this.tryFindCollisionPoint(ball.color, newX, newY, -ballRadius * cos45, ballRadius * cos45, ball.angle)
			?? this.tryFindCollisionPoint(ball.color, newX, newY, -ballRadius * cos45, -ballRadius * cos45, ball.angle)

		if(!collision){
			return null
		}

		const [{x: collidingX, y: collidingY}, {x: dx, y: dy}, cell, side] = collision
		// collision coords are coords on a side of collided block
		let collisionX: number, collisionY: number
		switch(side){
			case Side.top:
				collisionY = Math.ceil(collidingY)
				collisionX = xOfYAtLine(ball.x + dx, ball.y + dy, collidingX, collidingY, collisionY)
				break
			case Side.bottom:
				collisionY = Math.floor(collidingY)
				collisionX = xOfYAtLine(ball.x + dx, ball.y + dy, collidingX, collidingY, collisionY)
				break
			case Side.left:
				collisionX = Math.floor(collidingX)
				collisionY = yOfXAtLine(ball.x + dx, ball.y + dy, collidingX, collidingY, collisionX)
				break
			case Side.right:
				collisionX = Math.ceil(collidingX)
				collisionY = yOfXAtLine(ball.x + dx, ball.y + dy, collidingX, collidingY, collisionX)
				break
		}
		// console.log(`Intersection of line ${(ball.x + dx).toFixed(4)}, ${(ball.y + dy).toFixed(4)} -> ${collidingX.toFixed(4)}, ${collidingY.toFixed(4)} with ${side} side of ${Math.floor(collidingX)}, ${Math.floor(collidingY)} block is ${collisionX.toFixed(4)}, ${collisionY.toFixed(4)}`)
		let distanceMoved = distanceBetween(collisionX, collisionY, ball.x + dx, ball.y + dy)

		if(distanceMoved > maxDistance){
			// console.log("oops zeroing the distance")
			// this can happen when collision point of the ball already passed side in one dimension in previous tick
			// not sure what to do at this point, let's just zero it out
			// it's shitty, but good enough for our case, and I don't have better options
			distanceMoved = 0
		}

		return {
			ballPosition: {
				x: ball.x + Math.cos(ball.angle) * distanceMoved,
				y: ball.y + Math.sin(ball.angle) * distanceMoved
			},
			cell,
			side,
			distanceMoved
		}
	}

	/** change angle of an object that bounces from @param side of a rectangle */
	private bounceAngle(angle: number, side: Side): number {
		let x = Math.cos(angle)
		let y = Math.sin(angle)
		let min = 0
		let max = 0
		switch(side){
			case Side.top: y = -y; min = 0; max = Math.PI; break
			case Side.bottom: y = -y; min = Math.PI; max = 0; break
			case Side.left: x = -x; min = Math.PI * 0.5; max = Math.PI * 1.5; break
			case Side.right: x = -x; min = Math.PI * 1.5; max = Math.PI * 0.5; break
		}

		const randomAngle = (Math.random() - 0.5) * this.params.ballAngleVariation
		const newAngle = normalizeAngle(Math.atan2(y, x)) + randomAngle
		const clampedAngle = clampNormalizedAngle(newAngle, min, max)
		if(clampedAngle !== newAngle){
			// rare case of weird collision. lets just do nothing
			return angle
		}

		return clampedAngle
	}

	private moveBallAndProcessCollisions(ball: Ball, delta: number): void {
		let distanceToGo = this.params.ballSpeed * delta
		let cycles = 10
		while(distanceToGo > 0.01){
			const collision = this.tryFindCollision(ball, distanceToGo)
			if(!collision){
				ball.x += Math.cos(ball.angle) * distanceToGo
				ball.y += Math.sin(ball.angle) * distanceToGo
				return
			}

			if(cycles-- <= 0){
				throw new Error("Assertion failed")
			}

			if(collision.cell.isDestructible){
				this.destroyCellWithBall(collision.cell, ball)
			}

			const newAngle = this.bounceAngle(ball.angle, collision.side)
			if(newAngle === ball.angle && collision.distanceMoved === 0 && ball.x === collision.ballPosition.x && ball.y === collision.ballPosition.y && !collision.cell.isDestructible){
				// two of weird bugs coincided
				// if we don't do something - we'll be stuck in this loop forever
				// console.log("oops, randomizing angle")
				ball.angle = Math.PI * 2 * Math.random()
				return
			}
			ball.angle = newAngle
			distanceToGo -= collision.distanceMoved
			ball.x = collision.ballPosition.x
			ball.y = collision.ballPosition.y
		}
	}

	private destroyCellWithBall(cell: Cell, ball: Ball): void {
		cell.color = ball.color
		cell.el.setAttribute("fill", rgbNumberToColorString(blockColors[ball.color]!))
	}

	private updateBallGraphics(ball: Ball): void {
		ball.el.setAttribute("cx", ball.x + "")
		ball.el.setAttribute("cy", (this.params.height + 2 - ball.y) + "")
	}
}

// implying both angle, min and max are normalized angles
function clampNormalizedAngle(angle: number, min: number, max: number): number {
	if(max > min){
		// range does not go through zero
		return Math.min(max, Math.max(min, angle))
	}
	// range goes through zero
	if(angle > min || angle < max){
		return angle
	}
	const dMax = angle - max
	const dMin = min - angle
	return dMax < dMin ? max : min
}

function normalizeAngle(angle: number): number {
	if(angle < 0){
		while(angle < 0){
			angle += Math.PI * 2
		}
	} else {
		while(angle > Math.PI * 2){
			angle -= Math.PI * 2
		}
	}
	return angle
}

function distanceBetween(ax: number, ay: number, bx: number, by: number): number {
	const dx = ax - bx
	const dy = ay - by
	return Math.sqrt(dx ** 2 + dy ** 2)
}

function yOfXAtLine(ax: number, ay: number, bx: number, by: number, x: number): number {
	const angle = Math.atan2(by - ay, bx - ax)
	return ay + ((x - ax) * Math.tan(angle))
}

function xOfYAtLine(ax: number, ay: number, bx: number, by: number, y: number): number {
	const angle = Math.atan2(by - ay, bx - ax)
	return ax + ((y - ay) / Math.tan(angle))
}