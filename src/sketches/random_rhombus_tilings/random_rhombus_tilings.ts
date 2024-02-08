import {renderRhombuses} from "sketches/random_rhombus_tilings/rhombus_tiling_render"
import {getEmptyRhombusPattern, tileWithRandomRhombuses} from "sketches/random_rhombus_tilings/rhombus_tiling"
import {transformColorHsl} from "common/color_utils"
import {performeter} from "common/perfometer"

const colors = [0x53bc01, 0xffeb03, 0xffa801, 0xf93a1d, 0xe21a5f, 0x572c62, 0xa1ccd3, 0x006898]

export function main(container: HTMLElement): void {
	const grid = getEmptyRhombusPattern({width: 25, height: 25, length: 25})

	performeter.enterBlock("randomizing")
	tileWithRandomRhombuses(grid)
	performeter.exitEnterBlock("drawing")

	const color = colors[Math.floor(Math.random() * colors.length)]!

	const svg = renderRhombuses({
		horisontalColor: transformColorHsl(color, ([h, s, l]) => [h, s * 1.1, l]),
		leftColor: transformColorHsl(color, ([h, s, l]) => [h, s * 0.9, l * 0.9]),
		rightColor: transformColorHsl(color, ([h, s, l]) => [h, s * 0.9, l * 0.8]),
		cellSize: {
			x: 10,
			y: 10
		},
		grid
	})
	svg.style.margin = "100px 500px"
	container.appendChild(svg)

	performeter.exitBlock()
	performeter.print()
}