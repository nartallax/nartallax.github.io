import {addCssToPage} from "common/css_utils"
import {tag} from "common/dom_utils"

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

input {
	font-size: 2rem;
	color: #aaa;
	border: 2px solid #aaa;
	background: #444;
	cursor: pointer;
	transition: 0.25s;
	border-radius: 3px;
}

input:hover {
	color: #fff;
	border-color: #fff;
	background: #888;
}

.speed-block {
	margin: 0.5rem;
	font-size: 2rem;
}

input[type="number"]{
	max-width: 5em;
}

	`)
}

let twoDigis = (x: number): string => x < 10 ? "0" + x : "" + x
let threeDigits = (x: number): string => x < 10 ? "00" + x : x < 100 ? "0" + x : "" + x

function formatTime(time: number): string {
	let ms = time % 1000
	time = Math.floor(time / 1000)

	let s = time % 60
	time = Math.floor(time / 60)

	let m = time % 60
	let h = Math.floor(time / 60)
	return `${twoDigis(h)}:${twoDigis(m)}:${twoDigis(s)}.${threeDigits(ms)}`
}

export function main(): void {
	doCss()
	let wrap = tag({class: "wrap"})

	let timeEl = tag({class: "timer"})
	wrap.appendChild(timeEl)

	let resetBtn = tag({tagName: "input", type: "button", value: "reset"})
	resetBtn.addEventListener("click", () => timeAcc = 0)
	wrap.appendChild(resetBtn)

	let speedBlock = tag({class: "speed-block", text: "Speed: "})
	let speedInput = tag({tagName: "input", type: "number", value: 1})
	let speed = 1
	let updateSpeed = () => {
		let parsed = parseFloat(speedInput.value)
		if(Number.isNaN(parsed) || !Number.isFinite(parsed)){
			console.warn("Bad speed value: " + JSON.stringify(speedInput.value) + ": cannot parse")
			return
		}
		speed = parsed
	}
	speedInput.addEventListener("change", updateSpeed)
	speedInput.addEventListener("mousedown", updateSpeed)
	speedInput.addEventListener("mouseup", updateSpeed)
	speedInput.addEventListener("keydown", updateSpeed)
	speedInput.addEventListener("keyup", updateSpeed)
	speedBlock.appendChild(speedInput)
	wrap.appendChild(speedBlock)

	document.body.appendChild(wrap)

	let timeAcc = 0
	let lastUpdateTime = Date.now()
	let updateTimer = () => {
		requestAnimationFrame(updateTimer)
		let now = Date.now()
		let dTime = (Date.now() - lastUpdateTime) * speed
		lastUpdateTime = now
		timeAcc += dTime
		timeEl.textContent = formatTime(Math.round(timeAcc))
	}
	updateTimer()
}