import {rgbNumberToColorString} from "common/color_utils"
import {makeSlider} from "common/slider/slider"
import {tag} from "common/tag"
import * as css from "./bottom_bar.module.scss"

interface Props {
	readonly initialSpeed: number
	colors: readonly number[]
	onSpeedChange(newSpeedValue: number): void
}

interface BottomBar {
	root: HTMLElement
	onStatsUpdate(newStats: ReadonlyMap<number, number>): void
}

export const makeBottomBar = (props: Props): BottomBar => {
	const bar = tag({class: css.bottomBar})

	const slider = makeSlider({
		min: 0,
		max: 25,
		startValue: props.initialSpeed,
		onChange: props.onSpeedChange,
		step: 1
	})
	bar.appendChild(slider)

	const statEls = new Map<number, HTMLElement>()
	const statsContainer = tag({class: css.statsContainer})
	bar.appendChild(statsContainer)
	function onStatsUpdate(stats: ReadonlyMap<number, number>): void {
		for(const [color, value] of stats){
			let statEl = statEls.get(color)
			if(!statEl){
				statEl = tag({
					class: css.statEl,
					style: {color: rgbNumberToColorString(props.colors[color] ?? 0)}
				})
				statsContainer.appendChild(statEl)
				statEls.set(color, statEl)
			}
			statEl.textContent = value + ""
		}
	}


	return {root: bar, onStatsUpdate}
}