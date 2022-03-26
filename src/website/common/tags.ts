import {TagDescription} from "types";

const _tags = {
	simulation: {
		name: { ru: "Симуляция", en: "Simulation" },
		description: {
			ru: "Воссоздание каких-либо явлений реального мира в упрощенном виде.",
			en: "Simplified recreation of real life physical effects."
		}
	},
	art: {
		name: { ru: "Искусство", en: "Art" },
		description: { 
			ru: "По моему определению, искусство - что-либо, созданное для того, чтобы вызывать эмоции у наблюдателя.",
			en: "By my definition art is something that is created with purpose of evoking emotions."
		}
	},
	css: {
		name: { ru: "CSS", en: "CSS" },
		description: {
			ru: "Продвинутые трюки с использованием преимущественно CSS.",
			en: "Advanced techniques of using CSS."
		}
	},
	webgl: {
		name: { ru: "WebGL", en: "WebGL" },
		description: {
			ru: "Использование технологии WebGL.",
			en: "Usage of WebGL."
		}
	},
	svg: {
		name: { ru: "SVG", en: "SVG" },
		description: {
			ru: "Использование технологии SVG.",
			en: "Usage of SVG."
		}
	},
	evolution: {
		name: { ru: "Эволюция", en: "Evolution" },
		description: {
			ru: "Демонстрация эволюции.",
			en: "Demonstration of evolution."
		}
	}
}

export const tags: { readonly [k in keyof(typeof _tags)]: TagDescription  } = _tags;