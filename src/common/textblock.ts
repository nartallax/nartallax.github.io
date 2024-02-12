import {constBoxWrap, MRBox} from "@nartallax/cardboard"
import {tag} from "@nartallax/cardboard-dom"
import {rgbNumberToColorString} from "common/color_utils"

interface Props {
	readonly value: MRBox<string | number>
	readonly color?: MRBox<string | number>
	readonly width?: MRBox<string | number>
	readonly bold?: MRBox<boolean>
	readonly overflow?: MRBox<"hidden" | "auto">
}

export const Textblock = (props: Props): HTMLElement => {
	return tag({
		style: {
			color: constBoxWrap(props.color).map(color => typeof(color) === "number" ? rgbNumberToColorString(color) : color ?? ""),
			fontWeight: constBoxWrap(props.bold).map(bold => bold ? "bold" : "normal"),
			width: constBoxWrap(props.width).map(width => typeof(width) === "number" ? width + "px" : width ?? ""),
			overflow: props.overflow
		}
	}, [props.value])
}