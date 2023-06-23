import {Bitmap} from "common/bitmap"
import {performeter} from "common/perfometer"

type WaveFunctionCollapseInput<T = unknown> = {
	/** The source sample, from which patterns will be extracted
	 * indexing: sourceSample[x][y]
	 * You MUST use same referencially-equal values to represent same logical values
	 * (that is, if you have two of the same cat in the source - they must both be represented by single instance)
	 * (this can only matter if you use objects or something like that as T)
	 * (otherwise it will screw up the pattern extraction) */
	sourceSample: T[][]
	patternSize: number
	resultSize: {height: number, width: number}
	flip: boolean
	rotate: boolean
	randomSeed: number
}

export function waveFunctionCollapse<T>(params: WaveFunctionCollapseInput<T>): T[][] {
	performeter.enterBlock("init stage")
	const {patterns, matrix} = init(params)
	performeter.exitEnterBlock("collapse stage")

	while(!matrix.isEverythingCollapsed()){
		performeter.enterBlock("search")
		const lowestEntropyPoint = matrix.findMinEntropyCell()
		if(!lowestEntropyPoint){
			throw new Error("No lowest entropy point!")
		}
		performeter.exitEnterBlock("collapse")
		matrix.collapse(lowestEntropyPoint)
		performeter.exitBlock()
	}

	const patternIndices = matrix.getResults()

	performeter.exitBlock()

	return patternIndices.map(row => row.map(patternIndex => {
		const pattern = patterns[patternIndex]!
		return pattern[0]![0]!
	}))
}

type XY = {x: number, y: number}
type PatternData<T = unknown> = readonly (readonly T[])[]
// Array(pattern index -> Map(encoded offset -> list of available pattern indices for that offset))
type Rules = Map<number, Bitmap>[]
type InitResult<T> = {
	matrix: Matrix
	offsets: XY[]
	patterns: PatternData<T>[]
	patternsFreq: number[]
	rules: Rules
	random(): number
}

/** Performs the initialization phase of the wfc algorithm, namely - aggregate the patterns from the input_examples image, calculate their frequencies and initiate the coefficient_matrix */
function init<T>(params: WaveFunctionCollapseInput<T>): InitResult<T> {
	const offsets = generateOffsets(params.patternSize)
	const [patterns, patternsFreq] = generatePatternsAndFrequences(params)
	const rules = getRules(patterns, offsets)
	const random = makeRandom(params.randomSeed)
	const matrix = new Matrix(params.resultSize.width, params.resultSize.height, patterns.length, random, rules, offsets, patternsFreq)
	// console.log("Rules: ", rules)
	return {offsets, patterns, patternsFreq, rules, matrix, random}
}

function getRules<T>(patterns: PatternData<T>[], offsets: XY[]): Rules {
	const result: Rules = new Array(patterns.length).fill(null).map(() => {
		const patternsByOffset = new Map<number, Bitmap>(offsets.map(offset => [encodeOffset(offset), new Bitmap(patterns.length)]))
		return patternsByOffset
	})
	// console.log("Patterns", patterns)

	for(const offset of offsets){
		const encodedOffset = encodeOffset(offset)
		// console.log(`Encoded offset (${offset.x}, ${offset.y}) as ${encodedOffset}`)
		const flipEncodedOffset = encodeOffset(flipOffset(offset))
		for(let aIndex = 0; aIndex < patterns.length; aIndex++){
			const a = patterns[aIndex]!
			for(let bIndex = aIndex; bIndex < patterns.length; bIndex++){
				const b = patterns[bIndex]!
				if(patternsHaveMatch(a, b, offset)){
					result[aIndex]!.get(encodedOffset)!.set(bIndex)
					result[bIndex]!.get(flipEncodedOffset)!.set(aIndex)
				}
			}
		}
	}

	return result
}

