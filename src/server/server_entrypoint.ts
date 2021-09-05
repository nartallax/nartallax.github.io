import {contentSet} from "content_set";
import {pageRoot} from "widgets/page_root";

let _isReleasing: boolean | null = null;
function isReleasing(): boolean {
	return _isReleasing !== null? _isReleasing: _isReleasing = process.argv.filter(x => x === "--release").length > 0;
}

function makeResources(): void {
	contentSet.addImploderProject(
		"/main.js",
		"src/client/tsconfig.json",
		isReleasing()? "release": "development"
	);
}

function makePages(): void {
	contentSet.addStaticPage({
		urlPath: "/",
		render: () => pageRoot({head: `<script src="/main.js"></script>`, body: "<h1>Hello world!</h1>"})
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