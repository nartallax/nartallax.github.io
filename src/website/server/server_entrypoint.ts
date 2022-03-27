import {defaultLangKey, languageKeys, SketchDescription} from "website_common"
import {contentSet} from "content_set"
import {MainPage} from "pages/main_page"
import {sketches} from "sketches"
import {TranslatedString} from "website_common"
import {PageBase} from "widgets/specific/page_base"

let _isReleasing: boolean | null = null
function isReleasing(): boolean {
	return _isReleasing !== null ? _isReleasing : _isReleasing = process.argv.filter(x => x === "--release").length > 0
}

function makeResources(): void {
	contentSet.addImploderProject(
		"/js/main.js",
		"src/website/client/tsconfig.json",
		isReleasing() ? "release" : "development"
	)

	contentSet.addSassItem(
		"/css/main.css",
		"src/website/style/main.scss"
	)

	contentSet.addSassSource("src/website/style/main.scss")

	contentSet.setImageDirectory("img")
	contentSet.setWebpDirectory("webp")
	contentSet.addExternalJsDirectory("js");

	(Object.keys(sketches) as (keyof(typeof sketches) & string)[]).forEach(sketchName => {
		contentSet.addImploderProject(
			"/js/sketch/" + sketchName + ".js",
			"src/sketches/" + sketchName + "/tsconfig.json",
			isReleasing() ? "release" : "development"
		)
	})
}

function langPrefixedUrl(langKey: keyof TranslatedString, url: string): string {
	return (langKey === defaultLangKey ? "" : "/" + langKey) + url
}

function makePages(): void {

	languageKeys.forEach(langKey => {
		contentSet.addStaticPage({
			urlPath: langPrefixedUrl(langKey, "/"),
			params: {lang: langKey},
			render: () => PageBase({
				title: "Nartallax's website",
				description: "It's my personal website. Here are some of my creations, experiments and more."
			}, MainPage())
		})
	})

	contentSet.addPlaintextPage({
		urlPath: "/robots.txt",
		render: context =>
			`User-Agent: *
Disallow: /src/*
Disallow: /nartallax.github.io.code-workspace

Sitemap: ${context.options.preferredProtocol}://${context.options.domain}/sitemap.xml
Host: ${context.options.preferredProtocol}://${context.options.domain}
`
	});

	(Object.keys(sketches) as (keyof(typeof sketches))[]).forEach(sketchName => {
		languageKeys.forEach(langKey => {
			let sketch = sketches[sketchName]

			let descrObj: {[k in keyof SketchDescription]: unknown} = {...sketches[sketchName]}
			descrObj.date = sketches[sketchName].date.getTime()

			contentSet.addStaticPage({
				urlPath: langPrefixedUrl(langKey, `/sketch/${sketchName}`),
				params: {lang: langKey},
				render: () => PageBase({
					title: sketch.name[langKey],
					description: sketch.description[langKey],
					scripts: [`/js/sketch/${sketchName}.js`],
					inlineScripts: ["var sketchDescription = " + JSON.stringify(descrObj)]
				})
			})
		})
	})
}

export async function main(): Promise<void> {
	await contentSet.doneWithWidgets()
	makeResources()
	await contentSet.doneWithResources()
	makePages()
	await contentSet.doneWithPages()

	if(isReleasing()){
		contentSet.writeAllToDisk()
	} else {
		let port = 6341
		process.once("SIGINT", () => contentSet.stopHttpServer())
		await contentSet.startHttpServer({
			port: port,
			host: "localhost"
		})
		console.error("Started at " + port)
	}
}