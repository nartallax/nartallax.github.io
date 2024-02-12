import {tag} from "@nartallax/cardboard-dom"
import {ContentReference, SketchDescription} from "website/sketches"
import * as css from "./sketch_info_button.module.scss"

const td = (x: number) => x < 10 ? "0" + x : "" + x

const formatDate = (date: Date) => `${date.getFullYear()}.${td(date.getMonth() + 1)}.${td(date.getDate())}`

function renderContentRefList(title: string, items: ContentReference[]): HTMLElement {
	const line = tag({class: "sketch-info-line"}, [`${title}:`])
	items.forEach(item => {
		let subline: HTMLElement
		const text = item.description ?? item.url ?? "???"
		if(item.url){
			subline = tag({tag: "a", attrs: {href: item.url, target: "_blank", rel: "noopener noreferrer"}}, [text])
		} else {
			subline = tag([text])
		}
		subline.className = css.sketchInfoSubline ?? ""
		line.appendChild(subline)
	})
	return line
}

const getPosStyle = (_pos: SketchDescription["infoButtonPosition"], margin: string) => {
	const pos = _pos ?? "topLeft"
	const posIsTop = pos === "topLeft" || pos === "topRight"
	const posIsLeft = pos === "topLeft" || pos === "bottomLeft"
	return {
		top: posIsTop ? margin : undefined,
		bottom: posIsTop ? undefined : margin,
		left: posIsLeft ? margin : undefined,
		right: posIsLeft ? undefined : margin
	}
}

export function SketchInfoButton(d: SketchDescription): HTMLElement {
	const button = tag({
		class: css.sketchInfoButton,
		style: getPosStyle(d.infoButtonPosition, "0.5rem")
	}, ["i"])
	button.addEventListener("click", () => {
		const block = tag({
			class: css.sketchInfoBlock,
			style: getPosStyle(d.infoButtonPosition, "0px")
		})

		block.appendChild(tag([d.name]))
		block.appendChild(tag([d.description]))
		block.appendChild(tag({tag: "hr"}))
		block.appendChild(tag([`Created at: ${formatDate(d.date)}`]))
		// TODO: links here
		block.appendChild(tag([`Tags: ${d.tags.map(tag => tag.name).join(", ")}`]))

		if(d.inspiration){
			block.appendChild(renderContentRefList("Inspired with", d.inspiration))
		}

		if(d.usedContent){
			block.appendChild(renderContentRefList("Used content", d.usedContent))
		}

		block.appendChild(tag({tag: "hr"}))
		block.appendChild(tag({tag: "button", onClick: () => block.remove()}, ["Close"]))

		button.after(block)
	})
	document.body.appendChild(button)
	return button
}