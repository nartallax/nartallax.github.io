import {svgTag} from "common/tag"
import * as css from "./countdown_timer.module.scss"

export function CountdownTimer(time: number): Element {
	const size = 50
	const stroke = 5
	const radius = (size / 2) - stroke
	const len = 2 * Math.PI * radius

	const root = svgTag({
		tagName: "svg",
		attrs: {width: size, height: size, viewBox: `${-size / 2} ${-size / 2} ${size} ${size}`},
		class: css.countdown
	}, [
		svgTag({tagName: "circle", attrs: {r: radius, "stroke-width": stroke}}),
		svgTag({tagName: "circle",
			attrs: {
				r: radius,
				"stroke-width": stroke,
				"stroke-dasharray": len,
				"stroke-dashoffset": -len + "px",
				"animation-duration": (time / 1000) + "s"
			}})
	])

	return root
}