import {tag} from "common/tag"
import {ContentReference, SketchDescription} from "website/sketches"
import * as css from "./sketch_info_button.module.scss"

const td = (x: number) => x < 10 ? "0" + x : "" + x

const formatDate = (date: Date) => `${date.getFullYear()}.${td(date.getMonth() + 1)}.${td(date.getDate())}`

function renderContentRefList(title: string, items: ContentReference[]): HTMLElement {
	const line = tag({class: "sketch-info-line", text: `${title}:`})
	items.forEach(item => {
		let subline: HTMLElement
		const text = item.description ?? item.url ?? "???"
		if(item.url){
			subline = tag({tagName: "a", attrs: {href: item.url}, text})
		} else {
			subline = tag({text})
		}
		subline.className = css.sketchInfoSubline ?? ""
		line.appendChild(subline)
	})
	return line
}

export function SketchInfoButton(d: SketchDescription): HTMLElement {
	const button = tag({class: css.sketchInfoButton, text: "i"})
	button.addEventListener("click", () => {
		const block = tag({class: css.sketchInfoBlock})

		block.appendChild(tag({text: d.name}))
		block.appendChild(tag({text: d.description}))
		block.appendChild(tag({tagName: "hr"}))
		block.appendChild(tag({text: `Created at: ${formatDate(d.date)}`}))
		// TODO: links here
		block.appendChild(tag({text: `Tags: ${d.tags.map(tag => tag.name).join(", ")}`}))

		if(d.inspiration){
			block.appendChild(renderContentRefList("Inspired with", d.inspiration))
		}

		if(d.usedContent){
			block.appendChild(renderContentRefList("Used content", d.usedContent))
		}

		block.appendChild(tag({tagName: "hr"}))
		block.appendChild(tag({tagName: "button", text: "Close", on: {click: () => block.remove()}}))

		document.body.appendChild(block)
	})
	document.body.appendChild(button)
	return button
}