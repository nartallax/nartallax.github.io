/** Returns parts of SVG string that form Catmull-Rom smoothed curve, passing through all the points.
Those parts can be .join(" ")-ed it to have a complete "d" attribute value for <path> */
export const getCatmullRomSvgPathForDotSequence = (points: {x: number, y: number}[], k: number = 1): (string | number)[] => {
	const size = points.length
	const result: (string | number)[] = ["M", points[0]!.x, points[0]!.y]

	for(let i = 0; i < size; i++){
		const {x: x0, y: y0} = points[((i - 1) + size) % size]!
		const {x: x1, y: y1} = points[i]!
		const {x: x2, y: y2} = points[(i + 1) % size]!
		const {x: x3, y: y3} = points[(i + 2) % size]!

		const cp1x = x1 + (x2 - x0) / 6 * k
		const cp1y = y1 + (y2 - y0) / 6 * k

		const cp2x = x2 - (x3 - x1) / 6 * k
		const cp2y = y2 - (y3 - y1) / 6 * k

		result.push("C", cp1x, cp1y, cp2x, cp2y, x2, y2)
	}

	return result
}