function patternsHaveMatch<T>(a: PatternData<T>, b: PatternData<T>, offset: XY): boolean {
	const patternSize = a.length
	const intersectionLengthX = patternSize - Math.abs(offset.x)
	const intersectionLengthY = patternSize - Math.abs(offset.y)

	const startXA = Math.min(Math.max(offset.x, 0), patternSize - intersectionLengthX)
	const startYA = Math.min(Math.max(offset.y, 0), patternSize - intersectionLengthY)
	const startXB = Math.min(Math.max(-offset.x, 0), patternSize - intersectionLengthX)
	const startYB = Math.min(Math.max(-offset.y, 0), patternSize - intersectionLengthY)

	for(let dx = 0; dx < intersectionLengthX; dx++){
		for(let dy = 0; dy < intersectionLengthY; dy++){
			if(a[startXA + dx]![startYA + dy] !== b[startXB + dx]![startYB + dy]){
				return false
			}
		}
	}
	return true
}

function flipOffset(offset: XY): XY {
	return {x: -offset.x, y: -offset.y}
}

/** Get the coordinates around a pattern.
 * This function returns a list of all coordinates around a pattern of given size, starting from the top left and ending at the bottom right. The center point (0, 0) is excluded from the list. */
function generateOffsets(patternSize: number): XY[] {
	const result: XY[] = []
	for(let x = -patternSize + 1; x < patternSize; x++){
		for(let y = -patternSize + 1; y < patternSize; y++){
			if(x === 0 && y === 0){
				continue
			}
			result.push({x, y})
		}
	}
	return result
}

function encodeOffset(offset: XY): number {
	return Math.abs(offset.x) << 18 | Math.abs(offset.y) << 2 | (offset.y < 0 ? 0x1 : 0) | (offset.x < 0 ? 0x2 : 0)
}

function encodePosition(position: XY): number {
	return position.x << 16 | position.y
}

function decodePosition(position: number): XY {
	return {
		x: (position >> 16) & 0xffff,
		y: position & 0xffff
	}
}

function normalizeArray(input: number[]): number[] {
	const sum = input.reduce((a, b) => a + b, 0)
	return input.map(x => x / sum)
}

function generatePatternsAndFrequences<T>(params: WaveFunctionCollapseInput<T>): [PatternData<T>[], number[]] {
	let patterns = getPatternDataFromSource(params)

	const hashMap = new Map<number, (PatternData<T> | null)[]>()
	const hasher = new PatternHasher(params.sourceSample)
	for(const pattern of patterns){
		const hash = hasher.hash(pattern)
		let arr = hashMap.get(hash)
		if(!arr){
			arr = []
			hashMap.set(hash, arr)
		}
		arr.push(pattern)
	}

	const freqMap = new Map<PatternData<T>, number>()
	for(const patterns of hashMap.values()){
		for(let i = 0; i < patterns.length; i++){
			const pattern = patterns[i]
			if(!pattern){
				continue
			}
			let count = 0
			for(let j = 0; j < patterns.length; j++){
				const otherPattern = patterns[j]
				if(!otherPattern){
					continue
				}
				if(patternsAreEqual(pattern, otherPattern)){
					patterns[j] = null
				}
				count++
			}
			freqMap.set(pattern, count)
		}
	}
	patterns = [...freqMap.keys()]

	const freqs: number[] = []
	for(const pattern of patterns){
		freqs.push(freqMap.get(pattern)!)
	}
	return [patterns, normalizeArray(freqs)]
}

function patternsAreEqual<T>(a: PatternData<T>, b: PatternData<T>): boolean {
	for(let x = 0; x < a.length; x++){
		const aRow = a[x]!
		const bRow = b[x]!
		for(let y = 0; y < aRow.length; y++){
			if(aRow[y] !== bRow[y]){
				return false
			}
		}
	}
	return true
}

/** Class that is able to take fast (non-secure) hash from a pattern */
class PatternHasher<T> {

	private readonly valueIndices: Map<T, number> = new Map()

	constructor(source: WaveFunctionCollapseInput<T>["sourceSample"]) {
		const allPossibleValues = [...new Set(flatten(source))]
		for(let i = 0; i < allPossibleValues.length; i++){
			this.valueIndices.set(allPossibleValues[i]!, i)
		}
	}

	hash(pattern: PatternData<T>): number {
		let hash = 0

		for(let x = 0; x < pattern.length; x++){
			const row = pattern[x]!
			for(let y = 0; y < row.length; y++){
				const item = row[y]!
				const itemIndex = this.valueIndices.get(item)!
				hash = ((hash << 5) - hash + (itemIndex * x * y)) | 0
			}
		}

		return hash
	}
}

