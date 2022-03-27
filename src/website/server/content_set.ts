import {Lithograph} from "@nartallax/lithograph"
import * as Path from "path"
import {defaultLangKey} from "website_common"

export const contentSet = Lithograph.createContentSet({
	defaultPageParams: {lang: defaultLangKey},
	preferredProtocol: "https",
	domain: "nartallax.github.io",
	rootDirectoryPath: Path.resolve("../../.."),
	minifyCss: true,
	minifyHtml: true,
	validateHtml: true,
	useSitemap: true,
	noHashes: true
})