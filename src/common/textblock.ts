import {box, isRBox, MaybeRBoxed} from "common/box"
import {rgbNumberToColorString} from "common/color_utils"
import {tag} from "common/tag"

interface Props {
	readonly value: MaybeRBoxed<string | number>
	readonly color?: MaybeRBoxed<string | number>
	readonly width?: MaybeRBoxed<string | number>
	readonly bold?: MaybeRBoxed<boolean>
	readonly overflow?: MaybeRBoxed<"hidden" | "auto">
}

export const Textblock = (props: Props): HTMLElement => {
	const color = isRBox(props.color) ? props.color : box(props.color)
	const bold = isRBox(props.bold) ? props.bold : box(props.bold)
	const width = isRBox(props.width) ? props.width : box(props.width)
	return tag({
		text: props.value,
		style: {
			color: color.map(color => typeof(color) === "number" ? rgbNumberToColorString(color) : color ?? ""),
			fontWeight: bold.map(bold => bold ? "bold" : "normal"),
			width: width.map(width => typeof(width) === "number" ? width + "px" : width ?? ""),
			overflow: props.overflow
		}
	})
}