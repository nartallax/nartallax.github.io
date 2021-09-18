import {defaultLangKey, languageKeys} from "consts";
import {contentSet} from "content_set";
import {MainPage} from "pages/main_page";
import {sketches} from "sketches";
import {PageBase} from "widgets/specific/page_base";

let _isReleasing: boolean | null = null;
function isReleasing(): boolean {
	return _isReleasing !== null? _isReleasing: _isReleasing = process.argv.filter(x => x === "--release").length > 0;
}

function makeResources(): void {
	contentSet.addImploderProject(
		"/js/main.js",
		"src/website/client/tsconfig.json",
		isReleasing()? "release": "development"
	);

	contentSet.addSassItem(
		"/css/main.css",
		"src/website/style/main.scss"
	)

	contentSet.addSassSource("src/website/style/main.scss");

	contentSet.setImageDirectory("img");
	contentSet.setWebpDirectory("webp");

	(Object.keys(sketches) as (keyof(typeof sketches) & string)[]).forEach(sketchName => {
		contentSet.addImploderProject(
			"/js/sketch/" + sketchName + ".js",
			"src/sketches/" + sketchName + "/tsconfig.json",
			isReleasing()? "release": "development"
		)
	})
}

function makePages(): void {
	contentSet.addStaticPage({
		urlPath: "/",
		render: () => PageBase({
			title: "Nartallax's website",
			description: "It's my personal website. Here are some of my creations, experiments and more."
		}, MainPage())
	});

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
			let langPrefix = langKey === defaultLangKey? "": ("/" + langKey);
			let sketch = sketches[sketchName];
			contentSet.addStaticPage({
				urlPath: `${langPrefix}/sketch/${sketchName}`,
				params: {lang: langKey},
				render: () => PageBase({
					title: sketch.name[langKey],
					description: sketch.description[langKey],
					scripts: [`/js/sketch/${sketchName}.js`]
				})
			})
		})
	})
}

export async function main(): Promise<void> {
	await contentSet.doneWithWidgets();
	makeResources();
	await contentSet.doneWithResources();
	makePages();
	await contentSet.doneWithPages();

	if(isReleasing()){
		contentSet.writeAllToDisk();
	} else {
		let port = 6341;
		process.once("SIGINT", () => contentSet.stopHttpServer());
		await contentSet.startHttpServer({
			port: port,
			host: "localhost"
		});
		console.error("Started at " + port)
	}
}