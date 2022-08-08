import {addCssToPage} from "common/css_utils"
import {tag} from "common/dom_utils"
import {makeSketchInfoButton} from "common/sketch_info_button"

function doCss(): void {
	addCssToPage("timer", `
body {
	position: absolute;
	width: 100vw;
	height: 100vh;
	border: 0;
	margin: 0;
	padding: 0;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: #222;
}

.wrap {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.timer {
	font-size: 5rem;
	color: #ccc;
	font-family: 'courier new';
}

.speed-input, 
.button {
	font-size: 2rem;
	color: #aaa;
	border: 2px solid #aaa;
	background: #444;
	cursor: pointer;
	transition: 0.25s;
	border-radius: 3px;

	margin: 0.5rem;
}

.speed-input:hover, 
.reset-button:hover {
	color: #fff;
	border-color: #fff;
	background: #888;
}

.speed-block {
	margin: 0.5rem;
	font-size: 2rem;
}

.speed-input {
	max-width: 5em;
}

	`)
}

let twoDigis = (x: number): string => x < 10 ? "0" + x : "" + x
let threeDigits = (x: number): string => x < 10 ? "00" + x : x < 100 ? "0" + x : "" + x

function formatTime(time: number): string {
	if(time < 0){
		return "-" + formatTime(-time)
	}
	let ms = time % 1000
	time = Math.floor(time / 1000)

	let s = time % 60
	time = Math.floor(time / 60)

	let m = time % 60
	let h = Math.floor(time / 60)
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
	let result = parseInt(x)
	if(Number.isNaN(result) || !Number.isFinite(result)){
		return 0
	} else {
		return result
	}
}

function parseTime(time: string): number {
	let parts = time.split(":")
	let msec = 0
	if(parts.length > 0){
		let lastPart = parts[parts.length - 1]!
		let secParts = lastPart.split(".")
		if(secParts.length === 2){
			let [secondsPart, msecPart] = secParts
			parts[parts.length - 1] = secondsPart
			msec += intOrZero(msecPart)
		}
	}

	let mult = 1000
	for(let i = parts.length - 1; i >= 0; i--){
		let part = parts[i]!
		msec += intOrZero(part) * mult
		mult *= 60
	}
	return msec
}

function onAnyChange(input: HTMLInputElement, handler: (value: string) => void): void {
	let lastValue = input.value
	let wrappedHandler = () => {
		let value = input.value
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

export function main(): void {
	doCss()
	let wrap = tag({class: "wrap"})

	let timeEl = tag({class: "timer"})
	wrap.appendChild(timeEl)

	let resetBtn = tag({tagName: "input", type: "button", value: "reset", class: "button"})
	resetBtn.addEventListener("click", () => {
		timeAcc = 0
		updateText()
	})
	wrap.appendChild(resetBtn)

	let pauseBtn = tag({tagName: "input", type: "button", value: "pause", class: "button"})
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

	let speedBlock = tag({class: "speed-block", text: "Speed: "})
	let speedInput = tag({tagName: "input", type: "number", value: 1, class: "speed-input"})
	onAnyChange(speedInput, () => {
		let parsed = parseFloat(speedInput.value)
		if(Number.isNaN(parsed) || !Number.isFinite(parsed)){
			console.warn("Bad speed value: " + JSON.stringify(speedInput.value) + ": cannot parse")
			return
		}
		speed = parsed
	})
	speedBlock.appendChild(speedInput)
	wrap.appendChild(speedBlock)


	let addTimeBlock = tag({class: "add-time-block"})
	let addTimeButton = tag({tagName: "input", type: "button", value: "Add time", class: "button"})
	addTimeButton.addEventListener("click", () => {
		timeAcc += parseTime(addTimeInput.value)
		updateText()
	})
	addTimeBlock.appendChild(addTimeButton)
	let addTimeInput = tag({tagName: "input", type: "string", value: "5:00.000", class: "speed-input"})
	addTimeInput.addEventListener("blur", () => {
		addTimeInput.value = formatTimeShort(parseTime(addTimeInput.value))
	})
	addTimeBlock.appendChild(addTimeInput)

	wrap.appendChild(addTimeBlock)

	document.body.appendChild(wrap)

	function updateText(): void {
		timeEl.textContent = formatTime(Math.round(timeAcc))
	}

	let timeAcc = 0
	let paused = false
	let speed = 1
	let lastUpdateTime = Date.now()
	let updateTimer = () => {
		requestAnimationFrame(updateTimer)
		let now = Date.now()
		let dTime = (now - lastUpdateTime) * speed
		lastUpdateTime = now
		if(!paused){
			timeAcc += dTime
			updateText()
		}
	}
	updateTimer()

	makeSketchInfoButton()
}