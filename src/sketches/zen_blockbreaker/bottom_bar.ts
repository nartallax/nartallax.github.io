import {makeBottomBarredScreenContainer} from "common/bottom_bar/bottom_bar"
import {RBox, WBox} from "common/box"
import {Slider} from "common/slider/slider"
import {tag} from "common/tag"
import {Textblock} from "common/textblock"

interface Props {
	readonly speed: WBox<number>
	readonly stats: RBox<number>[]
	colors: readonly number[]
	root: HTMLElement
}

export const makeBottomBar = (props: Props): HTMLElement => {

	const slider = Slider({
		label: "Speed",
		min: 0,
		max: 25,
		value: props.speed,
		step: 1
	})

	const stats = tag({
		style: {
			display: "flex",
			flexDirection: "row",
			gap: "1rem",
			fontWeight: "bold",
			height: "1.25em"
		}
	}, props.stats.map((stat, i) => Textblock({
		value: stat,
		color: props.colors[i + 1],
		bold: true,
		overflow: "hidden",
		width: "3em"
	})))

	return makeBottomBarredScreenContainer({
		contents: [slider, stats],
		parent: props.root
	})
}