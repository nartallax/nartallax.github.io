import {FieldsOfObjectWithType, WritableKeysOf} from "./type_utils"

type CssStyleAssignableKeys = WritableKeysOf<CSSStyleDeclaration> & FieldsOfObjectWithType<CSSStyleDeclaration, string>

export interface HTMLTagDescription<K extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> extends Record<string, unknown> {
	tagName?: K
	text?: string
	class?: string | (string | null | undefined)[]
	style?: {[k in CssStyleAssignableKeys]?: string}
}

export type HtmlTaggable = HTMLElement | HTMLTagDescription | null | undefined

type ChildArray = HtmlTaggable[]

export function tag(): HTMLDivElement
export function tag<K extends keyof HTMLElementTagNameMap = "div">(description: HTMLTagDescription<K>): HTMLElementTagNameMap[K]
export function tag(children: ChildArray): HTMLDivElement
export function tag<K extends keyof HTMLElementTagNameMap = "div">(description: HTMLTagDescription<K>, children: ChildArray): HTMLElementTagNameMap[K]

export function tag<K extends keyof HTMLElementTagNameMap = "div">(a?: HTMLTagDescription<K> | ChildArray, b?: ChildArray): HTMLElementTagNameMap[K] {
	let description: HTMLTagDescription<K>
	let children: ChildArray | undefined = undefined
	if(!a){
		description = {}
		children = b || undefined
	} else if(Array.isArray(a)){
		description = {}
		children = a
	} else {
		description = a
		children = b || undefined
	}

	let res = document.createElement(description.tagName || "div")

	for(let k in description){
		let v = description[k]
		switch(k){
			case "tagName":
				break
			case "text":
				res.textContent = v + ""
				break
			case "class":
				res.className = Array.isArray(v) ? v.filter(x => !!x).join(" ") : v + ""
				break
			case "style":{
				let styleData = v as HTMLTagDescription["style"]
				for(let key in styleData){
					res.style[key as CssStyleAssignableKeys] = styleData[key as CssStyleAssignableKeys] + ""
				}
				break
			}
			default:
				res.setAttribute(k, v + "")
				break
		}
	}

	if(children){
		for(let child of children){
			if(!child){
				continue
			}
			res.appendChild(child instanceof HTMLElement ? child : tag(child))
		}
	}

	return res as HTMLElementTagNameMap[K]
}

export function toHtmlTag(taggable: HtmlTaggable): HTMLElement | null {
	return !taggable ? null
		: taggable instanceof HTMLElement ? taggable
			: tag(taggable)
}

export function waitLoadEvent(el: HTMLElement): Promise<void> {
	return new Promise((ok, bad) => {
		el.addEventListener("error", err => bad(new Error(err.message)))
		el.addEventListener("load", () => ok())
	})
}

export function waitUntil(checker: () => boolean, timeLimit = 5000, checkInterval = 50): Promise<void> {
	return new Promise((ok, bad) => {
		let timePassed = 0
		let check = () => {
			if(checker()){
				clearInterval(interval)
				ok()
				return
			}
			timePassed += checkInterval
			if(timePassed >= timeLimit){
				clearInterval(interval)
				bad(new Error("Failed to wait for checker " + checker + ": timeout."))
			}
		}

		let interval = setInterval(check, checkInterval)
		check()
	})
}