import {svgTag} from "@nartallax/cardboard-dom"
import * as css from "./countdown_timer.module.scss"

export function CountdownTimer(time: number): SVGElement {
	const size = 50
	const stroke = 5
	const radius = (size / 2) - stroke
	const len = 2 * Math.PI * radius

	const root = svgTag({
		tag: "svg",
		attrs: {width: size, height: size, viewBox: `${-size / 2} ${-size / 2} ${size} ${size}`},
		class: css.countdown
	}, [
		svgTag({tag: "circle", attrs: {r: radius, "stroke-width": stroke}}),
		svgTag({tag: "circle",
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