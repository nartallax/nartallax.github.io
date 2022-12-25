import {tag} from "common/tag"
import {router, sketchRouteById} from "website/routes"
import {sketchDescriptions} from "website/sketches"

export function MainPage(): HTMLElement {
	return tag(Object.values(sketchDescriptions)
		.filter(sketch => !sketch.hidden)
		.map(sketch => tag({
			tagName: "button",
			text: sketch.name,
			on: {click: () => router.goTo(sketchRouteById(sketch.id))}
		}))
	)
}