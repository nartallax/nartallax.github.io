import {tag} from "common/tag"
import {SketchInfoButton} from "website/controls/sketch_info_button"
import {SketchDescription} from "website/sketches"
import * as css from "./sketch_page.module.scss"

export function SketchPage(sketch: SketchDescription): HTMLElement {
	const root = tag({class: css.sketchRoot});

	(async() => {
		try {
			const code = await sketch.code()
			code.main(root)
		} catch(e){
			console.log(e)
			root.textContent = "Failed to load sketch."
		}
	})()

	return tag({class: css.sketchRoot}, [
		SketchInfoButton(sketch),
		root
	])
}