function flatten<T>(arr: readonly (readonly T[])[]): T[] {
	const result: T[] = []
	for(const row of arr){
		result.push(...row)
	}
	return result
}

function getPatternDataFromSource<T>(params: WaveFunctionCollapseInput<T>): PatternData<T>[] {
	let patterns: PatternData<T>[] = []
	for(let x = 0; x < params.sourceSample.length - params.patternSize + 1; x++){
		const row = params.sourceSample[x]!
		for(let y = 0; y < row.length - params.patternSize + 1; y++){
			patterns.push(extractSourcePatternAt(params.sourceSample, x, y, params.patternSize))
		}
	}

	if(params.flip){
		const flipped: PatternData<T>[] = []
		for(const axis of ["x", "y"] as const){
			for(const pattern of patterns){
				flipped.push(flipPattern(pattern, axis))
			}
		}
		patterns = [...patterns, ...flipped]
	}

	if(params.rotate){
		const rotated: PatternData<T>[] = []
		for(const count of [1, 2, 3] as const){
			for(const pattern of patterns){
				rotated.push(rotatePattern(pattern, count))
			}
		}
		patterns = [...patterns, ...rotated]
	}

	return patterns
}

function extractSourcePatternAt<T>(source: WaveFunctionCollapseInput<T>["sourceSample"], x: number, y: number, size: number): PatternData<T> {
	const result: T[][] = []
	for(let dx = 0; dx < size; dx++){
		const row = source[x + dx]!
		result.push(row.slice(y, y + size))
	}
	return result
}

function copyPattern<T>(pattern: PatternData<T>): T[][] {
	const result: T[][] = []
	for(let x = 0; x < pattern.length; x++){
		result.push([...pattern[x]!])
	}
	return result
}

function flipPattern<T>(pattern: PatternData<T>, axis: "x" | "y"): PatternData<T> {
	const res = copyPattern(pattern)
	const halfLen = Math.floor(pattern.length / 2)
	if(axis === "x"){
		for(let dx = 0; dx < halfLen; dx++){
			const rowA = res[dx]!
			const rowB = res[res.length - dx - 1]!
			for(let y = 0; y < rowA.length; y++){
				const tmp = rowA[y]!
				rowA[y] = rowB[y]!
				rowB[y] = tmp
			}
		}
	} else {
		for(let x = 0; x < pattern.length; x++){
			const row = res[x]!
			for(let dy = 0; dy < halfLen; dy++){
				const tmp = row[dy]!
				row[dy] = row[row.length - dy - 1]!
				row[row.length - dy - 1] = tmp
			}
		}
	}
	return res
}

function rotatePattern<T>(pattern: PatternData<T>, times: 1 | 2 | 3): PatternData<T> {
	const res = copyPattern(pattern)
	const size = pattern.length
	const halfSize = Math.floor(size / 2)
	for(let i = 0; i < times; i++){
		for(let circleOffset = 0; circleOffset < halfSize; circleOffset++){
			const lastPos = size - circleOffset - 1
			for(let posOffset = circleOffset; posOffset < size - circleOffset - 1; posOffset++){
				const tmp = res[posOffset]![circleOffset]!
				res[posOffset]![circleOffset] = res[lastPos]![posOffset]!
				res[lastPos]![posOffset] = res[size - posOffset - 1]![lastPos]!
				res[size - posOffset - 1]![lastPos] = res[circleOffset]![size - posOffset - 1]!
				res[circleOffset]![size - posOffset - 1] = tmp
			}
		}
	}
	return res
}

class Matrix {
	private readonly entropy: number[]
	private readonly matrix: Bitmap
	private readonly collapseMask: Bitmap
	private readonly patternCount: number
	private incollapsedCellsCount: number

	constructor(
		private readonly width: number,
		private readonly height: number,
		patternCount: number,
		private readonly random: () => number,
		private readonly rules: Rules,
		private readonly offsets: XY[],
		private readonly freqs: number[]
	) {
		this.patternCount = Math.ceil(patternCount / 8) * 8
		this.entropy = new Array(width * height).fill(1)
		this.matrix = new Bitmap(width * height * this.patternCount)
		this.collapseMask = new Bitmap(width * height)
		this.incollapsedCellsCount = width * height

		this.matrix.setAll()
		const paddingPatternCount = this.patternCount - patternCount
		for(let i = 0; i < width * height; i++){
			const cellEnd = ((i + 1) * this.patternCount) - 1
			for(let offset = 0; offset < paddingPatternCount; offset++){
				this.matrix.clear(cellEnd - offset)
			}
		}
	}

