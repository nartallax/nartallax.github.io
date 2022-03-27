// TranslatedString has to be type instead of interface
// because this way it conforms to Record<string, unknown>, while in interface it does not
// don't know why
export type TranslatedSomething<T> = {
	en: T
	ru: T
}

export type TranslatedString = TranslatedSomething<string>

export interface ContentReference {
	description?: TranslatedString
	url?: string
}

export interface SketchDescription {
	name: TranslatedString
	description: TranslatedString
	tags: TagDescription[]
	date: Date
	inspiration?: ContentReference[]
	usedContent?: ContentReference[]
	hidden?: boolean
}

export interface TagDescription {
	name: TranslatedString
	description: TranslatedString
}

export const languageNames: TranslatedSomething<TranslatedString> = {
	en: {en: "English", ru: "Английский"},
	ru: {en: "Russian", ru: "Русский"}
}

export const languageKeys: ReadonlySet<string & keyof TranslatedString> = new Set(Object.keys(languageNames) as (keyof TranslatedString)[])

export const defaultLangKey: string & keyof TranslatedString = "en"

const _tags = {
	simulation: {
		name: {ru: "Симуляция", en: "Simulation"},
		description: {
			ru: "Воссоздание каких-либо явлений реального мира в упрощенном виде.",
			en: "Simplified recreation of real life physical effects."
		}
	},
	art: {
		name: {ru: "Искусство", en: "Art"},
		description: {
			ru: "По моему определению, искусство - что-либо, созданное для того, чтобы вызывать эмоции у наблюдателя.",
			en: "By my definition art is something that is created with purpose of evoking emotions."
		}
	},
	threejs: {
		name: {ru: "THREE.js", en: "THREE.js"},
		description: {
			ru: "Визуальная композиция с использованием THREE.js.",
			en: "Visual composition that uses THREE.js to render."
		}
	},
	tool: {
		name: {ru: "Инструмент", en: "Tool"},
		description: {
			ru: "Штука, помогающая достичь каких-либо простых целей.",
			en: "A thing that helps achieving some simple goals."
		}
	},
	css: {
		name: {ru: "CSS", en: "CSS"},
		description: {
			ru: "Продвинутые трюки с использованием преимущественно CSS.",
			en: "Advanced techniques of using CSS."
		}
	},
	webgl: {
		name: {ru: "WebGL", en: "WebGL"},
		description: {
			ru: "Использование технологии WebGL.",
			en: "Usage of WebGL."
		}
	},
	svg: {
		name: {ru: "SVG", en: "SVG"},
		description: {
			ru: "Использование технологии SVG.",
			en: "Usage of SVG."
		}
	},
	evolution: {
		name: {ru: "Эволюция", en: "Evolution"},
		description: {
			ru: "Демонстрация эволюции.",
			en: "Demonstration of evolution."
		}
	}
}

export const tags: {readonly [k in keyof(typeof _tags)]: TagDescription} = _tags