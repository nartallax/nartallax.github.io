import {rgbNumberToColorString} from "common/color_utils"
import {svgTag} from "common/tag"
import {RhombusGrid} from "sketches/random_rhombus_tilings/rhombus_tiling"
import {TriangleGrid, XY} from "sketches/random_rhombus_tilings/triangle_grid"

interface Props {
	readonly cellSize: XY
	readonly horisontalColor: number
	readonly leftColor: number
	readonly rightColor: number
	readonly grid: RhombusGrid
}

export const renderRhombuses = (props: Props): SVGSVGElement => {
	const grid = props.grid
	const svg = svgTag({tagName: "svg"})

	svg.setAttribute("width", grid.xWidth + "")
	svg.setAttribute("height", grid.yHeight + "")
	svg.setAttribute("viewBox", `-1 -1 ${grid.xWidth + 1} ${grid.yHeight + 0.5}`)
	svg.style.width = ((grid.xWidth + 1) * props.cellSize.x) + "px"
	svg.style.height = ((grid.yHeight + 0.5) * props.cellSize.y) + "px"

	const strokeWidth = 2 / (props.cellSize.x + props.cellSize.y)
	const makePathMaker = (color: number, expr: (x: number, y: number) => string) => (x: number, y: number): SVGPathElement => {
		let offset = grid.getVerticalOffset(Math.max(0, Math.min(grid.xWidth - 1, x)))
		if(x < 0 || x >= grid.xWidth){
			offset += 0.5
		}
		return svgTag({
			tagName: "path",
			attrs: {
				d: expr(x, y + offset),
				fill: rgbNumberToColorString(color),
				// strokes are only required to fill small gaps between the elements
				// if all the lines were cardinal - there would be no gaps, but they are not
				stroke: rgbNumberToColorString(color),
				"stroke-width": strokeWidth
			}
		})
	}

	const makeLeft = makePathMaker(
		props.leftColor,
		(x, y) => `M ${x} ${y} V ${y - 1} L ${x - 1} ${y - 0.5} V ${y + 0.5} z`)

	const makeRight = makePathMaker(
		props.rightColor,
		(x, y) => `M ${x} ${y} V ${y - 1} L ${x + 1} ${y - 0.5} V ${y + 0.5} z`)

	const makeBottom = makePathMaker(
		props.horisontalColor,
		(x, y) => `M ${x} ${y} L ${x - 1} ${y + 0.5} L ${x} ${y + 1} L ${x + 1} ${y + 0.5} z`)

	for(const {x, y, value: {leftIsSolid, rightIsSolid, bottomIsSolid}} of props.grid){
		if(leftIsSolid){
			svg.appendChild(makeLeft(x, y))
		}
		if(rightIsSolid){
			svg.appendChild(makeRight(x, y))
		}
		if(bottomIsSolid){
			svg.appendChild(makeBottom(x, y))
		}
	}

	// filling borders
	grid.exploreFrom(grid.getTopCornerCoords(), xy => {
		grid.get(xy).leftIsSolid || svg.appendChild(makeBottom(xy.x, xy.y - 1))
		return [grid.getBottomLeftOf(xy)]
	})

	grid.exploreFrom(grid.getTopCornerCoords(), xy => {
		grid.get(xy).rightIsSolid || svg.appendChild(makeBottom(xy.x, xy.y - 1))
		return [grid.getBottomRightOf(xy)]
	})

	grid.exploreFrom(grid.getRightBottomCornerCoords(), xy => {
		grid.get(xy).rightIsSolid || svg.appendChild(makeLeft(xy.x + 1, xy.y))
		return [grid.getTopOf(xy)]
	})

	grid.exploreFrom(grid.getRightBottomCornerCoords(), xy => {
		grid.get(xy).bottomIsSolid || svg.appendChild(makeLeft(xy.x + 1, xy.y))
		return [grid.getBottomLeftOf(xy)]
	})

	grid.exploreFrom(grid.getLeftBottomCornerCoords(), xy => {
		grid.get(xy).bottomIsSolid || svg.appendChild(makeRight(xy.x - 1, xy.y))
		return [grid.getBottomRightOf(xy)]
	})

	grid.exploreFrom(grid.getLeftBottomCornerCoords(), xy => {
		grid.get(xy).leftIsSolid || svg.appendChild(makeRight(xy.x - 1, xy.y))
		return [grid.getTopOf(xy)]
	})

	// debug dots
	// for(const {x, y} of grid){
	// 	svg.appendChild(svgTag({tagName: "circle", attrs: {
	// 		cx: x, cy: y + grid.getVerticalOffset(x), r: 0.1, fill: "white", stroke: "none"
	// 	}}))
	// }

	return svg
}

// that's mostly for debug
export const renderRhombusDots = (grid: TriangleGrid<unknown>, getNeighbours?: (xy: XY) => XY[]): SVGSVGElement => {
	const cellSizePx = 20
	const dotSizePx = 10

	const doGetNeighbours = getNeighbours ?? (xy => grid.getValidNeighbourCoords(xy))

	const svg = svgTag({tagName: "svg"})
	svg.setAttribute("width", grid.xWidth + "")
	svg.setAttribute("height", grid.yHeight + "")
	svg.setAttribute("viewBox", `-1 -1 ${grid.xWidth + 1} ${grid.yHeight + 1}`)
	svg.style.width = (grid.xWidth * cellSizePx) + "px"
	svg.style.height = (grid.yHeight * cellSizePx) + "px"

	const findDot = ({x, y}: XY): SVGCircleElement | null => {
		const el = svg.getElementById(`circle-${x}-${y}`)
		return el instanceof SVGCircleElement ? el : null
	}

	const setColor = (xy: XY, color: string) => {
		const dot = findDot(xy)
		if(dot){
			dot.style.fill = color
		}
	}

	const showNeighbours = (xy: XY) => doGetNeighbours(xy)
		.forEach(xy => setColor(xy, "red"))

	const hideNeighbours = (xy: XY) => doGetNeighbours(xy)
		.forEach(xy => setColor(xy, "white"))

	for(const xy of grid){
		const circle = svgTag({
			tagName: "circle",
			attrs: {
				id: `circle-${xy.x}-${xy.y}`,
				cx: xy.x,
				cy: grid.getVerticalOffset(xy.x) + xy.y,
				r: dotSizePx / cellSizePx,
				fill: "white",
				stroke: "none"
			}
		})

		circle.addEventListener("mouseover", () => showNeighbours(xy))
		circle.addEventListener("mouseout", () => hideNeighbours(xy))

		svg.appendChild(circle)
	}

	return svg
}