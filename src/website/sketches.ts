import {ContentTag, contentTags} from "website/content_tags"
import fallingCubesThumb from "sketches/falling_cubes/thumb.png"
import starTravelThumb from "sketches/star_travel/thumb.png"
import timerThumb from "sketches/timer/thumb.png"
import squaremix3dThumb from "sketches/squaremix_3d/thumb.png"
import planetsThumb from "sketches/planets/thumb.png"
import particleToyThumb from "sketches/particle_toy/thumb.png"
import waveFunctionCollapseThumb from "sketches/wave_function_collapse/thumb.png"
import notImplementedThumb from "./default_thumbnail.png"

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
	readonly infoButtonPosition?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight"
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
	},

	planets: {
		name: "Planets",
		description: "Stellar gravity simulation (not up to scale)",
		date: new Date(2022, 11, 27),
		tags: [contentTags.simulation, contentTags.svg],
		code: () => import("sketches/planets/planets"),
		thumbnail: planetsThumb
	},

	particle_toy: {
		name: "Particle toy",
		description: "Millions of particles processed by GPU",
		date: new Date(2023, 0, 28),
		tags: [contentTags.simulation, contentTags.webgl],
		code: () => import("sketches/particle_toy/particle_toy"),
		thumbnail: particleToyThumb,
		hidden: true
	},

	wave_function_collapse: {
		name: "Wave function collapse",
		description: "Implementation of wave function collapse algoritm",
		date: new Date(2023, 3, 1),
		tags: [contentTags.tool],
		code: () => import("sketches/wave_function_collapse/wave_function_collapse"),
		thumbnail: waveFunctionCollapseThumb,
		inspiration: [{
			description: "Youtube video about this code",
			url: "https://github.com/avihuxp/WaveFunctionCollapse"
		}]
	},

	ribcage_converter: {
		name: "RC converter",
		description: "A tool that can convert some TS type definitions into RC structure definitions",
		date: new Date(2023, 4, 8),
		tags: [contentTags.tool],
		code: () => import("sketches/ribcage_converter/ribcage_converter"),
		thumbnail: notImplementedThumb,
		infoButtonPosition: "topRight" as const,
		hidden: true
	},

	factorio_pixelart: {
		name: "Factorio Pixelart converter",
		description: "A tool that can convert an image to factorio blueprint",
		date: new Date(2023, 5, 23),
		tags: [contentTags.tool],
		code: () => import("sketches/factorio_pixelart/factorio_pixelart"),
		thumbnail: notImplementedThumb,
		hidden: true
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