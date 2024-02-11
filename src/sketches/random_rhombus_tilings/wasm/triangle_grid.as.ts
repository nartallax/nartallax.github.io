/** A container for bytes arranged in triangle pattern.
 * Columns are aligned; rows are not, each next row is offset by half.
 * Resulting pattern of values, if drawn on 2d plane, will generally look like 6-sided polygon (4-sided, if one of the dimensions is 1, etc)
 *
 * This class also contains utility related arithmetic functions.  */
export class TriangleGrid {
	private readonly arrayWidth: i32
	private readonly arrayHeight: i32
	/** X coord of column that has highest grid point */
	readonly topCornerColumnX: i32
	readonly values: Uint8Array
	readonly count: i32
	readonly colHeights: Int32Array
	private readonly hPow: i32

	constructor(
		private readonly length: i32, // left side distance
		private readonly width: i32, // right side distance
		private readonly height: i32, // top side distance
		compactValues: Uint8Array
	) {
		this.count = compactValues.length

		const arrayWidth: i32 = length + width - 1
		let arrayHeight = height + (length < width ? length : width) - 1
		const hPow = i32(Math.ceil(Math.log2(arrayHeight)))
		arrayHeight = 2 ** hPow
		this.hPow = hPow
		this.arrayWidth = arrayWidth
		this.arrayHeight = arrayHeight
		this.topCornerColumnX = length - 1

		this.values = new Uint8Array(arrayWidth * arrayHeight)
		this.colHeights = new Int32Array(arrayWidth)

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
		return (x << this.hPow) | y
	}

	xOfIndex(index: i32): i32 {
		return index >> this.hPow
	}

	yOfIndex(index: i32): i32 {
		return index & ((1 << this.hPow) - 1)
	}

	getHeightOfColumnAt(x: i32): i32 {
		let result = this.height
		if(x < this.length && x < this.width){
			result += x
		} else if((x < this.length) !== (x < this.width)){
			const minSide = this.length < this.width ? this.length : this.width
			result += minSide - 1
		} else {
			result += this.arrayWidth - 1 - x
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
		return x === this.arrayWidth - 1 || y < 0 ? -1 : this.indexOf(x + 1, y)
	}

	getBottomRightOf(index: i32): i32 {
		const x = this.xOfIndex(index)
		let y = this.yOfIndex(index)
		if(x < this.topCornerColumnX){
			y++
		}
		return x === this.arrayWidth - 1 || y === this.colHeights[x + 1] ? -1 : this.indexOf(x + 1, y)
	}

	getTopOf(index: i32): i32 {
		return this.yOfIndex(index) === 0 ? -1 : index - 1
	}

	getBottomOf(index: i32): i32 {
		const y = this.yOfIndex(index)
		return (y >= this.colHeights[this.xOfIndex(index)] - 1) ? -1 : index + 1
	}
}