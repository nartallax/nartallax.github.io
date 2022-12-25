import {DiggerWorld} from "./digger_world"

export abstract class DiggerObject {

	abstract readonly width: number
	abstract readonly height: number

	constructor(
		public x: number,
		public y: number,
		readonly world: DiggerWorld) {}

	abstract draw(context: CanvasRenderingContext2D): void

	moveTo(x: number, y: number): void {
		this.world.invalidate(this.x, this.y, this.width, this.height)
		this.x = x
		this.y = y
	}

}