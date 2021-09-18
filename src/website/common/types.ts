// TranslatedString has to be type instead of interface
// because this way it conforms to Record<string, unknown>, while in interface it does not
// don't know why
export type TranslatedSomething<T> = {
	en: T;
	ru: T;
}

export type TranslatedString = TranslatedSomething<string>

export interface ContentReference {
	description?: TranslatedString;
	url?: string;
}

export interface SketchDescription {
	name: TranslatedString;
	description: TranslatedString;
	tags: TagDescription[];
	date: Date;
	inspiration?: ContentReference[];
	usedContent?: ContentReference[];
}

export interface TagDescription {
	name: TranslatedString;
	description: TranslatedString;
}