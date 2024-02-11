/** A container for bytes arranged in triangle pattern.
 * Columns are aligned; rows are not, each next row is offset by half.
 * Resulting pattern of values, if drawn on 2d plane, will generally look like 6-sided polygon (4-sided, if one of the dimensions is 1, etc)
 *
 * This class also contains utility related arithmetic functions.  */
export class TriangleGrid {
	private readonly xWidth: i32
	private readonly yHeight: i32
	/** X coord of column that has highest grid point */
	readonly topCornerColumnX: i32
	readonly values: Uint8Array
	readonly count: i32
	readonly colHeights: Int32Array

	constructor(
		private readonly length: i32, // left side distance
		private readonly width: i32, // right side distance
		private readonly height: i32, // top side distance
		compactValues: Uint8Array
	) {
		this.count = compactValues.length

		const xWidth: i32 = length + width - 1
		// TODO: don't round up here, it's supposed to be float. throw this prop away, it's confusing
		const yHeight: i32 = (xWidth + (xWidth & 1)) / 2 + height
		this.xWidth = xWidth
		this.yHeight = yHeight
		this.topCornerColumnX = length - 1

		// TODO: try aligning array height to power-of-two
		// this will allow index <---> coords conversion to be bitwise operations
		// and may possibly save a lot of time
		// TODO: also don't use yHeight, it's bigger than max column height we need here
		this.values = new Uint8Array(xWidth * yHeight)
		this.colHeights = new Int32Array(xWidth)

		for(let x = 0; x < this.colHeights.length; x++){
			this.colHeights[x] = this.getHeightOfColumnAt(x)
			// console.log(`Height of column at ${x} is ${this.colHeights[x]}`)
		}
		this.uncompact(compactValues)
	}

	private uncompact(compactValues: Uint8Array): void {
		let x = 0
		let colStart = 0
		let colEnd = this.getHeightOfColumnAt(x)
		for(let i = 0; i < compactValues.length; i++){
			if(i >= colEnd){
				x++
				colStart = colEnd
				colEnd += this.getHeightOfColumnAt(x)
			}
			this.values[this.indexOf(x, i - colStart)] = compactValues[i]
		}
		// console.log(this.values.join(","))
	}

	compact(): Uint8Array {
		const result = new Uint8Array(this.count)
		let x = 0
		let colStart = 0
		let colEnd = this.getHeightOfColumnAt(x)
		for(let i = 0; i < result.length; i++){
			if(i >= colEnd){
				x++
				colStart = colEnd
				colEnd += this.getHeightOfColumnAt(x)
			}
			result[i] = this.values[this.indexOf(x, i - colStart)]
		}
		return result
	}

	indexOf(x: i32, y: i32): i32 {
		return (x * this.yHeight) + y
	}

	xOfIndex(index: i32): i32 {
		return (index - (index % this.yHeight)) / this.yHeight
	}

	yOfIndex(index: i32): i32 {
		return index % this.yHeight
	}

	getHeightOfColumnAt(x: i32): i32 {
		let result = this.height
		if(x < this.length && x < this.width){
			result += x
		} else if((x < this.length) !== (x < this.width)){
			const minSide = this.length < this.width ? this.length : this.width
			result += minSide - 1
		} else {
			result += this.xWidth - 1 - x
		}
		return result
	}

	getCenterCornerIndex(): i32 {
		return this.indexOf(this.topCornerColumnX, this.height - 1)
	}

	// this method, and others, are just for arithmetics
	// if the coord requested is outside of the grid - result will be -1
	getTopLeftOf(index: i32): i32 {
		const x = this.xOfIndex(index)
		let y = this.yOfIndex(index)
		if(x <= this.topCornerColumnX){
			y--
		}
		return x === 0 || y < 0 ? -1 : this.indexOf(x - 1, y)
	}

	getBottomLeftOf(index: i32): i32 {
		const x = this.xOfIndex(index)
		let y = this.yOfIndex(index)
		if(x > this.topCornerColumnX){
			y++
		}
		return x === 0 || y === this.colHeights[x - 1] ? -1 : this.indexOf(x - 1, y)
	}

	getTopRightOf(index: i32): i32 {
		const x = this.xOfIndex(index)
		let y = this.yOfIndex(index)
		if(x >= this.topCornerColumnX){
			y--
		}
		return x === this.xWidth - 1 || y < 0 ? -1 : this.indexOf(x + 1, y)
	}

	getBottomRightOf(index: i32): i32 {
		const x = this.xOfIndex(index)
		let y = this.yOfIndex(index)
		if(x < this.topCornerColumnX){
			y++
		}
		return x === this.xWidth - 1 || y === this.colHeights[x + 1] ? -1 : this.indexOf(x + 1, y)
	}

	getTopOf(index: i32): i32 {
		return (index % this.yHeight) === 0 ? -1 : index - 1
	}

	getBottomOf(index: i32): i32 {
		const y = this.yOfIndex(index)
		return (y === this.colHeights[this.xOfIndex(index)] - 1) ? -1 : index + 1
	}
}