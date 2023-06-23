/** An optimized array of bits (booleans) */
export class Bitmap {
	private readonly arr: Uint8Array
	constructor(readonly size: number) {
		if(size < 0){
			throw new Error(`Expected non-negative as size, got ${size}`)
		}

		if(size % 8){
			size = Math.ceil(size / 8) * 8
		}

		this.arr = new Uint8Array(size >> 3)
	}

	/** Set bit at selected index to 1 */
	set(index: number): void {
		const arr = this.arr
		const byteIndex = index >> 3
		arr[byteIndex] = arr[byteIndex]! | (1 << (index & 0b111))
	}

	/** Set bit at selected index to 0 */
	clear(index: number): void {
		const arr = this.arr
		const byteIndex = index >> 3
		arr[byteIndex] = arr[byteIndex]! & (~(1 << (index & 0b111)))
	}

	/** Get value of bit at index */
	get(index: number): boolean {
		return (this.arr[index >> 3]! & (1 << (index & 0b111))) !== 0
	}

	/** Set value of all the bits to 1 */
	setAll(): void {
		this.arr.fill(0xff)
	}

	/** Set value of all the bits to 0 */
	clearAll(): void {
		this.arr.fill(0)
	}

	/** @returns sorted array of offsets within [start, start + length] */
	getOffsetsAsNumbers(start: number, length: number): number[] {
		if(start & 0x7 || length & 0x7){
			throw new Error("Assertion failed, only byte-aligned start/length is supported")
		}
		const result: number[] = []
		let i = 0
		for(let byteOffset = 0; byteOffset < (length >> 3); byteOffset++){
			const byte = this.arr[(start >> 3) + byteOffset]!
			let mask = 0x1
			while(mask !== 0x100){
				if(byte & mask){
					result.push(i)
				}
				i++
				mask <<= 1
			}
		}
		return result
	}

	/** Sets to 1 every offset that is present in array of offsets and to 0 everything else
	 * @param offsets sorted array of offsets
	 * @returns if anything was changed */
	setOffsetsByNumbers(start: number, length: number, offsets: number[]): boolean {
		if(start & 0x7 || length & 0x7){
			throw new Error("Assertion failed, only byte-aligned start/length is supported")
		}
		let hasChange = false
		let offset = 0
		let offsetIndex = 0
		let nextNonzeroOffset = offsets[offsetIndex]
		for(let byteOffset = 0; byteOffset < (length >> 3); byteOffset++){
			const origByte = this.arr[(start >> 3) + byteOffset]!
			let byte = 0
			let mask = 0x1
			while(mask !== 0x100){
				const bit = offset === nextNonzeroOffset ? mask : 0
				hasChange = hasChange || (origByte & mask) !== bit
				if(bit){
					byte |= mask
					offsetIndex++
					nextNonzeroOffset = offsets[offsetIndex]
				}
				offset++
				mask <<= 1
			}
			this.arr[(start >> 3) + byteOffset] = byte
		}
		return hasChange
	}

	/** Applies bitwise-and operation to this bitmap; saves result in this bitmap
	 * Expecting other bitmap to be smaller than this one
	 * @returns if this bitmap was changed
	 */
	and(other: Bitmap, startThis: number): boolean {
		if(startThis & 0x7){
			throw new Error("Assertion failed, only byte-aligned start/length is supported")
		}
		let hasChange = false
		for(let byteOffset = 0; byteOffset < other.arr.length; byteOffset++){
			const thisByte = this.arr[(startThis >> 3) + byteOffset]!
			const otherByte = other.arr[byteOffset]!
			const result = thisByte & otherByte
			hasChange = hasChange || (result !== thisByte)
			this.arr[(startThis >> 3) + byteOffset] = result
		}
		return hasChange
	}

	orFromTheStart(other: Bitmap): void {
		if(other.arr.length > this.arr.length){
			throw new Error("Assertion failed, lengths are not equal")
		}
		for(let byteOffset = 0; byteOffset < other.arr.length; byteOffset++){
			this.arr[byteOffset] = this.arr[byteOffset]! | other.arr[byteOffset]!
		}
	}

}