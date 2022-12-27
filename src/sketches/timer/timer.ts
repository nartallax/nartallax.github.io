import {tag} from "common/tag"
import * as css from "./timer.module.scss"

const twoDigis = (x: number): string => x < 10 ? "0" + x : "" + x
const threeDigits = (x: number): string => x < 10 ? "00" + x : x < 100 ? "0" + x : "" + x

function formatTime(time: number): string {
	if(time < 0){
		return "-" + formatTime(-time)
	}
	const ms = time % 1000
	time = Math.floor(time / 1000)

	const s = time % 60
	time = Math.floor(time / 60)

	const m = time % 60
	const h = Math.floor(time / 60)
	return `${twoDigis(h)}:${twoDigis(m)}:${twoDigis(s)}.${threeDigits(ms)}`
}

function formatTimeShort(time: number): string {
	let result = formatTime(time).replace(/^[0:]+/, "") // lol
	if(result.startsWith(".")){
		result = "0" + result
	}
	return result
}

function intOrZero(x: string): number {
	const result = parseInt(x)
	if(Number.isNaN(result) || !Number.isFinite(result)){
		return 0
	} else {
		return result
	}
}

function parseTime(time: string): number {
	const parts = time.split(":")
	let msec = 0
	if(parts.length > 0){
		const lastPart = parts[parts.length - 1]!
		const secParts = lastPart.split(".")
		if(secParts.length === 2){
			const [secondsPart, msecPart] = secParts
			parts[parts.length - 1] = secondsPart!
			msec += intOrZero(msecPart!)
		}
	}

	let mult = 1000
	for(let i = parts.length - 1; i >= 0; i--){
		const part = parts[i]!
		msec += intOrZero(part) * mult
		mult *= 60
	}
	return msec
}

function onAnyChange(input: HTMLInputElement, handler: (value: string) => void): void {
	let lastValue = input.value
	const wrappedHandler = () => {
		const value = input.value
		if(value !== lastValue){
			lastValue = value
			handler(value)
		}
	}
	input.addEventListener("change", wrappedHandler)
	input.addEventListener("mousedown", wrappedHandler)
	input.addEventListener("mouseup", wrappedHandler)
	input.addEventListener("keydown", wrappedHandler)
	input.addEventListener("keyup", wrappedHandler)
}

export function main(root: HTMLElement): void {
	root.classList.add(css.timerRoot ?? "")
	const wrap = tag({class: css.wrap})

	const timeEl = tag({class: css.timer})
	wrap.appendChild(timeEl)

	const resetBtn = tag({tagName: "button", text: "reset", class: css.button})
	resetBtn.addEventListener("click", () => {
		timeAcc = 0
		updateText()
	})
	wrap.appendChild(resetBtn)

	const pauseBtn = tag({tagName: "button", text: "pause", class: css.button})
	pauseBtn.addEventListener("click", () => {
		if(paused){
			paused = false
			pauseBtn.value = "pause"
		} else {
			paused = true
			pauseBtn.value = "unpause"
		}
	})
	wrap.appendChild(pauseBtn)

	const speedBlock = tag({class: css.speedBlock, text: "Speed: "})
	const speedInput = tag({tagName: "input", attrs: {type: "number", value: 1}, class: css.speedInput})
	onAnyChange(speedInput, () => {
		const parsed = parseFloat(speedInput.value)
		if(Number.isNaN(parsed) || !Number.isFinite(parsed)){
			console.warn("Bad speed value: " + JSON.stringify(speedInput.value) + ": cannot parse")
			return
		}
		speed = parsed
	})
	speedBlock.appendChild(speedInput)
	wrap.appendChild(speedBlock)


	const addTimeBlock = tag({class: css.addTimeBlock})
	const addTimeButton = tag({tagName: "button", text: "Add time", class: css.button})
	addTimeButton.addEventListener("click", () => {
		timeAcc += parseTime(addTimeInput.value)
		updateText()
	})
	addTimeBlock.appendChild(addTimeButton)
	const addTimeInput = tag({tagName: "input", attrs: {type: "string", value: "5:00.000"}, class: css.speedInput})
	addTimeInput.addEventListener("blur", () => {
		addTimeInput.value = formatTimeShort(parseTime(addTimeInput.value))
	})
	addTimeBlock.appendChild(addTimeInput)

	wrap.appendChild(addTimeBlock)

	root.appendChild(wrap)

	function updateText(): void {
		timeEl.textContent = formatTime(Math.round(timeAcc))
	}

	let timeAcc = 0
	let paused = false
	let speed = 1
	let lastUpdateTime = Date.now()
	const updateTimer = () => {
		requestAnimationFrame(updateTimer)
		const now = Date.now()
		const dTime = (now - lastUpdateTime) * speed
		lastUpdateTime = now
		if(!paused){
			timeAcc += dTime
			updateText()
		}
	}
	updateTimer()
}