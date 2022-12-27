import {svgTag} from "common/tag"
import {makeBezierSmoothedClosePath} from "./bezier_smoothed_closed_path"
import {generateWobblyCirclePoints} from "./wobbly_circle"

interface Color {
	r: number
	g: number
	b: number
}

const filterName = "random-nebula-blur"

function twoHex(x: number): string {
	return (x < 16 ? "0" : "") + x.toString(16)
}

function twoHexOneBased(x: number): string {
	return twoHex(Math.floor(Math.min(1, x) * 255))
}

function generateColorMults(totalMultAmount = 1): Color {
	let r = Math.random()
	// зеленый всегда должен быть на нуле
	// иначе при применении градиента начинает даваться йобу глубина цвета
	// и появляются "лесенки"
	// и ваще зеленый не смотрится в космосе
	let g = 0 // Math.random();
	let b = Math.random() * 0.5
	const normalizer = totalMultAmount / (r + g + b)
	r *= normalizer
	g *= normalizer
	b *= normalizer
	return {r, g, b}
}

function makeColorStr(mults: Color, power: number): string {
	// return `#${twoHexOneBased(mults.r * power)}${twoHexOneBased(mults.g * power)}${twoHexOneBased(mults.b * power)}`
	void twoHexOneBased
	return `rgba(${mults.r}, ${mults.g}, ${mults.b}, ${power})`
}

export function generateRandomNebula(radius: number): SVGElement {
	const vertex = generateWobblyCirclePoints({
		radius: radius,
		vertexCount: 15,
		wobbliness: 0.9
	})

	const smoothness = 0.2
	let intensity = 0.2
	const colorMult = generateColorMults(255)

	const circles: SVGElement[] = []
	for(let i = 0; i < 15; i++){
		const path = makeBezierSmoothedClosePath(vertex, smoothness)
		// path.setAttribute("filter", `url(#${filterName})`)
		path.setAttribute("fill", makeColorStr(colorMult, intensity))
		path.setAttribute("fill-opacity", intensity.toFixed(2))
		circles.push(path)

		intensity += 0.05
		vertex.forEach(vertex => {
			vertex.x /= 1.15
			vertex.y /= 1.15
		})
	}

	return svgTag({tagName: "g"}, [
		svgTag({tagName: "filter",
			attrs: {
				id: filterName
			}}, [
			svgTag({
				tagName: "feGaussianBlur",
				attrs: {
					in: "SourceGraphic",
					stdDeviation: "15"
				}
			})
		]),
		svgTag({
			tagName: "g",
			attrs: {
				filter: `url(#${filterName})`
			}
		}, circles)
	])
}