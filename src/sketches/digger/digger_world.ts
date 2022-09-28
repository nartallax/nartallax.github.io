import {Bitmap} from "common/bitmap"
import {tag} from "common/dom_utils"
import {RectanlgeDeduplicator} from "common/rectangle_deduplicator"

export interface DiggerWorldOptions {
	readonly widthCells: number
	readonly heightCells: number
	readonly screenHeight: number
	readonly screenWidth: number
	readonly wallThickness: number
	readonly dramaticDrawTiming: {
		readonly terrain: number
	}
	readonly colors: {
		readonly terrainA: string
		readonly terrainB: string
		readonly terrainEmpty: string
	}
}

enum GameState {
	DramaticDrawTerrain,
	Running
}

export class DiggerWorld {

	private readonly terrain: Bitmap
	readonly el: HTMLCanvasElement
	private readonly context: CanvasRenderingContext2D
	private state: GameState = GameState.Running
	private dramaticDrawProgress = 0
	private raf: number | null = null
	private readonly cellSizePx: number
	private readonly soilMarginLeft: number
	// private readonly soilMarginRight: number
	// private readonly soilMarginBottom: number
	private readonly playgroundWidthPx: number
	// private readonly playgroundHeightPx: number

	readonly invalidatedRects = new RectanlgeDeduplicator()

	constructor(private readonly options: DiggerWorldOptions) {

		let cellSizeByWidth = options.screenWidth / options.widthCells
		let cellSizeByHeight = options.screenHeight / (options.heightCells + 1)
		this.cellSizePx = Math.floor(Math.min(cellSizeByWidth, cellSizeByHeight))
		let hMarginSum = options.screenWidth - (this.cellSizePx * options.widthCells)
		this.soilMarginLeft = Math.ceil(hMarginSum / 2)
		// this.soilMarginRight = hMarginSum - this.soilMarginLeft
		// this.soilMarginBottom = options.screenHeight - (this.cellSizePx * (options.heightCells + 1))
		this.playgroundWidthPx = options.widthCells * this.cellSizePx
		// this.playgroundHeightPx = options.heightCells * this.cellSizePx

		this.terrain = new Bitmap((this.cellSizePx ** 2) * options.widthCells * options.heightCells)
		this.terrain.setAll()

		this.el = tag({
			tagName: "canvas",
			width: options.screenWidth,
			height: options.screenHeight
		})
		let ctx = this.el.getContext("2d")
		if(!ctx){
			throw new Error("Browser can't canvas 2d")
		}
		this.context = ctx

		if(!requestAnimationFrame){
			throw new Error("Browser can't RAF")
		}
	}

	// screen coords here
	private drawTerrainPixelAt(x: number, y: number, isFull: boolean): void {
		this.context.fillStyle
		this.context.fillStyle = isFull
			? ((y & 0b1111) > 0b1000 ? ((y + x) & 0b1111) > 0b1000 : ((y - x) & 0b1111) < 0b1000)
				? this.options.colors.terrainA
				: this.options.colors.terrainB
			: this.options.colors.terrainEmpty
		this.context.fillRect(x, y, 1, 1)
	}

	// playground coords here
	private redrawTerrainAt(x: number, y: number): void {
		this.drawTerrainPixelAt(
			x + this.soilMarginLeft,
			y + this.cellSizePx,
			this.terrain.get((y * this.playgroundWidthPx) + x)
		)
	}

	private dramaticDrawInitialTerrain(deltaTime: number): void {
		let startAt = this.dramaticDrawProgress

		let limit = this.options.screenWidth * (this.options.screenHeight - this.cellSizePx)
		let drawSpeed = limit / this.options.dramaticDrawTiming.terrain
		let pixelsToDraw = Math.floor(deltaTime * drawSpeed)
		this.dramaticDrawProgress = Math.min(
			limit,
			this.dramaticDrawProgress + pixelsToDraw
		)

		for(let i = startAt; i < this.dramaticDrawProgress; i++){
			let x = (i % this.options.screenWidth)
			let y = ((i - x) / this.options.screenWidth) + this.cellSizePx
			this.drawTerrainPixelAt(x, y, true)
		}

		if(this.dramaticDrawProgress === limit){
			this.state = GameState.Running
			this.dramaticDrawProgress = 0
		}
	}

	invalidate(x: number, y: number, w: number, h: number): void {
		this.invalidatedRects.add({x, y, w, h})
	}

	private redrawInvalidatedRectangles(): void {
		for(let rect of this.invalidatedRects.getNonIntersectingRects()){
			let xLim = rect.x + rect.w
			let yLim = rect.y + rect.h
			for(let x = rect.x; x < xLim; x++){
				for(let y = rect.y; y < yLim; y++){
					this.redrawTerrainAt(x, y)
				}
			}
		}
		this.invalidatedRects.clear()
	}

	private onTick(deltaTime: number): void {
		switch(this.state){
			case GameState.DramaticDrawTerrain:
				this.dramaticDrawInitialTerrain(deltaTime)
				return
			case GameState.Running:
				this.redrawInvalidatedRectangles()
				// draw objects here
				return
		}
	}

	private reset(): void {
		this.state = GameState.DramaticDrawTerrain
		this.dramaticDrawProgress = 0
	}

	start(): void {
		if(this.raf){
			throw new Error("Already started")
		}

		this.reset()

		let prevTime = 0
		let doTick = (time: number) => {
			this.raf = requestAnimationFrame(doTick)
			let deltaTime = Math.min(1000 / 15, time - prevTime) / 1000
			prevTime = time
			this.onTick(deltaTime)
		}
		doTick(prevTime)
	}

	stop(): void {
		if(!this.raf){
			throw new Error("Not started")
		}

		cancelAnimationFrame(this.raf)
		this.raf = null
	}

	digVertical(cellX: number, startCellY: number, endCellY: number): void {
		if(startCellY > endCellY){
			let buf = startCellY
			endCellY = startCellY
			startCellY = buf
		}
		let width = this.cellSizePx * (1 - this.options.wallThickness)
		let xStart = (cellX * this.cellSizePx) - (width / 2)
		let xEnd = xStart + width
		let yStart = startCellY * this.cellSizePx
		let yEnd = endCellY * this.cellSizePx
		for(let y = yStart; y <= yEnd; y++){
			let rowStart = (y * this.playgroundWidthPx)
			for(let x = xStart; x <= xEnd; x++){
				this.terrain.clear(rowStart + x)
			}
		}
		this.invalidate(xStart, yStart, xEnd - xStart, yEnd - yStart)
	}

}