export interface SVGTagDescription extends Record<string, unknown> {
	children?: SVGElement[]
}

export function svgTag<K extends keyof SVGElementTagNameMap>(name: K, description: SVGTagDescription = {}): SVGElementTagNameMap[K] {
	let res = document.createElementNS("http://www.w3.org/2000/svg", name)

	if(name === "svg"){
		res.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	}

	for(let k in description){
		let v = description[k]
		if(k === "children" && Array.isArray(v)){
			for(let child of v){
				res.appendChild(child)
			}
		} else {
			res.setAttribute(k, v + "");
		}
	}

	return res
}