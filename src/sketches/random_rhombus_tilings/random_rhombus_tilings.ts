import {renderRhombuses} from "sketches/random_rhombus_tilings/rhombus_tiling_render"
import {getEmptyRhombusPattern, rhombusGridFromBytes, rhombusGridToBytes} from "sketches/random_rhombus_tilings/rhombus_tiling"
import {transformColorHsl} from "common/color_utils"
import {performeter} from "common/perfometer"
import {getWasmRhombusRandomiser, WasmRhombusRandomiser} from "sketches/random_rhombus_tilings/rhombus_randomizer.binding"
import {makeBottomBarredScreenContainer} from "common/bottom_bar/bottom_bar"
import {box, RBox, WBox} from "common/box"
import {Slider} from "common/slider/slider"
import {TriangleGrid} from "sketches/random_rhombus_tilings/triangle_grid"
import {getBinder} from "common/binder/binder"
import {tag} from "common/tag"
import {debounce} from "common/debounce"

const colors = [0x53bc01, 0xffeb03, 0xffa801, 0xf93a1d, 0xe21a5f, 0x572c62, 0xa1ccd3, 0x006898] as const
const defaultDims = {width: 10, height: 10, length: 10}
const defaultSteps = Math.floor(TriangleGrid.getCount(defaultDims.length, defaultDims.width, defaultDims.height) * 10)
const defaultSeed = Math.floor(Math.random() * 0x8fffffff)

export async function main(container: HTMLElement, {isPreview}: {isPreview: boolean}): Promise<void> {
	const randomizer = await getWasmRhombusRandomiser()
	const redraw = makeUpdater(() => root, randomizer)
	const debouncedRedraw = debounce("raf", () => redraw(props))

	const steps = box(defaultSteps)
	const maxSteps = box(steps())
	const props = {
		color: box(colors[Math.floor(Math.random() * colors.length)]!),
		seed: box(defaultSeed),
		steps, maxSteps,
		height: box(defaultDims.height),
		width: box(defaultDims.width),
		length: box(defaultDims.length)
	}
	const root = isPreview ? container : bottomBar(container, props)

	const update = () => {
		debouncedRedraw()
		maxSteps(Math.floor(TriangleGrid.getCount(props.length(), props.width(), props.height()) ** 1.5))
	}
	update()

	const binder = getBinder(root)
	binder.watch(props.steps, update)
	binder.watch(props.height, update)
	binder.watch(props.width, update)
	binder.watch(props.length, update)
	binder.watch(props.seed, update)
	binder.watch(props.color, update)
}

const margins = 25

const makeUpdater = (getRoot: () => HTMLElement, randomizer: WasmRhombusRandomiser) => (props: BarProps) => {
	randomizer.seedRandom(props.seed())
	performeter.enterBlock("initializing")
	const dims = {
		height: props.height(),
		length: props.length(),
		width: props.width()
	}
	console.log({...dims, steps: props.steps(), seed: props.seed()})
	let grid = getEmptyRhombusPattern(dims)

	performeter.exitEnterBlock("randomizing")
	const bytes = randomizer.randomizeRhombusPattern(rhombusGridToBytes(grid), props.length(), props.width(), props.height(), props.steps())
	grid = rhombusGridFromBytes(bytes, dims)
	// tileWithRandomRhombuses(grid, props.steps())

	performeter.exitEnterBlock("drawing")

	const color = props.color()

	const root = getRoot()
	root.innerHTML = ""

	const rootRect = root.getBoundingClientRect()
	const rootHeight = rootRect.height - (margins * 2)
	const rootWidth = rootRect.width - (margins * 2)
	const heightCellSize = Math.floor(rootHeight / (grid.yHeight + 1))
	const widthCellSize = Math.floor(rootWidth / (grid.xWidth + 1))
	const cellSize = Math.min(heightCellSize, widthCellSize)

	const svg = renderRhombuses({
		horisontalColor: transformColorHsl(color, ([h, s, l]) => [h, s * 1.1, l]),
		leftColor: transformColorHsl(color, ([h, s, l]) => [h, s * 0.9, l * 0.9]),
		rightColor: transformColorHsl(color, ([h, s, l]) => [h, s * 0.9, l * 0.8]),
		cellSize: {
			x: cellSize,
			y: cellSize
		},
		grid
	})
	// debug render
	// const svg = renderRhombusDots(grid, xy => {
	// 	const encoded = randomizer.getNeighbours(dims.length, dims.width, dims.height, grid.count, xy.x, xy.y)
	// 	return [...encoded].filter(x => x !== -1).map(num => ({
	// 		x: (num & 0xff0000) >> 16,
	// 		y: num & 0xff
	// 	}))
	// })
	svg.style.margin = cellSize === widthCellSize
		? `${(rootRect.height - ((grid.yHeight + 1) * cellSize)) / 2}px 0 0 ${margins}px`
		: `${margins}px 0 0 ${(rootRect.width - ((grid.xWidth + 1) * cellSize)) / 2}px`
	root.appendChild(svg)

	performeter.exitBlock()
	performeter.print()

	console.log(randomizer.getMetrics())
}


interface BarProps {
	steps: WBox<number>
	maxSteps: RBox<number>
	length: WBox<number>
	width: WBox<number>
	height: WBox<number>
	color: WBox<number>
	seed: WBox<number>
}

const labelWidth = 60
const maxDim = 50

function bottomBar(root: HTMLElement, props: BarProps): HTMLElement {
	return makeBottomBarredScreenContainer({
		parent: root,
		contents: [
			tag({style: {width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start", gap: "1rem"}}, [
				Slider({
					value: props.steps,
					step: 1,
					min: 0,
					max: props.maxSteps,
					label: "Steps",
					labelWidth
				}),
				tag({
					tagName: "button",
					text: "Refresh",
					on: {
						click: () => {
							props.color(colors[Math.floor(Math.random() * colors.length)]!)
							props.seed(Math.floor(Math.random() * 0x8fffffff))
						}
					}
				})
			]),
			Slider({
				value: props.length,
				step: 1,
				min: 2,
				max: maxDim,
				label: "Length",
				labelWidth
			}),
			Slider({
				value: props.width,
				step: 1,
				min: 2,
				max: maxDim,
				label: "Width",
				labelWidth
			}),
			Slider({
				value: props.height,
				step: 1,
				min: 2,
				max: maxDim,
				label: "Height",
				labelWidth
			})
		]
	})
}