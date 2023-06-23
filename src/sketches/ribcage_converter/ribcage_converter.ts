import {tag} from "common/tag"
import {convertTypescriptToRibcage} from "sketches/ribcage_converter/ribcage_converter_algo"
import {handleTabPress} from "sketches/ribcage_converter/tab_press_handling"
import {router} from "website/routes"
import * as css from "./ribcage_converter.module.scss"

const hashArgName = "input"

export function main(root: HTMLElement): void {
	const input = tag({tagName: "textarea", class: css.source})
	const output = tag({class: css.output})
	const copyButton = tag({
		tagName: "button",
		text: "Copy",
		class: css.copyButton,
		on: {click: copyResult}
	})
	const container = tag({class: css.root}, [input, output, copyButton])
	root.appendChild(container)
	input.focus()

	function copyResult(): void {
		navigator.clipboard.writeText(output.textContent + "")
		copyButton.textContent = "Copied!"
		copyButton.classList.add(css.onTimeout!)
		setTimeout(() => {
			copyButton.textContent = "Copy"
			copyButton.classList.remove(css.onTimeout!)
		}, 1000)
	}

	function onChange(e?: Event): void {
		if(e instanceof KeyboardEvent && e.key === "Tab"){
			e.preventDefault()
			if(e.type === "keydown"){
				const [value, start, end] = handleTabPress(input.value, input.selectionStart, input.selectionEnd, e.shiftKey)
				input.value = value
				input.selectionStart = start
				input.selectionEnd = end
			}
		}

		const inputStr = input.value
		router.setArgument(hashArgName, inputStr || undefined)
		let result: string
		try {
			result = convertTypescriptToRibcage(inputStr)
		} catch(e){
			result = (e instanceof Error ? e.stack || e : e) + ""
		}
		output.textContent = result
	}

	input.addEventListener("change", onChange, {passive: true})
	input.addEventListener("keydown", onChange)
	input.addEventListener("keyup", onChange)
	input.addEventListener("keypress", onChange)
	input.addEventListener("paste", onChange, {passive: true})

	input.value = (router.getArgument(hashArgName) ?? "") + ""
	onChange()
}