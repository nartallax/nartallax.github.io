import {addCursorMoveHandler, pointerEventsToClientCoords} from "common/input_utils"
import {tag} from "common/tag"
import * as css from "./slider.module.scss"

interface Props {
	readonly min: number
	readonly max: number
	readonly step?: number
	readonly startValue: number
	onChange(newValue: number): void
}

export const makeSlider = (props: Props): HTMLElement => {
	const root = tag({class: css.slider})
	const handle = tag({class: css.handle})
	root.appendChild(handle)
	let value = Number.NaN

	function setValue(newValue: number): void {
		if(newValue === value){
			return
		}

		value = Math.min(props.max, Math.max(props.min, newValue))
		handle.style.left = (((value - props.min) / (props.max - props.min)) * 100) + "%"
	}

	function setValueByEvent(e: MouseEvent | TouchEvent): void {
		const coords = pointerEventsToClientCoords(e)
		const rootRect = root.getBoundingClientRect()

		const progress = (coords.x - rootRect.left) / rootRect.width
		let newValue = (progress * (props.max - props.min)) + props.min
		if(props.step){
			newValue = Math.round(newValue / props.step) * props.step
		}

		setValue(newValue)
		props.onChange(value)
	}

	setValue(props.startValue)

	addCursorMoveHandler({
		element: handle,
		onMove: setValueByEvent
	})

	const onSliderBodyClick = (e: MouseEvent | TouchEvent) => {
		if(e.target === handle){
			return
		}

		setValueByEvent(e)
	}

	root.addEventListener("click", onSliderBodyClick)

	return root
}