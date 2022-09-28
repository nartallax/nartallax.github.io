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
		let arr = this.arr
		let byteIndex = index >> 3
		arr[byteIndex] = arr[byteIndex]! | (1 << (index & 0b111))
	}

	/** Set bit at selected index to 0 */
	clear(index: number): void {
		let arr = this.arr
		let byteIndex = index >> 3
		arr[byteIndex] = arr[byteIndex]! & (~(1 << (index & 0b111)))
	}

	/** Get value of bit at index */
	get(index: number): boolean {
		return (this.arr[index >> 3] & (1 << (index & 0b111))) !== 0
	}

	/** Set value of all the bits to 1 */
	setAll(): void {
		for(let i = 0; i < this.arr.length; i++){
			this.arr[i] = 0xff
		}
	}

	/** Set value of all the bits to 0 */
	clearAll(): void {
		for(let i = 0; i < this.arr.length; i++){
			this.arr[i] = 0
		}
	}

}