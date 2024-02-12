import {box, WBox} from "@nartallax/cardboard"

let locationHashBox: WBox<string> | null = null

export function getLocationHashBox(): WBox<string> {
	if(!locationHashBox){
		const b = locationHashBox = box(fixHash(window.location.hash))

		window.addEventListener("hashchange", () => b.set(fixHash(window.location.hash)))
		b.subscribe(value => {
			if(value === ""){
				if(window.location.hash && typeof(history) !== "undefined"){
					// removes this annoying "#"
					history.pushState("", document.title, window.location.pathname + window.location.search)
					return
				}
			}
			const hash = "#" + value
			// not sure if this check is actually making any difference
			if(window.location.hash !== hash){
				window.location.hash = hash
			}
		})
	}

	return locationHashBox
}

function fixHash(rawHash: string): string {
	return rawHash.replace(/^#/, "")
}