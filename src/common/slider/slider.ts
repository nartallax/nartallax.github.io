import {getBinder} from "common/binder/binder"
import {box, isRBox, MaybeRBoxed, WBox} from "common/box"
import {addCursorMoveHandler, pointerEventsToClientCoords} from "common/input_utils"
import {tag} from "common/tag"
import * as css from "./slider.module.scss"

interface Props {
	readonly min: MaybeRBoxed<number>
	readonly max: MaybeRBoxed<number>
	readonly step?: number
	readonly value: WBox<number>
	readonly label?: MaybeRBoxed<string>
	readonly labelWidth?: MaybeRBoxed<number | string>
}

export const Slider = (props: Props): HTMLElement => {
	const min = isRBox(props.min) ? props.min : box(props.min)
	const max = isRBox(props.max) ? props.max : box(props.max)

	const handle = tag({class: css.handle})
	const handleContainer = tag({class: css.handleContainer}, [handle])
	let root = tag({class: css.slider}, [handleContainer])
	if(props.label){
		const labelWidth = isRBox(props.labelWidth) ? props.labelWidth : box(props.labelWidth)
		root = tag({class: css.sliderRoot}, [
			tag({
				class: css.label,
				text: props.label,
				style: {
					width: labelWidth.map(x => typeof(x) === "number" ? x + "px" : x ?? "")
				}
			}),
			root
		])
	}

	function updateHandlePos(newValue: number): void {
		handle.style.left = (((newValue - min()) / (max() - min())) * 100) + "%"
	}

	function setValueByEvent(e: MouseEvent | TouchEvent): void {
		const coords = pointerEventsToClientCoords(e)
		const contRect = handleContainer.getBoundingClientRect()

		let progress = (coords.x - contRect.left) / contRect.width
		progress = Math.min(1, Math.max(0, progress))
		let newValue = (progress * (max() - min())) + min()
		if(props.step){
			newValue = Math.round(newValue / props.step) * props.step
		}

		props.value(newValue)
	}

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

	const binder = getBinder(root)
	binder.watchAndRun(props.value, value => updateHandlePos(value))
	binder.watchAndRun(max, max => {
		if(props.value() > max){
			props.value(max)
		} else {
			updateHandlePos(props.value())
		}
	})
	binder.watchAndRun(min, min => {
		if(props.value() < min){
			props.value(min)
		} else {
			updateHandlePos(props.value())
		}
	})

	return root
}