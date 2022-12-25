import {MainPage} from "website/controls/main_page"
import {SketchPage} from "website/controls/sketch_page"
import {RouteDescription, Router} from "website/router"
import {sketchDescriptions, SketchId} from "website/sketches"

export function sketchRouteById(id: SketchId): `sketch/${SketchId}` {
	return `sketch/${id}`
}

const sketchRoutes = (() => {
	const res: Record<string, RouteDescription> = {}
	for(const id in sketchDescriptions){
		const sketch = sketchDescriptions[id as SketchId]
		res[sketchRouteById(id as SketchId)] = {
			render: () => SketchPage(sketch),
			title: sketch.name
		}
	}
	return res as {readonly [route in ReturnType<typeof sketchRouteById>]: RouteDescription}
})()

const staticRoutes = {
	"": {
		title: "Nartallax's personal website",
		render: MainPage
	}
}

export const routes = {
	...sketchRoutes,
	...staticRoutes
}

export const router = new Router<keyof typeof routes>(routes, "")