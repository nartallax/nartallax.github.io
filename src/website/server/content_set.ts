import {Lithograph} from "@nartallax/lithograph";
import * as Path from "path";
import {TranslatedString} from "types";

export const contentSet = Lithograph.createContentSet({
	defaultPageParams: {lang: "ru" as keyof TranslatedString},
	preferredProtocol: "https",
	domain: "nartallax.github.io",
	rootDirectoryPath: Path.resolve("../../.."),
	minifyCss: true,
	minifyHtml: true,
	validateHtml: true,
	useSitemap: true,
	noHashes: true
});