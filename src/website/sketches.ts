import {ContentTag, contentTags} from "website/content_tags"
import fallingCubesThumb from "./thumbnails/falling_cubes.png"
import starTravelThumb from "./thumbnails/star_travel.png"
import timerThumb from "./thumbnails/timer.png"
import squaremix3dThumb from "./thumbnails/squaremix_3d.png"
import notImplementedThumb from "./thumbnails/not_implemented.png"

export interface SketchDescription {
	readonly id: SketchId
	readonly name: string
	readonly description: string
	readonly date: Date
	readonly tags: readonly ContentTag[]
	readonly inspiration?: ContentReference[]
	readonly usedContent?: ContentReference[]
	code(): Promise<SketchObject>
	readonly hidden?: boolean
	readonly thumbnail: string
}

interface SketchObject {
	main(root: HTMLElement): void
}

export interface ContentReference {
	readonly description?: string
	readonly url?: string
}

const _sketches = {
	digger: {
		name: "Digger",
		description: "Game about excavation of useful minerals.",
		inspiration: [{
			description: "Old DOS game",
			url: "https://www.youtube.com/watch?v=l0yQfyJlqdA"
		}],
		date: new Date(2022, 7, 9),
		tags: [contentTags.game, contentTags.svg],
		hidden: true,
		code: () => import("sketches/digger/digger"),
		thumbnail: notImplementedThumb
	},

	falling_cubes: {
		name: "Falling cubes",
		description: "Animation of falling cubes",
		inspiration: [{
			description: "A gif without clear source"
		}],
		date: new Date(2022, 2, 27),
		tags: [contentTags.threejs, contentTags.oimojs],
		code: () => import("sketches/falling_cubes/falling_cubes"),
		thumbnail: fallingCubesThumb
	},

	timer: {
		name: "Timer",
		description: "Time counter with some settings",
		inspiration: [{
			description: "A question from chat"
		}],
		date: new Date(2022, 2, 27),
		tags: [contentTags.tool],
		code: () => import("sketches/timer/timer"),
		thumbnail: timerThumb
	},

	squaremix_3d: {
		name: "Square mix",
		description: "3D-mixing animation of an image",
		inspiration: [{
			description: "Some video without clear source"
		}],
		usedContent: [{
			description: "Photo by Jonny Gios",
			url: "https://unsplash.com/photos/B78XB_9xe6E"
		}],
		date: new Date(2022, 2, 25),
		tags: [contentTags.threejs],
		code: () => import("sketches/squaremix_3d/squaremix_3d"),
		thumbnail: squaremix3dThumb
	},

	star_travel: {
		name: "Star travel",
		description: "Flight through the galaxy!",
		inspiration: [{
			description: "Old Windows screensaver",
			url: "https://www.youtube.com/watch?v=teFHZRpH5Pw"
		}],
		date: new Date(2021, 8, 18),
		tags: [contentTags.art, contentTags.svg, contentTags.css],
		code: () => import("sketches/star_travel/star_travel"),
		thumbnail: starTravelThumb
	}
}

export const sketchDescriptions = (() => {
	const res: Record<string, SketchDescription> = {}
	for(const id in _sketches){
		res[id] = {..._sketches[id as SketchId], id: id as SketchId}
	}
	return res as {readonly [id in SketchId]: SketchDescription}
})()

export type SketchId = keyof typeof _sketches