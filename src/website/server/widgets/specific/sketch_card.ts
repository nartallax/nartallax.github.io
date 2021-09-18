import {contentSet} from "content_set";
import {sketches} from "sketches";
import {Div} from "widgets/generic/div";
import {Picture} from "widgets/generic/picture";
import {PageLink} from "widgets/specific/page_link";
import {TranslatedStr} from "widgets/specific/translated_string";

export const SketchCard = contentSet.addWidgetWithParams<{sketchName: keyof(typeof sketches)}>(
	(_, opts) => {
		let sketch = sketches[opts.sketchName];
		return PageLink({
			href: `./sketch/${opts.sketchName}`,
			class: "sketch-card",
			attrs: {
				"data-sketch-name": opts.sketchName
			}
		}, [
			Div({class: "sketch-card-name"}, TranslatedStr(sketch.name)),
			Picture({ alt: TranslatedStr(sketch.description), src: `/img/sketch_preview/${opts.sketchName}.png` })
		])
	}
)