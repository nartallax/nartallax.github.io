import {svgTag} from "common/tag"
import {Point} from "sketches/star_travel/wobbly_circle"

/** Имея массив точек, сделать из него сглаженный path  */
export function makeBezierSmoothedClosePath(vertex: Point[], smoothness: number): SVGPathElement {
	function getBezierAt(i: number, firstPoint: boolean): Point {
		const cur = vertex[(i + vertex.length) % vertex.length]!
		const prev = vertex[(i + vertex.length - 1) % vertex.length]!
		const next = vertex[(i + 1) % vertex.length]!
		return calcBezierPoint(cur, prev, next, firstPoint, smoothness)
	}

	// transforming points to svg path string, generating bezier points in process
	let pathStr = `M ${vertex[vertex.length - 1]!.x} ${vertex[vertex.length - 1]!.y}`
	for(let i = 0; i < vertex.length; i++){
		const cur = vertex[i]!
		const prevBezier = getBezierAt(i - 1, true)
		const curBezier = getBezierAt(i, false)
		pathStr += `C ${prevBezier.x} ${prevBezier.y}, ${curBezier.x} ${curBezier.y}, ${cur.x} ${cur.y}`
	}

	return svgTag({tagName: "path", attrs: {d: pathStr}})
}

function calcBezierPoint(cur: Point, prev: Point, next: Point, firstPoint: boolean, smoothness: number): Point {
	// нам нужно, чтобы точка безье была на линии, параллельной линии prev -> next, проходящей через cur
	// поэтому мы двигаем одну из точек (prev, next) на расстояние от cur до другой из них
	const a = firstPoint ? prev : next
	const b = firstPoint ? next : prev
	let dx = cur.x - a.x
	let dy = cur.y - a.y
	const result = {x: b.x + dx, y: b.y + dy}
	// после такого сдвига новая точка действительно лежит на этой линии, но она получается слишком далеко
	// поэтому мы её двигаем ближе к cur
	dx = cur.x - result.x
	dy = cur.y - result.y
	result.x = cur.x - (dx * smoothness)
	result.y = cur.y - (dy * smoothness)
	return result
}