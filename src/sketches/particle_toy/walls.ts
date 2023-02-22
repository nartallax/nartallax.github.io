import {angleRange, DataTextureSingle, encodeFloat} from "sketches/particle_toy/data_texture"

export type Point2D = {
	x: number
	y: number
}

export type Wall = {
	from: Point2D
	to: Point2D
}

type Rect = [Point2D, Point2D, Point2D, Point2D]

export const walls: Wall[] = []

export const wallThickness = 50

function getWallAngle(wall: Wall): number {
	const dy = wall.from.y - wall.to.y
	const dx = wall.from.x - wall.to.x
	return Math.atan2(dy, dx)
}

export function wallToRect(wall: Wall): Rect {
	const angle = getWallAngle(wall)
	console.log("wall angle: " + angle)
	const cos = Math.cos(angle + (Math.PI / 2))
	const sin = Math.sin(angle + (Math.PI / 2))
	const offset = wallThickness / 2
	return [
		{x: wall.from.x - offset * cos, y: wall.from.y - offset * sin},
		{x: wall.from.x + offset * cos, y: wall.from.y + offset * sin},
		{x: wall.to.x + offset * cos, y: wall.to.y + offset * sin},
		{x: wall.to.x - offset * cos, y: wall.to.y - offset * sin}
	]
}

function fillWall(data: {[k: number]: number}, width: number, wall: Wall): void {
	let wallAngleValue = getWallAngle(wall)
	if(wallAngleValue === 0){
		wallAngleValue = 0.1
	}
	console.log(wall)
	fillRect(data, width, wallToRect(wall), encodeFloat(wallAngleValue, angleRange))
}

class IntLine {
	private readonly offset: number
	private readonly k: number
	private readonly lowY: number
	private readonly highY: number

	constructor(from: Point2D, to: Point2D) {
		const dx = from.x - to.x
		const dy = from.y - to.y
		this.k = dx / dy
		this.offset = from.x - (from.y * this.k)
		this.lowY = Math.floor(Math.min(from.y, to.y))
		this.highY = Math.floor(Math.max(from.y, to.y))
	}

	xByY(y: number): number | null {
		if(y < this.lowY || y > this.highY){
			return null
		}
		return Math.floor(this.offset + this.k * y)
	}
}

function fillRect(data: {[k: number]: number}, width: number, rect: Rect, value: number): void {
	let count = 0
	const minY = Math.floor(rect.map(({y}) => y).reduce((a, b) => Math.min(a, b), Number.MAX_SAFE_INTEGER))
	const maxY = Math.floor(rect.map(({y}) => y).reduce((a, b) => Math.max(a, b), 0))
	const lines = [
		new IntLine(rect[0], rect[1]),
		new IntLine(rect[1], rect[2]),
		new IntLine(rect[2], rect[3]),
		new IntLine(rect[3], rect[0])
	]
	let lineOffset = minY * width
	for(let y = minY; y <= maxY; y++){
		let minX = Number.MAX_SAFE_INTEGER
		let maxX = -Number.MAX_SAFE_INTEGER
		for(const line of lines){
			const x = line.xByY(y)
			if(x !== null){
				minX = Math.min(minX, x)
				maxX = Math.max(maxX, x)
			}
		}
		if(minX === Number.MAX_SAFE_INTEGER || maxX === -Number.MAX_SAFE_INTEGER){
			throw new Error(`Boundaries not found for y = ${y}! Rect is ${JSON.stringify(rect)}, minX = ${minX}, maxX = ${maxX}, lines are ${JSON.stringify(lines)}`)
		}
		for(let x = minX; x <= maxX; x++){
			count++
			data[lineOffset + x] = value
		}
		lineOffset += width
	}
	console.log(`Filled ${count} cells with ${value} (${JSON.stringify(rect)})`)
}

export function uploadWalls(gl: WebGL2RenderingContext, texture: DataTextureSingle, screenSize: {x: number, y: number}): void {
	const data = new Uint32Array(screenSize.x * screenSize.y) // TODO: experiment with smaller bit widths and smaller texture resolution
	walls.forEach(wall => {
		fillWall(data, screenSize.x, wall)
	})
	texture.upload(gl, data)
}