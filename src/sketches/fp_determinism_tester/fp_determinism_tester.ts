import {svgTag, tag} from "@nartallax/cardboard-dom"
import inputDataPath from "./input_data.txt"
import * as css from "./fp_determinism_tester.module.scss"
import {getCatmullRomSvgPathForDotSequence} from "sketches/fp_determinism_tester/catmull-rom"
import {PerlinNoiseGenerator} from "sketches/fp_determinism_tester/perlin_noise"
import {cos, sin} from "sketches/fp_determinism_tester/trigonometry"

const runTheTests = (testData: any): FullTestRunResult[] => {
	const {numbers: [o1, o2, o3, o4, negZero], catmullRom} = testData
	return runTests([
		["0.1 + 0.2", x => x + o1 + o2],
		["0.1 - 0.2", x => x + o1 - o2],
		["0.1 * 0.2", x => x + o1 * o2],
		["0.1 / 0.2", x => x + o1 / o2],
		["(0.1 * 0.2) + (0.3 * 0.4)", x => x + (o1 * o2) + (o3 * o4)],
		["M.sin(0.1) + M.cos(0.2)", x => x + Math.sin(o1) + Math.cos(o2)],
		["sin(0.1) + cos(0.2)", x => x + sin(o1) + cos(o2)],
		["sqrt(0.3) + sqrt(0.4)", x => x + Math.sqrt(o3) + Math.sqrt(o4)],
		["-0", () => negZero],
		["-0 + -0", () => negZero + negZero],
		["-0 + 0.1 - 0.1", x => x + negZero + o1 - o1],
		["Catmull-Rom curves", x => x + getCatmullRomSvgPathForDotSequence(catmullRom)
			.map(x => typeof(x) === "string" ? 1 : x)
			.reduce((a, b) => a * b, 1)],
		["Perlin noise", x => x + calcPerlinNoiseChecksum(testData)]
	])
}

const waitForFrame = () => new Promise(ok => requestAnimationFrame(ok))

export async function main(root: HTMLElement): Promise<void> {
	const btn = tag({
		tag: "button",
		class: css.button,
		onClick: async() => {
			btn.textContent = "Running..."
			btn.setAttribute("disabled", "disabled")
			await waitForFrame()
			await waitForFrame()
			try {
				const testResults = runTheTests(data)
				const table = makeResultsTable(testResults)
				btn.replaceWith(table)
				root.prepend(makeCopyButton(testResults))

				root.prepend(renderVisualStuff(data))
			} catch(e){
				console.error(e)
				btn.textContent = "Something failed! Whoopsie. See console output."
				return
			}
		}
	}, ["Loading..."])

	root.appendChild(btn)

	// storing this behind network request to avoid static code optimization
	const data = await(await fetch(inputDataPath)).json()
	btn.textContent = "Run the tests!"
	// root.prepend(renderVisualStuff(data))
}

type Test = [
	name: string,
	runner: (prevResult: number) => number
]

type ShortTestRunResult = {
	name: string
	dec: string
	bin: string
}

type FullTestRunResult = ShortTestRunResult & {
	time: number
}

type TestTiming = {time: number, runCount: number}

const makeCopyButton = (testResults: FullTestRunResult[]) => tag({
	tag: "button",
	class: css.buttonSmall,
	onClick: () => {
		const arrs = testResults.map(({
			name, dec, bin, time
		}) => [name, dec, bin, time])
		void navigator.clipboard.writeText(JSON.stringify(arrs)
			.replaceAll(/\],\[/g, "],\n[")
			.replaceAll(/\[\[/g, "[\n[")
			.replaceAll(/\]\]/g, "]\n]")
		)
	}
}, ["Copy all of this"])

const makeResultsTable = (data: FullTestRunResult[]): HTMLElement => {
	return tag({tag: "table", class: css.table}, [
		tag({tag: "tr"}, [
			tag({tag: "th"}, ["Name"]),
			tag({tag: "th"}, ["Decimal"]),
			tag({tag: "th"}, ["Binary"]),
			tag({tag: "th"}, ["Time (ms)"])
		]),
		...data.map(({
			name, dec, bin, time
		}) => tag({tag: "tr"}, [
			tag({tag: "td"}, [name]),
			tag({tag: "td"}, [dec]),
			tag({tag: "td"}, [bin]),
			tag({tag: "td"}, [time.toFixed(10)])
		]))
	])
}

