import {performeter} from "common/perfometer"
import {decodeXY, encodeXY, TriangleGrid, XY} from "sketches/random_rhombus_tilings/triangle_grid"

// this all is very inoptimal, and can be stored in a few bits
// but whatever, it's not heavy enough to lag anyway
export interface TriangleGridRhombusNode {
	readonly leftIsSolid: boolean
	readonly rightIsSolid: boolean
	readonly bottomIsSolid: boolean
}

export type RhombusGrid = TriangleGrid<TriangleGridRhombusNode>

// horisontal places at the bottom
export const getEmptyRhombusPattern = (props: {width: number, height: number, length: number}): RhombusGrid => {
	const grid = new TriangleGrid<TriangleGridRhombusNode>({
		...props,
		defaultValue: {
			leftIsSolid: false,
			rightIsSolid: false,
			bottomIsSolid: false
		}
	})

	const center = grid.getCenterCornerCoords()

	grid.exploreFrom(center, xy => {
		grid.set(xy, {...grid.get(xy), bottomIsSolid: true})
		return [grid.getBottomLeftOf(xy), grid.getBottomRightOf(xy), grid.getBottomOf(xy)]
	})

	grid.exploreFrom(center, xy => {
		grid.set(xy, {...grid.get(xy), leftIsSolid: true})
		return [grid.getBottomLeftOf(xy), grid.getTopLeftOf(xy), grid.getTopOf(xy)]
	})

	grid.exploreFrom(center, xy => {
		grid.set(xy, {...grid.get(xy), rightIsSolid: true})
		return [grid.getBottomRightOf(xy), grid.getTopRightOf(xy), grid.getTopOf(xy)]
	})

	return grid
}

export const tileWithRandomRhombuses = (grid: RhombusGrid): void => {
	const flippables = new Set<number>([encodeXY(grid.getCenterCornerCoords())])

	const updateNeighbours = (sourceXy: XY) => {
		for(const xy of grid.getValidNeighbourCoords(sourceXy)){
			const key = encodeXY(xy)
			if(canFlipAt(xy)){
				flippables.add(key)
			} else {
				flippables.delete(key)
			}
		}
	}

	const isConcaveCorner = (node: TriangleGridRhombusNode) => node.bottomIsSolid && node.leftIsSolid && node.rightIsSolid
	const canFlipAt = (xy: XY) => {
		const node = grid.get(xy)
		if(isConcaveCorner(node)){
			return true
		}

		if(node.bottomIsSolid || node.leftIsSolid || node.rightIsSolid){
			return false
		}

		const top = grid.getTopOf(xy)
		const left = grid.getBottomLeftOf(xy)
		const right = grid.getBottomRightOf(xy)

		const topIsSolid = !grid.isCoordValid(top) || grid.get(top).bottomIsSolid
		const leftIsSolid = !grid.isCoordValid(left) || grid.get(left).rightIsSolid
		const rightIsSolid = !grid.isCoordValid(right) || grid.get(right).leftIsSolid

		return topIsSolid && leftIsSolid && rightIsSolid
	}
	const getFlipped = (node: TriangleGridRhombusNode): TriangleGridRhombusNode => {
		if(isConcaveCorner(node)){
			return {leftIsSolid: false, rightIsSolid: false, bottomIsSolid: false}
		}
		return {leftIsSolid: true, rightIsSolid: true, bottomIsSolid: true}
	}
	const tryMutate = (xy: XY, mutator: (node: TriangleGridRhombusNode) => TriangleGridRhombusNode) => {
		if(grid.isCoordValid(xy)){
			grid.set(xy, mutator(grid.get(xy)))
		}
	}
	const flipAt = (xy: XY) => {
		// console.log(`Flipping ${xy.x}, ${xy.y}`)
		const node = grid.get(xy)
		tryMutate(grid.getBottomLeftOf(xy), node => ({...node, rightIsSolid: !node.rightIsSolid}))
		tryMutate(grid.getBottomRightOf(xy), node => ({...node, leftIsSolid: !node.leftIsSolid}))
		tryMutate(grid.getTopOf(xy), node => ({...node, bottomIsSolid: !node.bottomIsSolid}))
		grid.set(xy, getFlipped(node))
		updateNeighbours(xy)
	}

	for(let i = 0; i < grid.count * 100; i++){
		if(flippables.size === 0){
			console.log("no flip candidate????")
			break
		}

		performeter.enterBlock("copy set")
		const arr = [...flippables] // very unoptimized, but I don't want to think about it too much right now
		performeter.exitEnterBlock("flip")
		const xy = decodeXY(arr[Math.floor(Math.random() * arr.length)]!)
		flipAt(xy)
		performeter.exitBlock()
	}

}