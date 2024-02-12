import {onMount} from "@nartallax/cardboard-dom"

export function onResize(el: HTMLElement, callback: (resizeEvent: ResizeObserverEntry) => void): void {
	onMount(el, () => {
		const observer = new ResizeObserver(entries => {
			for(const entry of entries){
				// I'm not sure if this check can be false in our case
				// maybe it will fire for nested elements..? this needs testing
				if(entry.target === el){
					console.log("uwu")
					callback(entry)
				}
			}
		})
		observer.observe(el)
		return () => observer.disconnect()
	}, {ifInDom: "call"})
}