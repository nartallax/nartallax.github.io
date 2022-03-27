import {tags, SketchDescription} from "website_common"

const _sketches = {
	squaremix_3d: {
		name: {ru: "Квадратный микс", en: "Square mix"},
		description: {
			ru: "Анимация на основе картинки, перемешивающая её части",
			en: "Static image based animation that mixes it up"
		},
		inspiration: [{
			description: {ru: "Видео без явного источника", en: "Some video without clear source"}
		}],
		usedContent: [{
			description: {ru: "Фото Jonny Gios", en: "Photo by Jonny Gios"},
			url: "https://unsplash.com/photos/B78XB_9xe6E"
		}],
		date: new Date(2022, 2, 25),
		tags: [tags.threejs]
	},
	star_travel: {
		name: {ru: "Навстречу звездам", en: "Star travel"},
		description: {
			ru: "Полет через вселенную!",
			en: "Flight through the galaxy!"
		},
		inspiration: [{
			description: {ru: "Старый скринсейвер Windows", en: "Old Windows screensaver"},
			url: "https://www.youtube.com/watch?v=teFHZRpH5Pw"
		}],
		date: new Date(2021, 8, 18),
		tags: [tags.art, tags.svg, tags.css]
	}
}

export const sketches: {readonly [k in keyof(typeof _sketches)]: SketchDescription} = _sketches