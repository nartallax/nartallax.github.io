import {performeter} from "common/perfometer"
import {tag} from "common/tag"
import {ColorArrayDisplay} from "sketches/wave_function_collapse/color_array_display"
import {PatternInput} from "sketches/wave_function_collapse/pattern_input"
import {waveFunctionCollapse} from "sketches/wave_function_collapse/wave_function_collapse_algo"
import * as css from "./wave_function_collapse.module.scss"
import * as testResult from "./test_result.json"
import * as islandsSource from "./island_source.json"

export function main(root: HTMLElement): void {
	const patternInput = new PatternInput<number>({
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

	patternInput.setValue(islandsSource)

	function run(): void {
		const source = patternInput.getPattern()
		const result = waveFunctionCollapse({
			flip: true,
			rotate: true,
			sourceSample: source,
			patternSize: 3,
			randomSeed: 12345,
			resultSize: {width: 50, height: 50}
		})
		display.draw(result)
		checkResult(result)
		performeter.print()
		performeter.reset()
	}
}

function checkResult(result: number[][]): void {
	if(JSON.stringify(result) !== JSON.stringify(testResult)){
		console.error("Results are different!")
	} else {
		console.log("Results are the same.")
	}
}