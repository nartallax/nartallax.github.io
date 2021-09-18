import {tags} from "tags";
import {SketchDescription} from "types";

const _sketches = {
	/*
	ceiling_pendulum: {
		name: { ru: "Потолочный маятник", en: "Ceiling pendulum" },
		description: {
			ru: "Маятник, подвешенный на потолке. Можно придавать ускорение и смотреть на то, какой след он за собой оставляет.",
			en: "A pendulum fixed on a ceiling. Can be manually accelerated to leave a trail."
		},
		inspiration: [{
			description: { ru: "Маятник с песком", en: "The Sand Pendulum" },
			url: "https://www.youtube.com/watch?v=7f16hAs1FB4"
		}],
		date: new Date(2020, 0, 1),
		tags: [tags.simulation, tags.svg]
	},
	*/
	star_travel: {
		name: { ru: "Навстречу звездам", en: "Star travel" },
		description: {
			ru: "Полет через вселенную!",
			en: "Flight through the galaxy!"
		},
		inspiration: [{
			description: { ru: "Старый скринсейвер Windows", en: "Old Windows screensaver" },
			url: "https://www.youtube.com/watch?v=teFHZRpH5Pw"
		}],
		usedContent: [{
			description: { ru: "Фото космоса для фона - Max McKinnon", en: "Background space photo - Max McKinnon" },
			url: "https://unsplash.com/photos/c9OCWLka764"
		}],
		date: new Date(2021, 8, 18),
		tags: [tags.art, tags.svg, tags.css]
	}
}

export const sketches: { readonly [k in keyof(typeof _sketches)]: SketchDescription  } = _sketches;