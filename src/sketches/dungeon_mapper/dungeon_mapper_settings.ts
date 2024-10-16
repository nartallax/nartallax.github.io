import {tag} from "@nartallax/cardboard-dom"
import * as css from "./dungeon_mapper.module.scss"

export type DungeonMapperSettings = {
	seed: number
	width: number
	height: number
	// 0-1, how much of the map belongs to rooms
	// higher values = longer gen time, up to infinity
	roomDensity: number
	// 1-inf
	averageRoomConnectionsCount: number
}

export const makeSettingsControl = (defaultSettings: DungeonMapperSettings, onChange: (settings: DungeonMapperSettings) => void) => {
	let settings = {...defaultSettings}
	return tag({class: css.inputsColumn}, [
		makeInput({
			label: "Seed",
			min: Number.MIN_SAFE_INTEGER,
			max: Number.MAX_SAFE_INTEGER,
			defaultValue: defaultSettings.seed,
			onChange: seed => onChange(settings = {...settings, seed}),
			rightButton: {
				text: "Roll",
				onClick: input => input.value = (Math.floor(Math.random() * 0xffffffff) + "")
			}
		}),
		makeInput({
			label: "Width",
			min: 1,
			max: 100,
			defaultValue: defaultSettings.width,
			onChange: width => onChange(settings = {...settings, width}),
			leftButton: {text: "-", onClick: (input, value) => input.value = (value - 1) + ""},
			rightButton: {text: "+", onClick: (input, value) => input.value = (value + 1) + ""}
		}),
		makeInput({
			label: "Height",
			min: 1,
			max: 100,
			defaultValue: defaultSettings.height,
			onChange: height => onChange(settings = {...settings, height}),
			leftButton: {text: "-", onClick: (input, value) => input.value = (value - 1) + ""},
			rightButton: {text: "+", onClick: (input, value) => input.value = (value + 1) + ""}
		}),
		makeInput({
			label: "Density",
			min: 0.25,
			max: 0.75,
			defaultValue: defaultSettings.roomDensity,
			onChange: roomDensity => onChange(settings = {...settings, roomDensity}),
			leftButton: {text: "-", onClick: (input, value) => input.value = (value - 0.05) + ""},
			rightButton: {text: "+", onClick: (input, value) => input.value = (value + 0.05) + ""}
		}),
		makeInput({
			label: "Connections",
			min: 1,
			max: 5,
			defaultValue: defaultSettings.averageRoomConnectionsCount,
			onChange: averageRoomConnectionsCount => onChange(settings = {...settings, averageRoomConnectionsCount}),
			leftButton: {text: "-", onClick: (input, value) => input.value = (value - 0.25) + ""},
			rightButton: {text: "+", onClick: (input, value) => input.value = (value + 0.25) + ""}
		})
	])

}

type ButtonOpts = {text: string, onClick: (input: HTMLInputElement, value: number) => void}

type InputOpts = {
	label: string
	leftButton?: ButtonOpts
	rightButton?: ButtonOpts
	defaultValue: number
	min: number
	max: number
	onChange: (newValue: number) => void
}
const makeInput = (opts: InputOpts): HTMLElement => {
	let lastKnownValue = opts.defaultValue

	const makeButton = (opts?: ButtonOpts): HTMLElement | null => !opts ? null : tag({
		tag: "input",
		attrs: {type: "button", value: opts.text},
		onClick: () => {
			opts.onClick(input, lastKnownValue)
			checkChange(true)
		}
	})

	const checkChange = (allowUpdate: boolean) => {
		let value = parseFloat(input.value)
		if(value === lastKnownValue){
			return
		}

		if(Number.isNaN(value)){
			value = opts.defaultValue
		}
		if(value < opts.min){
			value = opts.min
		}
		if(value > opts.max){
			value = opts.max
		}
		if(value !== lastKnownValue && allowUpdate){
			input.value = value + ""
		}
		lastKnownValue = value
		opts.onChange(value)
	}

	const input = tag({
		tag: "input",
		attrs: {
			type: "text"
		},
		onBlur: () => checkChange(true),
		onKeyup: () => checkChange(false),
		onChange: () => checkChange(false)
	})

	input.value = lastKnownValue + ""
	const leftButton = makeButton(opts.leftButton)
	const rightButton = makeButton(opts.rightButton)

	const result = tag({class: css.inputWrap}, [
		tag({class: css.inputLabel}, [opts.label]),
		leftButton,
		input,
		rightButton
	])

	return result

}