	isEverythingCollapsed(): boolean {
		return this.incollapsedCellsCount === 0
	}

	findMinEntropyCell(): XY | null {
		let minEntropy = Number.MAX_SAFE_INTEGER
		const cells: number[] = []
		for(let i = 0; i < this.entropy.length; i++){
			if(this.collapseMask.get(i)){
				continue
			}
			const entropy = this.entropy[i]!
			if(entropy < minEntropy){
				cells.length = 0
				minEntropy = entropy
			}
			if(entropy === minEntropy){
				cells.push(i)
			}
		}
		if(cells.length === 0){
			return null
		}

		// console.log(`Lowest entropy cells are at ${minEntropy}: `, cells.map(index => ({x: index % this.width, y: Math.floor(index / this.width)})))

		const index = cells.length === 1 ? cells[0]! : cells[Math.floor(this.random() * cells.length)]!
		return {x: index % this.width, y: Math.floor(index / this.width)}
	}

	collapse(cell: XY): void {
		performeter.enterBlock("collapse-set")
		// console.log(`Collapsing at (${cell.x}, ${cell.y}): \n${this}`)
		const cellIndex = cell.y * this.width + cell.x
		const availableValues = this.matrix.getOffsetsAsNumbers(cellIndex * this.patternCount, this.patternCount)
		if(availableValues.length === 0){
			// should be caught on propagate stage tbh
			throw new Error(`Cell at (${cell.x}, ${cell.y}) don't have available values`)
		}
		this.collapseMask.set(cellIndex)
		this.incollapsedCellsCount--
		if(availableValues.length === 1){
			performeter.exitBlock()
			return // it's already kinda collapsed, no action required
		}
		const selectedValue = availableValues[Math.floor(this.random() * availableValues.length)]!
		// console.log("Selected value: " + selectedValue)
		// console.log(ruleToString(this.rules[selectedValue]!))
		for(const value of availableValues){
			if(value === selectedValue){
				continue
			}
			this.matrix.clear(cellIndex * this.patternCount + value)
		}
		this.entropy[cellIndex] = 0
		performeter.exitEnterBlock("propagate")
		this.propagateStartingAt(cell)
		performeter.exitBlock()
	}

	private isInBounds(coords: XY): boolean {
		return coords.x >= 0 && coords.y >= 0 && coords.x < this.width && coords.y < this.height
	}

	private propagateStartingAt(cell: XY): void {
		const queue = new SetQueue<number>()
		queue.enqueue(encodePosition(cell))

		while(true){
			const origCellEncoded = queue.dequeue()
			if(origCellEncoded === undefined || origCellEncoded === null){
				break
			}
			const origCell = decodePosition(origCellEncoded)
			// console.log(`Propagating at (${origCell.x}, ${origCell.y})`)

			for(const offset of this.offsets){
				const adjacentCellPos = {x: origCell.x + offset.x, y: origCell.y + offset.y}
				if(!this.isInBounds(adjacentCellPos)){
					continue
				}
				const adjacentCellIndex = adjacentCellPos.y * this.width + adjacentCellPos.x
				if(this.collapseMask.get(adjacentCellIndex)){
					continue
				}

				const changed = this.propagateToCellByOffset(origCell, offset)
				if(changed){
					queue.enqueue(encodePosition(adjacentCellPos))
				}
			}
		}
	}

