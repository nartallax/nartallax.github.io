import {box, constBoxWrap, isRBox, MRBox, WBox} from "@nartallax/cardboard"
import {bindBox, tag} from "@nartallax/cardboard-dom"
import {addCursorMoveHandler, pointerEventsToClientCoords} from "common/input_utils"
import * as css from "./slider.module.scss"

interface Props {
	readonly min: MRBox<number>
	readonly max: MRBox<number>
	readonly step?: number
	readonly value: WBox<number>
	readonly label?: MRBox<string>
	readonly labelWidth?: MRBox<number | string>
}

export const Slider = (props: Props): HTMLElement => {
	const min = constBoxWrap(props.min)
	const max = constBoxWrap(props.max)

	const handle = tag({class: css.handle})
	const handleContainer = tag({class: css.handleContainer}, [handle])
	let root = tag({class: css.slider}, [handleContainer])
	if(props.label){
		const labelWidth = isRBox(props.labelWidth) ? props.labelWidth : box(props.labelWidth)
		root = tag({class: css.sliderRoot}, [
			tag({
				class: css.label,
				style: {
					width: labelWidth.map(x => typeof(x) === "number" ? x + "px" : x ?? "")
				}
			}, [props.label]),
			root
		])
	}

	function updateHandlePos(newValue: number): void {
		handle.style.left = (((newValue - min.get()) / (max.get() - min.get())) * 100) + "%"
	}

	function setValueByEvent(e: MouseEvent | TouchEvent): void {
		const coords = pointerEventsToClientCoords(e)
		const contRect = handleContainer.getBoundingClientRect()

		let progress = (coords.x - contRect.left) / contRect.width
		progress = Math.min(1, Math.max(0, progress))
		let newValue = (progress * (max.get() - min.get())) + min.get()
		if(props.step){
			newValue = Math.round(newValue / props.step) * props.step
		}

		props.value.set(newValue)
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

	bindBox(root, props.value, value => updateHandlePos(value))
	bindBox(root, max, max => {
		if(props.value.get() > max){
			props.value.set(max)
		} else {
			updateHandlePos(props.value.get())
		}
	})
	bindBox(root, min, min => {
		if(props.value.get() < min){
			props.value.set(min)
		} else {
			updateHandlePos(props.value.get())
		}
	})

	return root
}