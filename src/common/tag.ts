import {Binder, getBinder} from "common/binder/binder"
import {isRBox, MaybeRBoxed, RBox, unbox, WBox} from "common/box"
import {ClassNameParts, makeClassname} from "common/classname"
import {FieldsOfObjectWithType, WritableKeysOf} from "common/type_utils"

type CssStyleAssignableKeys = WritableKeysOf<CSSStyleDeclaration> & FieldsOfObjectWithType<CSSStyleDeclaration, string>

interface TagDescription<K extends string = string, ThisType = unknown> {
	readonly tagName?: K
	readonly text?: MaybeRBoxed<string | number>
	readonly attrs?: {
		readonly [attrName: string]: MaybeRBoxed<string | number | undefined | null>
	}
	readonly on?: {
		readonly [k in keyof GlobalEventHandlersEventMap]?: (this: ThisType, evt: GlobalEventHandlersEventMap[k]) => void
	}
	readonly class?: ClassNameParts
}

export interface HTMLTagDescription<K extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> extends TagDescription<K, HTMLElementTagNameMap[K]> {

	readonly style?: {
		readonly [k in CssStyleAssignableKeys]?: MaybeRBoxed<string | number>
	}
}

export type SVGTagDescription<K extends keyof SVGElementTagNameMap = keyof SVGElementTagNameMap> = TagDescription<K, SVGElementTagNameMap[K]>

type ChildArray = (Element | null | undefined)[] | RBox<(Element | null | undefined)[]>

// typings are weird here, had to cast
function resolveArgs<K>(a?: K | ChildArray, b?: ChildArray): [K, ChildArray | undefined] {
	if(!a){
		return [{} as K, b]
	} else if(Array.isArray(a) || isRBox(a)){
		return [{} as K, a as ChildArray]
	} else {
		return [a as K, b]
	}
}

function populateTag<K extends string, T>(tagBase: Element, description: TagDescription<K, T>, children?: ChildArray): Binder | null {
	let binder: Binder | null = null

	if(description.text){
		const text = description.text
		if(isRBox(text)){
			(binder ||= getBinder(tagBase)).watch<string | number>(text, text => {
				tagBase.textContent = text + ""
			})
		}
		tagBase.textContent = unbox(text) + ""
	}

	if(description.on){
		for(const evtName in description.on){
			const handler = description.on[evtName as keyof GlobalEventHandlersEventMap]
			// I don't want to construct elaborat solid type here
			// I know the type will be correct, because it is enforced by function parameter type
			// so just be Any and that's it
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			tagBase.addEventListener(evtName, handler as any, {passive: true, capture: false})
		}
	}

	for(const k in description.attrs){
		const v = description.attrs[k]
		if(isRBox(v)){
			(binder ||= getBinder(tagBase)).watch<string | number | null | undefined>(v, v => {
				if(v === null || v === undefined){
					tagBase.removeAttribute(k)
				} else {
					tagBase.setAttribute(k, v + "")
				}
			})
		}
		const vv = unbox(v)
		if(v !== null && v !== undefined){
			tagBase.setAttribute(k, vv + "")
		}
	}

	if(children){
		const setChildren = (children: (Element | null | undefined)[]) => {
			const childTags = children.filter(x => !!x) as Element[]
			updateChildren(tagBase, childTags)
		}

		if(isRBox(children)){
			(binder ||= getBinder(tagBase)).watch(children, children => {
				setChildren(children)
			})
		}
		setChildren(unbox(children))
	}

	if(description.class){
		binder = makeClassname(
			binder,
			tagBase,
			description.class,
			// using classList here because on svg elements .className is readonly (in runtime)
			classname => tagBase.classList.value = classname
		) || binder
	}

	return binder
}

