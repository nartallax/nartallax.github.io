import {tag} from "@nartallax/cardboard-dom"
import {SketchBlock} from "website/controls/sketch_block"
import {sketchDescriptions} from "website/sketches"
import * as css from "./main_page.module.scss"

export function MainPage(): HTMLElement {
	return tag({class: css.sketchesContainer},
		Object.values(sketchDescriptions)
			.filter(sketch => !sketch.hidden)
			.map(sketch => SketchBlock(sketch))
	)
}