import {Queue} from "common/queue"

interface Props<T> {
	readonly length: number // left side distance
	readonly width: number // right side distance
	readonly height: number // top side distance
	readonly defaultValue: T
}

export interface XY {
	readonly x: number
	readonly y: number
}

export const encodeXY = (xy: XY): number => (xy.y << 0x10) | xy.x
export const decodeXY = (key: number): XY => ({x: key & 0xffff, y: (key >> 0x10)})

/** A container for values arranged in triangle pattern.
 * Columns are aligned, each next row is offset by half.
 * Resulting pattern of values, if drawn on 2d plane, will generally look like 6-sided polygon (4-sided, if one of the dimensions is 1, etc)
 *
 * This class also contains utility related arithmetic functions.  */
export class TriangleGrid<T> {

	/** Amount of columns in the grid */
	readonly xWidth: number
	/** Difference of Y coord between lowest and highest point of grid, in cells.
	 * May be fractional (because half-cell distance is possible in triangle grid). */
	readonly yHeight: number
	/** Count of elements in the grid. */
	readonly count: number
	/** X coord of column that has highest grid point */
	readonly topCornerColumnX: number
	private readonly values: T[][]

	constructor(private readonly props: Props<T>) {
		if(props.width < 1 || props.height < 1 || props.length < 1 || props.width % 1 || props.height % 1 || props.length % 1){
			throw new Error(`Incorrect grid dimensions: ${props.length} x ${props.width} x ${props.height}`)
		}
		this.xWidth = props.length + props.width - 1
		this.yHeight = (this.xWidth / 2) + props.height
		this.topCornerColumnX = this.props.length - 1
		this.count = TriangleGrid.getCount(this.props.length, this.props.width, this.props.height)
		this.values = new Array(this.xWidth)
			.fill(null)
			.map((_, x) => new Array(this.getHeightOfColumnAt(x))
				.fill(null)
				.map(() => props.defaultValue)
			)
	}

	static getCount(length: number, width: number, height: number): number {
		let result = 0
		const xWidth = length + width - 1
		for(let x = 0; x < xWidth; x++){
			result += this.getHeightOfColumnAt(length, width, height, x)
		}
		return result
	}

	static getHeightOfColumnAt(length: number, width: number, height: number, x: number): number {
		let result = height
		if(x < length && x < width){
			result += x
		} else if((x < length) !== (x < width)){
			result += Math.min(length, width) - 1
		} else {
			result += (length + width - 1) - 1 - x
		}
		return result
	}

	getHeightOfColumnAt(x: number): number {
		return TriangleGrid.getHeightOfColumnAt(this.props.length, this.props.width, this.props.height, x)
	}

	* [Symbol.iterator](): IterableIterator<{x: number, y: number, value: T}> {
		for(let x = 0; x < this.values.length; x++){
			const col = this.values[x]!
			for(let y = 0; y < col.length; y++){
				yield{x, y, value: col[y]!}
			}
		}
	}

	/** @returns difference between y coord of highest point of the whole rhombus and y coords the highest point in this column, in cells */
	getVerticalOffset(x: number): number {
		const topPointX = this.props.length - 1
		return Math.abs(topPointX - x) / 2
	}

	getCenterCornerCoords(): XY {
		return {
			x: this.topCornerColumnX,
			y: this.props.height - 1
		}
	}

	getTopCornerCoords(): XY {
		return {
			x: this.topCornerColumnX,
			y: 0
		}
	}

	getLeftBottomCornerCoords(): XY {
		return {
			x: 0,
			y: this.values[0]!.length - 1
		}
	}

	getRightBottomCornerCoords(): XY {
		return {
			x: this.values.length - 1,
			y: this.values[this.values.length - 1]!.length - 1
		}
	}

	/** @returns true if coords are within the grid */
	isCoordValid(coords: XY): boolean {
		if(coords.x < 0 || coords.y < 0){
			return false
		}
		const col = this.values[coords.x]
		return !!col && col.length > coords.y
	}

	private throwOnInvalidCoords(coords: XY): void {
		if(!this.isCoordValid(coords)){
			throw new Error(`Asked for value at ${coords.x}, ${coords.y}, but container only has ${this.values.length} columns, and this column ${this.values.length > coords.x ? `contains only ${this.values[coords.x]!.length} rows` : "does not exist"}.`)
		}
	}

	get(coords: XY): T {
		this.throwOnInvalidCoords(coords)
		return this.values[coords.x]![coords.y]!
	}

	set(coords: XY, value: T): void {
		this.values[coords.x]![coords.y] = value
	}

	// this method, and others, are just for arithmetics
	// they can return a coord that is out of this grid
	// use areCoordsValid() to check if this is the case
	getTopLeftOf({x, y}: XY): XY {
		return {x: x - 1, y: x <= this.topCornerColumnX ? y - 1 : y}
	}

	getBottomLeftOf({x, y}: XY): XY {
		return {x: x - 1, y: x <= this.topCornerColumnX ? y : y + 1}
	}

	getTopRightOf({x, y}: XY): XY {
		return {x: x + 1, y: x < this.topCornerColumnX ? y : y - 1}
	}

	getBottomRightOf({x, y}: XY): XY {
		return {x: x + 1, y: x < this.topCornerColumnX ? y + 1 : y}
	}

	getTopOf({x, y}: XY): XY {
		return {x, y: y - 1}
	}

	getBottomOf({x, y}: XY): XY {
		return {x, y: y + 1}
	}

	getValidNeighbourCoords(xy: XY): XY[] {
		return [
			this.getTopOf(xy),
			this.getBottomOf(xy),
			this.getTopLeftOf(xy),
			this.getTopRightOf(xy),
			this.getBottomLeftOf(xy),
			this.getBottomRightOf(xy)
		].filter(xy => this.isCoordValid(xy))
	}

	/** Starting at startingPoint, get next points from explorer; explore while there are points to explore.
	 * Each point is visited only once. */
	exploreFrom(startingPoint: XY, explore: (xy: XY) => XY[]): void {
		const queue = new Queue<XY>()
		const processed = new Set<number>()

		let next: XY | undefined = startingPoint
		while(next){
			const points = explore(next)
			for(const xy of points){
				if(!this.isCoordValid(xy)){
					continue
				}
				const key = encodeXY(xy)
				if(!processed.has(key)){
					processed.add(key)
					queue.enqueue(xy)
				}
			}

			next = queue.maybeDequeue()
		}
	}

}