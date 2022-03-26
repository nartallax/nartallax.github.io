import {TranslatedSomething, TranslatedString} from "types";

export const languageNames: TranslatedSomething<TranslatedString> = {
	en: {en: "English", ru: "Английский"},
	ru: {en: "Russian", ru: "Русский"}
}

export const languageKeys: ReadonlySet<string & keyof TranslatedString> = new Set(Object.keys(languageNames) as (keyof TranslatedString)[]);

export const defaultLangKey: string & keyof TranslatedString = "en";