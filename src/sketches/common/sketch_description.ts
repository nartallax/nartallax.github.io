import {SketchDescription} from "./website_common"

export const sketchDescription: SketchDescription = (() => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let d = (window as any).sketchDescription
	return {
		...d,
		date: new Date(d.date)
	}
})()