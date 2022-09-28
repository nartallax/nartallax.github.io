interface Rect {
	readonly x: number
	readonly y: number
	readonly w: number
	readonly h: number
}

interface Span {
	readonly a: number
	readonly b: number
}

/** A collection of rectangles.
 * Can return set of rectangles that occupy the same area, but don't intersect.
 * (useful in the case when you need to drop intersections) */
export class RectanlgeDeduplicator {

	private readonly rects: Rect[] = []

	add(rect: Rect): void {
		this.rects.push(rect)
	}

	clear(): void {
		this.rects.length = 0
	}

	* getNonIntersectingRects(): IterableIterator<Rect> {
		for(let lump of this.groupByLumps()){
			let splitResult = [...this.splitLump(lump)]
			yield* dropDuplicates(splitResult)
		}
	}

	/** Packs rectangles into groups.
	 * Rectangles in different groups never intersect.
	 * Rectangles in same group has common area (maybe not directly, but through another rectangle) */
	private* groupByLumps(): IterableIterator<Rect[]> {
		for(let vLump of groupByCond(this.rects, intersectionCondition("y", "h"))){
			yield* groupByCond(vLump, intersectionCondition("x", "w"))
		}
	}

	private* splitLump(lump: Rect[]): IterableIterator<Rect> {
		let hBounds = findBoundaries(lump, "x", "w")
		let vBounds = findBoundaries(lump, "y", "h")
		for(let rect of lump){
			for(let vRect of splitRectByBoundaries(rect, hBounds, "x", "w")){
				yield* splitRectByBoundaries(vRect, vBounds, "y", "h")
			}
		}
	}


}

function* groupByCond<T, G>(values: T[], condition: (a: T, b: T, g: G | null) => G | null): IterableIterator<T[]> {
	if(values.length === 0){
		return
	}

	let prev = values[0]!
	let pack = [prev]
	let groupData: G | null = null
	for(let i = 1; i < values.length; i++){
		let cur = values[i]!
		groupData = condition(prev, cur, groupData)
		if(groupData){
			pack.push(cur)
		} else {
			yield pack
			pack = [cur]
		}
		prev = cur
	}
	yield pack
}

function intersectionCondition(coordField: "x" | "y", sizeField: "w" | "h"): (a: Rect, b: Rect, span: Span | null) => Span | null {
	return (a, b, span) => {
		let spanStart = span ? span.a : a[coordField]
		let spanEnd = span ? span.b : a[coordField] + a[sizeField]
		if(b[coordField] + b[sizeField] < spanStart || b[coordField] > spanEnd){
			return null
		} else {
			return {
				a: Math.min(spanStart, b[coordField]),
				b: Math.max(spanEnd, b[coordField] + b[sizeField])
			}
		}
	}
}

/** Returns sorted array of starts and ends of rectangles in a dimension
 * Duplicates are possible! */
function findBoundaries(rects: Rect[], coordField: "x" | "y", sizeField: "w" | "h"): number[] {
	let result = [] as number[]

	for(let i = 0; i < rects.length; i++){
		let rect = rects[i]!
		let coord = rect[coordField]
		result.push(coord, coord + rect[sizeField])
	}

	return result.sort((a, b) => a - b)
}

/** Split rectangle by horisontal/vertical boundary, making more rectangles
 * Assumes boundaries are sorted */
function* splitRectByBoundaries(rect: Rect, boundaries: number[], coordField: "x" | "y", sizeField: "w" | "h"): IterableIterator<Rect> {
	let prevBound = boundaries[0]!
	for(let j = 1; j < boundaries.length; j++){
		let curBound = boundaries[j]!
		if(curBound === prevBound){
			continue
		}
		let coord = rect[coordField]
		if(prevBound < coord){
			if(curBound > coord){
				yield{
					...rect,
					[sizeField]: curBound - coord
				}
			}
		} else {
			let size = rect[sizeField]
			if(curBound < coord + size){
				yield{
					...rect,
					[coordField]: prevBound,
					[sizeField]: curBound - prevBound
				}
			} else {
				yield{
					...rect,
					[coordField]: prevBound,
					[sizeField]: coord + size - prevBound
				}
				break
			}
		}
		prevBound = curBound
	}
}

function* dropDuplicates(rects: Rect[]): IterableIterator<Rect> {
	if(rects.length < 1){
		return
	}

	rects = rects.sort((a, b) => (a.x - b.x) || (a.y - b.y))
	let prevRect = rects[0]
	yield prevRect
	if(rects.length < 2){
		return
	}

	for(let i = 1; i < rects.length; i++){
		let rect = rects[i]
		if(rect.x === prevRect.x && rect.y === prevRect.y && rect.h === prevRect.h && rect.w === prevRect.w){
			continue
		}
		yield rect
		prevRect = rect
	}
}