import {getBinder} from "common/binder/binder"
import {svgTag} from "common/tag"
import {PlanetSimulationBody, PlanetsSimulation} from "sketches/planets/planets_simulation"

interface BodyInternalProps {
	el: SVGCircleElement
	orbitTarget: PlanetSimulationBody[] | null
	orbitZoom: number | null
}

interface BodyBase extends PlanetSimulationBody {
	color: string
	outline: string
	radius: number
}

export type PlanetSimulationBodyWithGraphics = BodyBase & BodyInternalProps

export class PlanetsSimulationWithGraphics {

	readonly svg: SVGSVGElement
	private readonly simulation: PlanetsSimulation<PlanetSimulationBodyWithGraphics>

	constructor(root: HTMLElement, private readonly zoom: number) {
		this.simulation = new PlanetsSimulation()
		this.svg = svgTag({tagName: "svg"})
		root.appendChild(this.svg)
		this.updateSvgSize()
		getBinder(root).onResize(() => this.updateSvgSize())
	}

	private updateSvgSize(): void {
		const root = this.svg.parentElement
		if(!root){
			return
		}
		const w = root.clientWidth
		const h = root.clientHeight
		this.svg.setAttribute("width", w + "")
		this.svg.setAttribute("height", h + "")
		this.svg.setAttribute("viewBox", `${-w / 2} ${-h / 2} ${w} ${h}`)
	}

	private makeBodyElement(base: Omit<BodyBase, "x" | "y" | "xSpeed" | "ySpeed">): SVGCircleElement {
		const el = svgTag({tagName: "circle", attrs: {
			cx: 0, cy: 0, r: base.radius, fill: base.color, stroke: base.outline, "stroke-width": 3
		}})
		this.svg.appendChild(el)
		return el
	}

	addBody(base: BodyBase & Partial<BodyInternalProps>): PlanetSimulationBodyWithGraphics {
		return this.simulation.addBody({
			orbitTarget: null,
			orbitZoom: null,
			...base,
			el: this.makeBodyElement(base)
		})
	}

	addOrbitingBody(args: {orbitTarget: PlanetSimulationBody | PlanetSimulationBody[], body: Omit<BodyBase, "x" | "y" | "xSpeed" | "ySpeed">, distance: number, position?: number, reverse?: boolean, orbitZoom?: number}): PlanetSimulationBodyWithGraphics {
		return this.simulation.addOrbitingBody({
			...args,
			body: {
				...args.body,
				orbitTarget: Array.isArray(args.orbitTarget) ? args.orbitTarget : [args.orbitTarget],
				orbitZoom: args.orbitZoom ?? 1,
				el: this.makeBodyElement(args.body)
			}
		})
	}

	step(deltaTime: number, logicStepCount = 1): void {
		for(let i = 0; i < logicStepCount; i++){
			this.simulation.step(deltaTime / logicStepCount)
		}
		for(const body of this.simulation.bodies){
			const el = body.el!

			let x: number, y: number
			if(!body.orbitTarget || !body.orbitZoom){
				x = body.x
				y = body.y
			} else {
				const orbitTarget = this.simulation.findCenterOfMass(body.orbitTarget)
				const dx = body.x - orbitTarget.x
				const dy = body.y - orbitTarget.y
				let dist = Math.sqrt(dx ** 2 + dy ** 2)
				const angle = Math.atan2(dy, dx)
				dist *= body.orbitZoom
				x = orbitTarget.x + (dist * Math.cos(angle))
				y = orbitTarget.y + (dist * Math.sin(angle))
			}

			el.setAttribute("cx", (x * this.zoom) + "")
			el.setAttribute("cy", (y * this.zoom) + "")
		}
	}

}