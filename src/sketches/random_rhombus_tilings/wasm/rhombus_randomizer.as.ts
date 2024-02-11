import {clearMetrics, metricsArray} from "./perfometer.as"
import {RhombusRandomTiler} from "./rhombus_random_tiler.as"
import {TriangleGrid} from "./triangle_grid.as"

export function seedRandom(seed: i32): void {
	NativeMath.seedRandom(seed)
}

export function randomizeRhombusPattern(arr: Uint8Array, length: i32, width: i32, height: i32, flipLimit: i32): Uint8Array {
	clearMetrics()
	const grid = new TriangleGrid(length, width, height, arr)
	new RhombusRandomTiler(grid, flipLimit).run()
	return grid.compact()
}

export function getMetrics(): Float64Array {
	return metricsArray
}

// for debug purposes
export function getNeighbours(length: i32, width: i32, height: i32, count: i32, x: i32, y: i32): Int32Array {
	const result = new Int32Array(6)
	// yeah, wasteful, but whatever, it's just for debug anyway
	const grid = new TriangleGrid(length, width, height, new Uint8Array(count))
	const index = grid.indexOf(x, y)
	// console.log(`Top right of ${x}, ${y} is ${grid.getTopRightOf(index)}, decodes to ${grid.xOfIndex(grid.getTopRightOf(index))}, ${grid.yOfIndex(grid.getTopRightOf(index))}`)
	result[0] = recodeIndex(grid, grid.getTopOf(index))
	result[1] = recodeIndex(grid, grid.getTopRightOf(index))
	result[2] = recodeIndex(grid, grid.getBottomRightOf(index))
	result[3] = recodeIndex(grid, grid.getBottomOf(index))
	result[4] = recodeIndex(grid, grid.getBottomLeftOf(index))
	result[5] = recodeIndex(grid, grid.getTopLeftOf(index))
	return result
}

function recodeIndex(grid: TriangleGrid, index: i32): i32 {
	if(index === -1){
		return -1
	}
	return (grid.xOfIndex(index) << 16) | grid.yOfIndex(index)
}