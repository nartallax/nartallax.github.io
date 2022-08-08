import {tags, SketchDescription} from "website_common"

const _sketches = {
	falling_cubes: {
		name: {ru: "Падающие кубы", en: "Falling cubes"},
		description: {
			ru: "Анимация падающих кубов",
			en: "Animation of falling cubes"
		},
		inspiration: [{
			description: {ru: "Гифка без явного источника", en: "A gif without clear source"}
		}],
		date: new Date(2022, 2, 27),
		tags: [tags.threejs, tags.oimojs]
	},
	timer: {
		name: {ru: "Таймер", en: "Timer"},
		description: {
			ru: "Счетчик времени с настройками",
			en: "Time counter with some settings"
		},
		inspiration: [{
			description: {ru: "Вопрос в чате", en: "A question from chat"}
		}],
		date: new Date(2022, 2, 27),
		tags: [tags.tool]
	},
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