const runTests = (tests: Test[]): FullTestRunResult[] => {
	const coldTimings = makeTimings(tests)
	const coldResults = runRoundOfTests(tests, coldTimings)

	const throwawayTimings = makeTimings(tests)
	const now = Date.now()
	while(Date.now() - now < 5000){
		runRoundOfTests(tests, throwawayTimings)
	}

	const hotTimings = makeTimings(tests)
	const hotResults = runRoundOfTests(tests, hotTimings)

	const enrichedCold = enrichWithTiming(coldResults, coldTimings, "(c) ")
	const enrichedHot = enrichWithTiming(hotResults, hotTimings, "(h) ")

	return insertAtEachNth(enrichedHot, enrichedCold, 2)

}

const makeTimings = (tests: Test[]): TestTiming[] => tests.map(() => ({runCount: 0, time: 0}))
const enrichWithTiming = (results: ShortTestRunResult[], timings: TestTiming[], suffix?: string): FullTestRunResult[] => {
	return results.map((res, index) => {
		const timing = timings[index]!
		return ({
			...res,
			name: !suffix ? res.name : suffix + res.name,
			time: timing.time / timing.runCount
		})
	})
}

const insertAtEachNth = <T>(receivingArray: T[], sourceArray: T[], n: number): T[] => {
	let srcIndex = 0
	let recIndex = 0
	const result: T[] = new Array(receivingArray.length + sourceArray.length)
	for(let i = 0; i < result.length; i++){
		result[i] = (i % n) === 0 ? sourceArray[srcIndex++]! : receivingArray[recIndex++]!
	}
	return result
}

const runRoundOfTests = (tests: Test[], timing: TestTiming[]): ShortTestRunResult[] => {
	const result: ShortTestRunResult[] = []
	const dblBuffer = new DataView(new ArrayBuffer(8))
	for(let i = 0; i < tests.length; i++){
		const test = tests[i]!
		const testTiming = timing[i]!
		const startTime = performance.now()
		let testResult = 0
		for(let i = 0; i < 1000; i++){
			testResult = test[1](testResult)
		}
		testTiming.time += performance.now() - startTime
		testTiming.runCount++
		const testResultDec = testResult.toFixed(20)
		dblBuffer.setFloat64(0, testResult)
		let testResultBin = ""
		for(let i = 0; i < 8; i++){
			let byteStr = dblBuffer.getUint8(i).toString(2)
			while(byteStr.length < 8){
				byteStr = "0" + byteStr
			}
			testResultBin += byteStr
		}
		result.push({name: test[0], dec: testResultDec, bin: testResultBin})
	}
	return result
}

const renderVisualStuff = (data: any): HTMLElement => {
	const catmullRomPath = getCatmullRomSvgPathForDotSequence(data.catmullRom).join(" ")
	return tag({class: css.stuffDisplay}, [
		renderSvgPath(catmullRomPath),
		renderPerlinGrid(data)
	])
}

const perlinOffset = -5
const perlinSize = 10
const perlinResolution = 5

const renderPerlinGrid = (data: any): HTMLElement => {
	const pixelSize = 20
	const canvas = tag({tag: "canvas", attrs: {width: perlinSize * pixelSize, height: perlinSize * pixelSize}})
	const ctx = canvas.getContext("2d")!
	const gen = new PerlinNoiseGenerator(data.perlinSeed, data.pi)
	for(let x = perlinOffset; x < perlinOffset + perlinSize; x++){
		for(let y = perlinOffset; y < perlinOffset + perlinSize; y++){
			const noise = Math.floor((gen.get((x + 0.5) / perlinResolution, (y + 0.5) / perlinResolution) + 1) * 128)
			let noiseColor = noise.toString(16)
			if(noiseColor.length < 2){
				noiseColor = "0" + noiseColor
			}
			noiseColor = `#${noiseColor}${noiseColor}${noiseColor}`
			ctx.fillStyle = noiseColor
			ctx.fillRect((x - perlinOffset) * pixelSize, (y - perlinOffset) * pixelSize, pixelSize, pixelSize)
		}
	}
	return canvas
}

const calcPerlinNoiseChecksum = (data: any): number => {
	let sum = 0
	const gen = new PerlinNoiseGenerator(data.perlinSeed, data.pi)
	for(let x = perlinOffset; x < perlinOffset + perlinSize; x++){
		for(let y = perlinOffset; y < perlinOffset + perlinSize; y++){
			sum += gen.get((x + 0.5) / perlinResolution, (y + 0.5) / perlinResolution)
		}
	}
	return sum
}

const renderSvgPath = (path: string) => {
	const svg = svgTag({tag: "svg"}, [
		svgTag({tag: "path", attrs: {d: path}})
	])
	svg.setAttribute("viewBox", "-1 -1 100 100")
	return svg
}