	private propagateToCellByOffset(origCell: XY, offset: XY): boolean {
		// TODO: optimise here
		performeter.enterBlock("assemble_pattern")
		const encodedOffset = encodeOffset(offset)
		const origCellIndex = origCell.y * this.width + origCell.x
		performeter.enterBlock("get offsets")
		const origCellPatterns = this.matrix.getOffsetsAsNumbers(origCellIndex * this.patternCount, this.patternCount)
		performeter.exitEnterBlock("OR pattern")
		const resultTargetCellPatterns = new Bitmap(this.patternCount)
		for(const origPattern of origCellPatterns){
			const patternsByRule = this.rules[origPattern]!.get(encodedOffset)!
			resultTargetCellPatterns.orFromTheStart(patternsByRule)
		}
		performeter.exitBlock()

		performeter.exitEnterBlock("apply_pattern")
		const targetCell = {x: origCell.x + offset.x, y: origCell.y + offset.y}
		const targetCellIndex = targetCell.y * this.width + targetCell.x
		const hasChange = this.matrix.and(resultTargetCellPatterns, targetCellIndex * this.patternCount)
		if(hasChange){
			this.entropy[targetCellIndex] = this.matrix.getOffsetsAsNumbers(targetCellIndex * this.patternCount, this.patternCount)
				.map(pattern => this.freqs[pattern]!)
				.reduce((a, b) => a + b, 0)
		}
		performeter.exitBlock()
		return hasChange
	}

	getResults(): number[][] {
		const result: number[][] = []
		for(let x = 0; x < this.width; x++){
			const row: number[] = []
			result.push(row)
			for(let y = 0; y < this.height; y++){
				const index = y * this.width + x
				const patterns = this.matrix.getOffsetsAsNumbers(index * this.patternCount, this.patternCount)
				row.push(patterns[0]!)
			}
		}
		return result
	}

	toString(): string {
		let longestCellLen = 0
		const result: string[][] = []
		for(let y = 0; y < this.height; y++){
			const row: string[] = []
			result.push(row)
			for(let x = 0; x < this.width; x++){
				const index = y * this.width + x
				const patterns = this.matrix.getOffsetsAsNumbers(index * this.patternCount, this.patternCount)
				const str = shortenNumberSpan(patterns)
				row.push(str)
				longestCellLen = Math.max(longestCellLen, str.length)
			}
		}
		return result.map(row => row.map(cell => whitePad(cell, longestCellLen)).join(" | ")).join("\n")
	}

}

function whitePad(str: string, len: number): string {
	while(str.length < len){
		str += " "
	}
	return str
}

function makeRandom(seed: number): () => number {
	seed ^= 0xDEADBEEF
	// Pad seed with Phi, Pi and E.
	// https://en.wikipedia.org/wiki/Nothing-up-my-sleeve_number
	const rand = sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, seed)
	for(let i = 0; i < 15; i++){
		rand()
	}
	return rand
}

function sfc32(a: number, b: number, c: number, d: number) {
	return function() {
		a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0
		let t = (a + b) | 0
		a = b ^ b >>> 9
		b = c + (c << 3) | 0
		c = (c << 21 | c >>> 11)
		d = d + 1 | 0
		t = t + d | 0
		c = c + t | 0
		return (t >>> 0) / 4294967296
	}
}

class SetQueue<T> {
	private readonly set = new Set<T>()
	private readonly queue: (T | null)[] = []
	private pos = 0

	enqueue(value: T): boolean {
		if(this.set.has(value)){
			return false
		}
		this.set.add(value)
		this.queue.push(value)
		return true
	}

	dequeue(): T | null | undefined {
		const result = this.queue[this.pos]
		this.queue[this.pos] = null
		if(this.queue.length > this.pos){
			this.set.delete(result!)
			this.pos++
		}
		return result
	}
}

/** Format sequence of numbers in a shorter manner, compressing sequental spans into from-to format */
function shortenNumberSpan(nums: number[]): string {
	return joinSpans(nums, (a, b) => a + 1 === b).map(span => {
		const first = span[0]!
		const last = span[span.length - 1]!
		if(first === last){
			return first + ""
		} else if(first + 1 === last){
			return first + "," + last
		} else {
			return first + "-" + last
		}
	}).join(",")
}

function joinSpans<T>(values: T[], shouldJoin: (a: T, b: T) => boolean): T[][] {
	const result: T[][] = []
	if(values.length === 0){
		return result
	}
	let currentSpan: T[] = [values[0]!]
	result.push(currentSpan)

	for(let i = 1; i < values.length; i++){
		const v = values[i]!
		if(shouldJoin(currentSpan[currentSpan.length - 1]!, v)){
			currentSpan.push(v)
		} else {
			currentSpan = [v]
			result.push(currentSpan)
		}
	}

	return result
}