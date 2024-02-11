import {recordMetric, RhombusMetrics} from "./perfometer.as"
import {TriangleGrid} from "./triangle_grid.as"

const rightBit: u8 = 1
const bottomBit: u8 = 2
const leftBit: u8 = 4
const flipMarkBit: u8 = 8

export class RhombusRandomTiler {
	private flippableCount: i32 = 0

	constructor(private readonly grid: TriangleGrid, private readonly flipLimit: i32) {}

	private mbUpdateFlippability(index: i32): void {
		if(index === -1){
			return
		}
		const value = this.grid.values[index]
		const isFlippable = this.isFlippable(index)

		if(isFlippable && (value & flipMarkBit) === 0){
			this.flippableCount++
			this.grid.values[index] = value | flipMarkBit
			// console.log(`${this.grid.xOfIndex(index)}, ${this.grid.yOfIndex(index)} is now flippable`)
			return
		}

		if(!isFlippable && (value & flipMarkBit) !== 0){
			this.flippableCount--
			this.grid.values[index] = value & (~flipMarkBit)
			// console.log(`${this.grid.xOfIndex(index)}, ${this.grid.yOfIndex(index)} is no more flippable`)
		}
	}

	private isFlippable(index: i32): boolean {
		const value = this.grid.values[index]
		if((value & 7) === 7){
			// concave corner, always flippable
			return true
		}

		if((value & 7) !== 0){
			// not a corner at all
			return false
		}

		const left = this.grid.getBottomLeftOf(index)
		const leftIsSolid = left === -1 || (this.grid.values[left] & rightBit) !== 0
		if(!leftIsSolid){
			return false
		}

		const top = this.grid.getTopOf(index)
		const topIsSolid = top === -1 || (this.grid.values[top] & bottomBit) !== 0
		if(!topIsSolid){
			return false
		}

		const right = this.grid.getBottomRightOf(index)
		const rightIsSolid = right === -1 || (this.grid.values[right] & leftBit) !== 0
		if(!rightIsSolid){
			return false
		}

		return true
	}

	private updateNeighbours(index: i32): void {
		this.mbUpdateFlippability(this.grid.getTopLeftOf(index))
		this.mbUpdateFlippability(this.grid.getTopRightOf(index))
		this.mbUpdateFlippability(this.grid.getTopOf(index))
		this.mbUpdateFlippability(this.grid.getBottomLeftOf(index))
		this.mbUpdateFlippability(this.grid.getBottomRightOf(index))
		this.mbUpdateFlippability(this.grid.getBottomOf(index))
	}

	private mbFlipBitAt(index: i32, bit: u8): void {
		if(index === -1){
			return
		}

		// console.log(`Flipping ${bit} at ${this.grid.xOfIndex(index)}, ${this.grid.yOfIndex(index)}`)
		let value = this.grid.values[index]
		value = value & bit ? value & ~bit : value | bit
		this.grid.values[index] = value
	}

	private flipAt(index: i32): void {
		if(!this.isFlippable(index)){
			throw new Error(`Value ${this.grid.values[index]} at ${this.grid.xOfIndex(index)}, ${this.grid.yOfIndex(index)} is not flippable`)
		}
		// console.log(`Flipping at ${this.grid.xOfIndex(index)}, ${this.grid.yOfIndex(index)} (value: ${this.grid.values[index]})`)
		this.grid.values[index] = ((~this.grid.values[index]) & 7) | flipMarkBit

		this.mbFlipBitAt(this.grid.getBottomLeftOf(index), rightBit)
		this.mbFlipBitAt(this.grid.getTopOf(index), bottomBit)
		this.mbFlipBitAt(this.grid.getBottomRightOf(index), leftBit)

		this.updateNeighbours(index)
	}

	private findRandomFlippableIndex(): i32 {
		if(this.flippableCount === 0){
			throw new Error("No flip candidate")
		}
		let skips = i32(Math.random() * this.flippableCount)
		for(let i = 0; i < this.grid.values.length; i++){
			// TODO: optimize iteration
			if(this.grid.values[i] & flipMarkBit){
				if(skips === 0){
					// console.log(`Selected value ${this.grid.values[i]} at index ${i} (${this.grid.xOfIndex(i)}, ${this.grid.yOfIndex(i)})`)
					return i
				}
				skips--
			}
		}
		throw new Error("Flippable count is wrong")
	}

	private markFlippables(): void {
		for(let i = 0; i < this.grid.values.length; i++){
			if(this.grid.yOfIndex(i) >= this.grid.getHeightOfColumnAt(this.grid.xOfIndex(i))){
				continue
			}
			// if(this.isFlippable(i)){
			// 	console.log(`${this.grid.xOfIndex(i)}, ${this.grid.yOfIndex(i)} is initially flippable`)
			// }
			this.mbUpdateFlippability(i)
		}
	}

	run(): void {
		let t = performance.now()
		this.markFlippables()
		recordMetric(RhombusMetrics.prepare, performance.now() - t)
		for(let i = 0; i < this.flipLimit; i++){
			// console.log(`Step ${i}`)
			t = performance.now()
			const index = this.findRandomFlippableIndex()
			recordMetric(RhombusMetrics.findCandidate, performance.now() - t)

			t = performance.now()
			this.flipAt(index)
			recordMetric(RhombusMetrics.flip, performance.now() - t)
		}
	}
}