import {Lithograph} from "@nartallax/lithograph";
import * as Path from "path";

export const contentSet = Lithograph.createContentSet({
	preferredProtocol: "https",
	domain: "nartallax.github.io",
	rootDirectoryPath: Path.resolve("../.."),
	minifyCss: true,
	minifyHtml: true,
	validateHtml: true,
	useSitemap: true
});