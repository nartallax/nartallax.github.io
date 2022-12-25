import {getTitleBox} from "common/get_title_box"
import {getLocationHashBox} from "common/location_hash_box"

export type RouteDescription = {
	title: string
	render(): Element
}

export type RouteMap<R extends string> = {readonly [route in R]: RouteDescription}

export class Router<R extends string> {

	private readonly hashBox = getLocationHashBox()
	private readonly titleBox = getTitleBox()
	private root: Element | null = null

	constructor(private readonly routes: RouteMap<R>, private readonly defaultRoute: R) {
	}

	startAt(root: Element): void {
		if(this.root){
			throw new Error("Router already started")
		}
		this.root = root
		this.hashBox.subscribe(() => this.checkHash())
		this.checkHash()
	}


	goTo(route: R): void {
		this.hashBox(route)
	}

	private checkHash(): void {
		const route = this.hashBox() as R
		const description = this.routes[route]
		if(!description){
			this.hashBox(this.defaultRoute)
			return
		}

		return this.renderRoute(description)
	}

	private renderRoute(description: RouteDescription): void {
		const {title, render} = description
		if(!this.root){
			throw new Error("Router not started")
		}

		while(this.root.firstChild){
			this.root.firstChild.remove()
		}
		this.root.appendChild(render())
		this.titleBox(title)
	}

}