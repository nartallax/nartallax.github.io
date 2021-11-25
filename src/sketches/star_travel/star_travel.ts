import {raf} from "common/animation_utils";
import {addCssToPage} from "common/css_utils";
import {Queue} from "common/queue";
import {svgTag} from "common/svg_utils";
import {generateRandomNebula} from "star_travel/nebula_generator";

export function main(): void {
	let controller = new StarTravelController({
		colors: ["#ddd", "#B2BBFF", "#9EA6FF", "#A3E4FF", "#8CC7FF", "#B596FF"],
		count: 250,
		travelTime: 2500,
		travelTimeDeviation: 0.2
	});
	document.body.style.overflow = "hidden";
	document.body.appendChild(controller.root);
	controller.start();
}

interface StarTravelOpts {
	colors: string[];
	count: number;
	travelTime: number;
	travelTimeDeviation: number;
}

interface Star {
	diesAt: number;
	el: SVGElement;
}


class StarTravelController {

	readonly root: SVGSVGElement;
	private readonly stars = new Queue<Star>()
	private width = 0
	private height = 0
	private starFlightRadius = 0

	constructor(private readonly opts: StarTravelOpts){
		this.root = svgTag("svg", { x: "0", y: "0", class: "startravel-svg" });
	}

	// все начать заново
	private init(): void {
		this.stars.clear();
		let w = this.width = this.root.clientWidth;
		let h = this.height = this.root.clientHeight;
		this.makeCss();
		this.starFlightRadius = Math.sqrt(Math.pow(this.width / 2, 2) + Math.pow(this.height / 2, 2));
		this.root.setAttribute("width", w + "");
		this.root.setAttribute("height", h + "");
		this.root.setAttribute("viewBox", `0 0 ${w} ${h}`);

		this.root.innerHTML = "";
		this.root.appendChild(this.generateBackground());
	}

	private makeCss(): void {
		addCssToPage("star_travel", `
			
			@keyframes startravel-starfly {
				0% { 
					transform: scale(0.1) translate(0, 0);
					opacity: 0;
				}
				50% {
					transform: scale(0.1) translate(0, 0);
					opacity: 1;
				}
				100% { 
					transform: scale(5) translate(100%, 0);
					opacity: 1;
				}
			}

			.startravel-svg {
				position: relative;
				background: #000;
				width: 100%;
				height: 100%;
			}

			.startravel-star > g {
				animation: startravel-starfly 1s cubic-bezier(1,0,1,0);
				animation-fill-mode: forwards;
			}

			.startravel-star circle {
				filter: brightness(200%);
			}
		`)
	}

	private removeOldStars(){
		let now = Date.now();
		while(this.stars.head && this.stars.head.diesAt < now){
			let star = this.stars.dequeue();
			star.el.remove();
		}
	}

	private addNewStars(count = this.opts.count - this.stars.length){
		let offsetPerStar = 1 / count;
		for(let i = count - 1; i >= 0; i--){
			this.addStar(offsetPerStar * i);
		}
	}

	private addStar(animationProgress = 0): void {
		let direction = Math.random() * 360;
		//let travelTime = this.opts.travelTime * (1 + ((Math.random() - 0.5) * this.opts.travelTimeDeviation));
		let travelTime = this.opts.travelTime
		let speed = this.starFlightRadius / travelTime;
		let trackLength = speed * 350;
		let trackWidth = (Math.random() + 0.5) * 10;
		let color = this.opts.colors[Math.floor(Math.random() * this.opts.colors.length)]

		let offsetDistance = ((((this.width + this.height) / 2) * 0.2) * (Math.random() + 0.15));
		let timeOffset = animationProgress * travelTime
		
		let star: Star = {
			diesAt: Date.now() + travelTime - timeOffset,
			el: svgTag("g", {
				class: "startravel-star",
				transform: `translate(${this.width / 2}, ${this.height / 2}) rotate(${direction}) translate(${offsetDistance}, 0)`,
				children: [svgTag("g", {
					style: `animation-duration: ${travelTime / 1000}s;animation-delay: ${-timeOffset / 1000}s`,
					children: [
						svgTag("path", {
							d: `M ${-trackLength} 0 L 0 ${trackWidth / 2} A ${trackWidth / 2} ${trackWidth / 2} 0 0 0 0 ${-trackWidth / 2} z`,
							fill: color
						}),
						svgTag("circle", {
							cx: 0,
							cy: 0,
							r: trackWidth / 3,
							fill: color
						})
					]
				})]
			})
		}

		this.stars.enqueue(star);
		this.root.appendChild(star.el);
	}

	start(){
		this.init();
		raf(timePassed => {
			if(timePassed > 1000 || this.root.clientWidth !== this.width || this.root.clientHeight !== this.height){
				this.init();
				return;
			}
			this.removeOldStars();
			this.addNewStars();
		});
	}

	private generateBackground(): SVGElement {
		let nebulae = [] as SVGElement[];
		for(let i = 0; i < 2; i++){
			let nebula = generateRandomNebula();
			nebulae.push(nebula);
			let dx = (Math.random() - 0.5) * (this.width / 3);
			let dy = (Math.random() - 0.5) * (this.height / 3);
			nebula.setAttribute("transform", `translate(${(this.width / 2) + dx}, ${(this.height / 2) + dy})`);
		}
		return svgTag("g", {children: nebulae});
	}

}