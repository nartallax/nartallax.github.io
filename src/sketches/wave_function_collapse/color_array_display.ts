import {rgbNumberToColorString} from "common/color_utils"
import {tag} from "common/tag"

export class ColorArrayDisplay {

	readonly root: HTMLElement
	private readonly context: CanvasRenderingContext2D

	constructor(readonly scale: number) {
		const canvas = tag({tagName: "canvas"})
		this.root = canvas

		const context = canvas.getContext("2d")
		if(!context){
			throw new Error("No context")
		}
		this.context = context
	}

	draw(values: readonly (readonly number[])[]): void {
		const w = values.length * this.scale
		const h = values[0]!.length * this.scale
		this.root.setAttribute("width", w + "")
		this.root.setAttribute("height", h + "")
		this.root.style.width = w + "px"
		this.root.style.height = h + "px"

		const s = this.scale
		for(let x = 0; x < values.length; x++){
			const row = values[x]!
			for(let y = 0; y < row.length; y++){
				this.context.fillStyle = rgbNumberToColorString(row[y]!)
				this.context.fillRect(x * s, y * s, s, s)
			}
		}
	}

}