import {renderRhombuses} from "sketches/random_rhombus_tilings/rhombus_tiling_render"
import {getEmptyRhombusPattern, rhombusGridFromBytes, rhombusGridToBytes} from "sketches/random_rhombus_tilings/rhombus_tiling"
import {transformColorHsl} from "common/color_utils"
import {performeter} from "common/perfometer"
import {getWasmRhombusRandomiser, WasmRhombusRandomiser} from "sketches/random_rhombus_tilings/rhombus_randomizer.binding"
import {makeBottomBarredScreenContainer} from "common/bottom_bar/bottom_bar"
import {box, RBox, WBox} from "@nartallax/cardboard"
import {Slider} from "common/slider/slider"
import {TriangleGrid} from "sketches/random_rhombus_tilings/triangle_grid"
import {debounce} from "common/debounce"
import {bindBox, tag} from "@nartallax/cardboard-dom"

const colors = [0x53bc01, 0xffeb03, 0xffa801, 0xf93a1d, 0xe21a5f, 0x572c62, 0xa1ccd3, 0x006898] as const
const defaultDims = {width: 10, height: 10, length: 10}
const defaultSteps = Math.floor(TriangleGrid.getCount(defaultDims.length, defaultDims.width, defaultDims.height) * 10)
const defaultSeed = Math.floor(Math.random() * 0x8fffffff)

export async function main(container: HTMLElement, {isPreview}: {isPreview: boolean}): Promise<void> {
	const randomizer = await getWasmRhombusRandomiser()
	const redraw = makeUpdater(() => root, randomizer)
	const debouncedRedraw = debounce("raf", () => redraw(props))

	const steps = box(defaultSteps)
	const maxSteps = box(steps.get())
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
		maxSteps.set(Math.floor(TriangleGrid.getCount(props.length.get(), props.width.get(), props.height.get()) ** 1.5))
	}
	update()

	bindBox(root, [props.steps, props.height, props.width, props.length, props.color, props.seed], update)
}

const margins = 25

const makeUpdater = (getRoot: () => HTMLElement, randomizer: WasmRhombusRandomiser) => (props: BarProps) => {
	randomizer.seedRandom(props.seed.get())
	performeter.enterBlock("initializing")
	const dims = {
		height: props.height.get(),
		length: props.length.get(),
		width: props.width.get()
	}
	console.log({...dims, steps: props.steps.get(), seed: props.seed.get()})
	let grid = getEmptyRhombusPattern(dims)

	performeter.exitEnterBlock("randomizing")
	const bytes = randomizer.randomizeRhombusPattern(rhombusGridToBytes(grid), props.length.get(), props.width.get(), props.height.get(), props.steps.get())
	grid = rhombusGridFromBytes(bytes, dims)
	// tileWithRandomRhombuses(grid, props.steps())

	performeter.exitEnterBlock("drawing")

	const color = props.color.get()

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
					tag: "button",
					onClick: () => {
						props.color.set(colors[Math.floor(Math.random() * colors.length)]!)
						props.seed.set(Math.floor(Math.random() * 0x8fffffff))
					}
				}, ["Refresh"])
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