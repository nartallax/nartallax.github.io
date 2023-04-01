import {tag} from "common/tag"
import {ColorArrayDisplay} from "sketches/wave_function_collapse/color_array_display"
import {PatternInput} from "sketches/wave_function_collapse/pattern_input"
import {waveFunctionCollapse} from "sketches/wave_function_collapse/wave_function_collapse_algo"
import * as css from "./wave_function_collapse.module.scss"

export function main(root: HTMLElement): void {
	const patternInput = new PatternInput({
		palette: [0x53bc01, 0xffeb03, 0xffa801, 0xf93a1d, 0xe21a5f, 0x572c62, 0xa1ccd3, 0x006898],
		defaultValue: 0x53bc01,
		height: 20,
		width: 20,
		scale: 10
	})

	const display = new ColorArrayDisplay(10)

	root.appendChild(tag({
		class: css["wave-function-collapse-root"]
	}, [
		tag([
			patternInput.root,
			tag({tagName: "button", text: "Collapse!", on: {click: run}})
		]),
		display.root
	]))

	function run(): void {
		const source = patternInput.getPattern()
		const result = waveFunctionCollapse({
			flip: true,
			rotate: true,
			sourceSample: source,
			patternSize: 3,
			randomSeed: 12345,
			resultSize: {width: 100, height: 100}
		})
		display.draw(result)
	}

	requestAnimationFrame(run)
}