import {tag} from "common/tag"
import {SketchInfoButton} from "website/controls/sketch_info_button"
import {router} from "website/routes"
import {SketchDescription} from "website/sketches"
import * as css from "./sketch_page.module.scss"

export const noSketchInfoOnSketchPageArgName = "no_sketch_info"

export function SketchPage(sketch: SketchDescription): HTMLElement {
	const root = tag({class: css.sketchRoot})

	const noSketchInfo = router.getArgument(noSketchInfoOnSketchPageArgName);

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
		root,
		noSketchInfo ? null : SketchInfoButton(sketch)
	])
}