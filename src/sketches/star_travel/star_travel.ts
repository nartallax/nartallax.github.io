import {cycledRequestAnimationFrame} from "common/cycled_request_animation_frame"
import {Queue} from "common/queue"
import {svgTag} from "common/tag"
import {generateRandomNebula} from "./nebula_generator"
import * as css from "./star_travel.module.scss"

export function main(root: HTMLElement): void {
	const controller = new StarTravelController({
		colors: ["#ddd", "#B2BBFF", "#9EA6FF", "#A3E4FF", "#8CC7FF", "#B596FF"],
		count: 100,
		travelTime: 2500,
		travelTimeDeviation: 0.2
	})
	root.appendChild(controller.root)
	controller.start()
}

interface StarTravelOpts {
	colors: string[]
	count: number
	travelTime: number
	travelTimeDeviation: number
}

interface Star {
	diesAt: number
	el: SVGElement
}


class StarTravelController {

	readonly root: SVGSVGElement
	private readonly stars = new Queue<Star>()
	private width = 0
	private height = 0
	private starFlightRadius = 0

	constructor(private readonly opts: StarTravelOpts) {
		this.root = svgTag({tagName: "svg", attrs: {x: "0", y: "0"}, class: css.startravelSvg})
	}

	private init(): void {
		this.stars.clear()
		const w = this.width = this.root.clientWidth
		const h = this.height = this.root.clientHeight
		this.starFlightRadius = Math.sqrt(Math.pow(this.width / 2, 2) + Math.pow(this.height / 2, 2))
		this.root.setAttribute("width", w + "")
		this.root.setAttribute("height", h + "")
		this.root.setAttribute("viewBox", `0 0 ${w} ${h}`)

		this.root.innerHTML = ""
		this.root.appendChild(this.generateBackground())
	}

	private removeOldStars() {
		const now = Date.now()
		while(this.stars.head && this.stars.head.diesAt < now){
			const star = this.stars.dequeue()
			star.el.remove()
		}
	}

	private addNewStars(count = this.opts.count - this.stars.length) {
		const offsetPerStar = 1 / count
		for(let i = count - 1; i >= 0; i--){
			this.addStar(offsetPerStar * i)
		}
	}

	private addStar(animationProgress = 0): void {
		const direction = Math.random() * 360
		// let travelTime = this.opts.travelTime * (1 + ((Math.random() - 0.5) * this.opts.travelTimeDeviation));
		const travelTime = this.opts.travelTime
		const speed = this.starFlightRadius / travelTime
		const trackLength = speed * 350
		const trackWidth = (Math.random() + 0.5) * 10
		const color = this.opts.colors[Math.floor(Math.random() * this.opts.colors.length)]

		const offsetDistance = ((((this.width + this.height) / 2) * 0.2) * (Math.random() + 0.15))
		const timeOffset = animationProgress * travelTime

		const star: Star = {
			diesAt: Date.now() + travelTime - timeOffset,
			el: svgTag({
				tagName: "g",
				class: css.startravelStar,
				attrs: {
					transform: `translate(${this.width / 2}, ${this.height / 2}) rotate(${direction}) translate(${offsetDistance}, 0)`
				}
			}, [svgTag({
				tagName: "g",
				attrs: {
					style: `animation-duration: ${travelTime / 1000}s;animation-delay: ${-timeOffset / 1000}s`
				}
			}, [
				svgTag({
					tagName: "path",
					attrs: {
						d: `M ${-trackLength} 0 L 0 ${trackWidth / 2} A ${trackWidth / 2} ${trackWidth / 2} 0 0 0 0 ${-trackWidth / 2} z`,
						fill: color
					}
				}),
				svgTag({
					tagName: "circle",
					attrs: {
						cx: 0,
						cy: 0,
						r: trackWidth / 3,
						fill: color
					}
				})
			]
			)]
			)
		}

		this.stars.enqueue(star)
		this.root.appendChild(star.el)
	}

	start() {
		this.init()
		cycledRequestAnimationFrame(timePassed => {
			if(timePassed > 1000 || this.root.clientWidth !== this.width || this.root.clientHeight !== this.height){
				this.init()
				return
			}
			// void this.removeOldStars, void this.addNewStars
			this.removeOldStars()
			this.addNewStars()
		})
	}

	private generateBackground(): SVGElement {
		const nebulae = [] as SVGElement[]
		for(let i = 0; i < 2; i++){
			const nebula = generateRandomNebula(Math.min(this.width + this.height) / 3)
			nebulae.push(nebula)
			const dx = (Math.random() - 0.5) * (this.width / 3)
			const dy = (Math.random() - 0.5) * (this.height / 3)
			nebula.setAttribute("transform", `translate(${(this.width / 2) + dx}, ${(this.height / 2) + dy})`)
		}
		return svgTag({tagName: "g", class: css.startravelBackground}, nebulae)
	}

}