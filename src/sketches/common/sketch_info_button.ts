import {addCssToPage} from "./css_utils"
import {tag} from "./dom_utils"
import {sketchDescription} from "./sketch_description"
import {ContentReference, defaultLangKey, TranslatedString} from "./website_common"

function doCss(): void {
	addCssToPage("sketch_info_button", `
.sketch-info-button {
	border-radius: 100%;
	border: 3px solid #fff;
	opacity: 0.75;
	position: absolute;
	top: 0.5rem;
	left: 0.5rem;
	cursor: pointer;
	transition: 0.25s;
	width: 2rem;
    height: 2rem;
    text-align: center;
    font-weight: bold;
    font-size: 2rem;
    color: #fff;
}

.sketch-info-button:hover {
	opacity: 1;
}

.sketch-info-block {
	position: absolute;
	top: 0;
	left: 0;
	border: 2px solid #ddd;
	background: #444;
	color: #ddd;
	padding: 0.5em;
	font-weight: normal;
    border-width: 0 2px 2px 0;
}

.sketch-info-block a {
	color: #fff;
}

.sketch-info-line {
}

.sketch-info-subline {
	margin-left: 0.5em;
	display: block;
}

`)
}

const creationDateStr: TranslatedString = {
	en: "Creation date",
	ru: "Дата создания"
}

const tagsStr: TranslatedString = {
	en: "Tags",
	ru: "Теги"
}

const inspirationStr: TranslatedString = {
	en: "Inspired with",
	ru: "Вдохновлено"
}

const usedContentStr: TranslatedString = {
	en: "Used content",
	ru: "Использованный контент"
}

const closeStr: TranslatedString = {
	en: "Close",
	ru: "Закрыть"
}

let td = (x: number) => x < 10 ? "0" + x : "" + x

let formatDate = (date: Date) => `${date.getFullYear()}.${td(date.getMonth() + 1)}.${td(date.getDate())}`

function renderContentRefList(title: TranslatedString, lang: keyof TranslatedString, items: ContentReference[]): HTMLElement {
	let line = tag({class: "sketch-info-line", text: `${title[lang]}:`})
	items.forEach(item => {
		let subline: HTMLElement
		let text = item.description ? item.description[lang] : item.url || "???"
		if(item.url){
			subline = tag({tagName: "a", href: item.url, text})
		} else {
			subline = tag({text})
		}
		subline.className = "sketch-info-subline"
		line.appendChild(subline)
	})
	return line
}

export function makeSketchInfoButton(): HTMLElement {
	doCss()

	let button = tag({class: "sketch-info-button", text: "i"})
	button.addEventListener("click", () => {
		let block = tag({class: "sketch-info-block"})
		let d = sketchDescription
		let lang = defaultLangKey

		block.appendChild(tag({class: "sketch-info-line", text: d.name[lang]}))
		block.appendChild(tag({class: "sketch-info-line", text: d.description[lang]}))
		block.appendChild(tag({tagName: "hr"}))
		block.appendChild(tag({class: "sketch-info-line", text: `${creationDateStr[lang]}: ${formatDate(d.date)}`}))
		// TODO: links here
		block.appendChild(tag({class: "sketch-info-line", text: `${tagsStr[lang]}: ${d.tags.map(tag => tag.name[lang]).join(", ")}`}))

		if(d.inspiration){
			block.appendChild(renderContentRefList(inspirationStr, lang, d.inspiration))
		}

		if(d.usedContent){
			block.appendChild(renderContentRefList(usedContentStr, lang, d.usedContent))
		}

		let closeBtn = tag({tagName: "input", type: "button", value: closeStr[lang]})
		closeBtn.addEventListener("click", () => block.remove())
		block.appendChild(tag({tagName: "hr"}))
		block.appendChild(closeBtn)

		document.body.appendChild(block)
	})
	document.body.appendChild(button)
	return button
}