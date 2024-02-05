import {svgTag} from "common/tag"
import {TimedQueue} from "common/timed_queue"

interface Point {
	x: number
	y: number
	angle: number
}

export class BallTail {
	private readonly queue = new TimedQueue<Point>()
	readonly el: SVGPathElement

	constructor(private readonly timeLimit: number, color: string) {
		this.el = svgTag({tagName: "path", attrs: {stroke: "none", fill: color, "stroke-width": "0.01"}})
	}

	private addPoint(time: number, x: number, y: number): void {
		const prevPoint = this.queue.tail
		const angle = !prevPoint ? 0 : Math.atan2(prevPoint.y - y, prevPoint.x - x) + Math.PI / 2
		this.queue.enqueue(time, {x, y, angle})
	}

	private updatePath(): void {
		let start = ""
		let leftSide = ""
		let rightSide = ""
		const segments = this.queue.toArray()
		let size = 0
		const segmentSizeIncrement = 0.5 / segments.length
		for(const {x, y, angle} of segments){
			if(!start){
				start = `M ${x} ${y}`
			} else {
				const sin = Math.sin(angle)
				const cos = Math.cos(angle)
				leftSide += ` L ${x - cos * size} ${y - sin * size}`
				rightSide = `L ${x + cos * size} ${y + sin * size}` + rightSide
			}
			size += segmentSizeIncrement
		}
		const result = start + leftSide + rightSide + " z"
		this.el.setAttribute("d", result)
	}

	update(time: number, x: number, y: number): void {
		this.addPoint(time, x, y)
		this.queue.dropUntil(time - this.timeLimit)
		this.updatePath()
	}
}