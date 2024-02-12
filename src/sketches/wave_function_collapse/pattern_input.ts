import {tag} from "@nartallax/cardboard-dom"
import {rgbNumberToColorString} from "common/color_utils"
import {addCursorMoveHandler, pointerEventsToOffsetCoords, preventContextMenu} from "common/input_utils"
import {ColorArrayDisplay} from "sketches/wave_function_collapse/color_array_display"
import * as css from "./wave_function_collapse.module.scss"

type PatternInputParams<T extends number = number> = {
	readonly palette: readonly T[]
	readonly defaultValue: T
	readonly width: number
	readonly height: number
	readonly scale: number
}

type ColorButton<T extends number = number> = {
	button: HTMLElement
	color: T
	className: string
}

export class PatternInput<T extends number = number> {
	readonly root: HTMLElement

	private readonly display: ColorArrayDisplay
	private pattern: readonly (T[])[]
	private primaryCb: ColorButton<T> | null = null
	// I had logic around having secondary color on right mouse button
	// but turns out mouseevent.buttons can be weird
	// so, whatever, I'm not solving this now
	// private secondaryCb: ColorButton<T> | null = null

	constructor(private readonly params: PatternInputParams<T>) {
		this.display = new ColorArrayDisplay(params.scale)

		preventContextMenu(this.display.root)
		addCursorMoveHandler({
			element: this.display.root,
			onMove: this.onSetColorAction.bind(this),
			downIsMove: true
		})

		this.pattern = new Array(params.width).fill(null).map(() =>
			new Array(params.height).fill(params.defaultValue)
		)

		const paletteButtons = params.palette.map(color => {
			const button: HTMLElement = tag({
				class: css["pattern-input-palette-item"],
				onClick: () => {
					this.primaryCb = this.selectColor(this.primaryCb, button, color)
				},
				// onContextmenu: () => {
				// 	this.secondaryCb = this.selectColor(this.secondaryCb, button, color)
				// }
				style: {
					backgroundColor: rgbNumberToColorString(color)
				}
			})
			preventContextMenu(button)
			if(color === this.params.defaultValue){
				this.primaryCb = this.selectColor(null, button, color, css["selected-primary"]!)
				// this.secondaryCb = this.selectColor(null, button, color, css["selected-secondary"]!)
			}
			return button
		})

		this.root = tag({
			class: css["pattern-input-wrap"]
		}, [
			this.display.root,
			tag({
				class: css["pattern-input-palette-wrap"]
			}, paletteButtons)
		])

		this.redrawCanvas()
	}

	private redrawCanvas(): void {
		this.display.draw(this.pattern)
	}

	private onSetColorAction(e: MouseEvent | TouchEvent): void {
		const coords = pointerEventsToOffsetCoords(e)
		if(!coords){
			return
		}
		// let isPrimary: boolean
		// if(isTouchEvent(e)){
		// 	isPrimary = true
		// } else {
		// 	isPrimary = e.buttons !== 2
		// }
		const cellX = Math.floor(coords.x / this.params.scale)
		const cellY = Math.floor(coords.y / this.params.scale)
		const row = this.pattern[cellX]
		if(row && row.length > cellY){
			// const cb = isPrimary ? this.primaryCb : this.secondaryCb
			const cb = this.primaryCb
			if(cb){
				this.set(cellX, cellY, cb.color)
			}
		}
	}

	setValue(values: T[][]): void {
		this.pattern = JSON.parse(JSON.stringify(values))
		this.redrawCanvas()
	}

	set(x: number, y: number, color: T): void {
		this.pattern[x]![y] = color
		this.redrawCanvas()
	}

	private selectColor(prevCb: ColorButton<T> | null, button: HTMLElement, color: T, dfltClassName = "selected"): ColorButton<T> {
		const clsName = prevCb?.className ?? dfltClassName
		if(prevCb){
			prevCb.button.classList.remove(clsName)
		}
		const cb: ColorButton<T> = {
			button,
			color,
			className: clsName
		}
		button.classList.add(clsName)
		return cb
	}

	getPattern(): number[][] {
		return JSON.parse(JSON.stringify(this.pattern))
	}
}