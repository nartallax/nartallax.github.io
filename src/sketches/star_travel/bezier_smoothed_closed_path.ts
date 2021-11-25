import {Point} from "common/common_types";
import {svgTag} from "common/svg_utils";

/** Имея массив точек, сделать из него сглаженный path  */
export function makeBezierSmoothedClosePath(vertex: Point[], smoothness: number): SVGPathElement {
	function getBezierAt(i: number, firstPoint: boolean): Point {
		let cur = vertex[(i + vertex.length) % vertex.length];
		let prev = vertex[(i + vertex.length - 1) % vertex.length];
		let next = vertex[(i + 1) % vertex.length];
		return calcBezierPoint(cur, prev, next, firstPoint, smoothness);
	}

	// transforming points to svg path string, generating bezier points in process
	let pathStr = `M ${vertex[vertex.length - 1].x} ${vertex[vertex.length - 1].y}`;
	for(let i = 0; i < vertex.length; i++){
		let cur = vertex[i];
		let prevBezier = getBezierAt(i - 1, true);
		let curBezier = getBezierAt(i, false);
		pathStr += `C ${prevBezier.x} ${prevBezier.y}, ${curBezier.x} ${curBezier.y}, ${cur.x} ${cur.y}`
	}

	return svgTag("path", { d: pathStr })
}

function calcBezierPoint(cur: Point, prev: Point, next: Point, firstPoint: boolean, smoothness: number): Point {
	// нам нужно, чтобы точка безье была на линии, параллельной линии prev -> next, проходящей через cur
	// поэтому мы двигаем одну из точек (prev, next) на расстояние от cur до другой из них
	let a = firstPoint? prev: next;
	let b = firstPoint? next: prev;
	let dx = cur.x - a.x;
	let dy = cur.y - a.y;
	let result = {x: b.x + dx, y: b.y + dy}
	// после такого сдвига новая точка действительно лежит на этой линии, но она получается слишком далеко
	// поэтому мы её двигаем ближе к cur
	dx = cur.x - result.x;
	dy = cur.y - result.y;
	result.x = cur.x - (dx * smoothness);
	result.y = cur.y - (dy * smoothness);
	return result;
}