export function tag(): HTMLDivElement
export function tag<K extends keyof HTMLElementTagNameMap = "div">(description: HTMLTagDescription<K>): HTMLElementTagNameMap[K]
export function tag(children: ChildArray): HTMLDivElement
export function tag<K extends keyof HTMLElementTagNameMap = "div">(description: HTMLTagDescription<K>, children: ChildArray): HTMLElementTagNameMap[K]

export function tag<K extends keyof HTMLElementTagNameMap = "div">(a?: HTMLTagDescription<K> | ChildArray, b?: ChildArray): HTMLElementTagNameMap[K] {
	const [description, children] = resolveArgs(a, b)

	const tagBase = document.createElement(description.tagName || "div")

	let binder = populateTag(tagBase, description, children)

	if(description.style){
		for(const k in description.style){
			const v = description.style[k as CssStyleAssignableKeys]
			if(isRBox(v)){
				(binder ||= getBinder(tagBase)).watch<string | number>(v, v => {
					tagBase.style[k] = v + ""
				})
			}
			tagBase.style[k] = unbox(description.style[k]!) + ""
		}
	}

	return tagBase as HTMLElementTagNameMap[K]
}

export function svgTag(): SVGGElement
export function svgTag<K extends keyof SVGElementTagNameMap = "g">(description: SVGTagDescription<K>): SVGElementTagNameMap[K]
export function svgTag(children: ChildArray): SVGGElement
export function svgTag<K extends keyof SVGElementTagNameMap = "g">(description: SVGTagDescription<K>, children: ChildArray): SVGElementTagNameMap[K]

export function svgTag<K extends keyof SVGElementTagNameMap = "g">(a?: SVGTagDescription<K> | ChildArray, b?: ChildArray): SVGElementTagNameMap[K] {
	const [description, children] = resolveArgs(a, b)

	const tagBase = document.createElementNS("http://www.w3.org/2000/svg", description.tagName || "g")

	if(description.tagName === "svg"){
		tagBase.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink")
	}

	populateTag(tagBase, description, children)

	return tagBase as SVGElementTagNameMap[K]
}

function updateChildren(parent: Element, newChildren: readonly Element[]): void {
	for(let i = 0; i < newChildren.length; i++){
		const childTag = newChildren[i]!
		const x = parent.childNodes[i]
		if(x === childTag){
			continue
		}
		if(x){
			parent.insertBefore(childTag, x)
		} else {
			parent.appendChild(childTag)
		}
	}

	while(parent.childNodes[newChildren.length]){
		parent.childNodes[newChildren.length]!.remove()
	}
}

/** Cached renderer for list of elements
 * Won't re-render an element if already has one for the value */
export function renderArray<T, K, E extends Element>(src: WBox<T[]>, getKey: (value: T) => K, render: (value: WBox<T>) => E): RBox<E[]>
export function renderArray<T, K, E extends Element>(src: RBox<T[]>, getKey: (value: T) => K, render: (value: RBox<T>) => E): RBox<E[]>
export function renderArray<T, K, E extends Element>(src: MaybeRBoxed<readonly T[]>, getKey: (value: T) => K, render: (value: MaybeRBoxed<T>) => E): E[]
export function renderArray<T, K, E extends Element>(src: MaybeRBoxed<readonly T[]> | WBox<T[]>, getKey: (value: T) => K, render: (value: WBox<T> | T) => E): Node[] | RBox<Node[]> {
	if(Array.isArray(src)){
		return src.map(el => render(el))
	}

	const map = new Map<WBox<T>, E>()

	return (src as WBox<T[]>).wrapElements(getKey).map(itemBoxes => {
		const leftoverBoxes = new Set(map.keys())

		const result = itemBoxes.map(itemBox => {
			leftoverBoxes.delete(itemBox)
			let el = map.get(itemBox)
			if(!el){
				el = render(itemBox)
				map.set(itemBox, el)
			}
			return el
		})

		for(const oldBox of leftoverBoxes){
			map.delete(oldBox)
		}

		return result
	})
}