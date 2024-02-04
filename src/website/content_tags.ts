export interface ContentTag {
	readonly id: ContentTagId
	readonly name: string
	readonly description: string
}

const _tags = {
	simulation: {
		name: "Simulation",
		description: "Simplified recreation of real life patterns, regularities and effects."
	},
	art: {
		name: "Art",
		description: "By my definition art is something that is created with purpose of evoking emotions."
	},
	threejs: {
		name: "THREE.js",
		description: "Visual composition that uses THREE.js to render."
	},
	oimojs: {
		name: "Oimo.js",
		description: "Physical simulation using Oimo.js engine."
	},
	matterjs: {
		name: "Matter.js",
		description: "Physical simulation using Matter.js engine."
	},
	tool: {
		name: "Tool",
		description: "A thing that helps achieving some goals."
	},
	css: {
		name: "CSS",
		description: "Advanced techniques of using CSS."
	},
	webgl: {
		name: "WebGL",
		description: "Usage of WebGL."
	},
	svg: {
		name: "SVG",
		description: "Usage of SVG."
	},
	evolution: {
		name: "Evolution",
		description: "Demonstration of evolution."
	},
	game: {
		name: "Game",
		description: "Interactive piece of enternainment."
	}
}

export const contentTags = (() => {
	const res: Record<string, ContentTag> = {}
	for(const id in _tags){
		res[id] = {..._tags[id as ContentTagId], id: id as ContentTagId}
	}
	return res as {readonly [id in ContentTagId]: ContentTag}
})()

export type ContentTagId = keyof typeof _tags