import {getTitleBox} from "common/get_title_box"
import {getLocationHashBox} from "common/location_hash_box"

export type RouteDescription = {
	title: string
	render(): Element
}

export type RouteMap<R extends string> = {readonly [route in R]: RouteDescription}

type RouteArgumentValue = string | true
type RouteArgs = Record<string, RouteArgumentValue>

export class Router<R extends string> {

	private readonly hashBox = getLocationHashBox()
	private readonly titleBox = getTitleBox()
	private root: Element | null = null
	private currentArgs: RouteArgs = {}
	private currentRoute: R

	constructor(private readonly routes: RouteMap<R>, private readonly defaultRoute: R) {
		this.currentRoute = defaultRoute
	}

	startAt(root: Element): void {
		if(this.root){
			throw new Error("Router already started")
		}
		this.root = root
		this.hashBox.subscribe(() => this.checkHash())
		this.checkHash()
	}

	formRouteURL(route: R, args?: RouteArgs): string {
		const base = (window.location + "").replace(/#.*?$/, "")
		const hash = this.formHash(route, args ?? {})
		return !hash ? base : base + "#" + hash
	}

	goTo(route: R, args?: RouteArgs): void {
		this.hashBox(this.formHash(route, args ?? {}))
	}

	getArgument(name: string): RouteArgumentValue | undefined {
		return this.currentArgs[name]
	}

	setArgument(name: string, value: RouteArgumentValue | undefined): void {
		const newArgs = {...this.currentArgs}
		if(value === undefined){
			delete newArgs[name]
		} else {
			newArgs[name] = value
		}
		this.hashBox(this.formHash(this.currentRoute, newArgs))
	}

	private checkHash(): void {
		const [route, args] = this.parseHash(this.hashBox())
		if(route === this.currentRoute){
			return // just a change in arguments, no reason to panic
		}

		const description = this.routes[route]
		if(!description){
			this.hashBox(this.defaultRoute)
			return
		}

		this.currentRoute = route
		this.currentArgs = args
		return this.renderRoute(description)
	}

	private parseHash(hash: string): [R, RouteArgs] {
		const args: RouteArgs = {}
		const [routePart, argsPart] = hash.split("?")
		if(argsPart){
			for(const kv of argsPart.split("&")){
				const [k, v] = kv.split("=").map(part => decodeURIComponent(part))
				if(!k){
					continue
				}

				args[k] = v ?? true
			}
		}

		return [routePart as R, args]
	}

	private formHash(route: R, args: RouteArgs): string {
		let result: string = route
		let first = true
		for(const [k, v] of Object.entries(args)){
			result += first ? ((first = false), "?") : "&"
			result += encodeURIComponent(k)
			if(v !== true){
				result += "=" + encodeURIComponent(v + "")
			}
		}
		return result
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