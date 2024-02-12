import {initializeCardboardDom, waitDocumentLoaded} from "@nartallax/cardboard-dom"
import {router} from "website/routes"
// https://github.com/parcel-bundler/parcel/issues/8716
// this really should be included in index.html
import * as css from "./style/global.module.scss"

async function main(): Promise<void> {
	await waitDocumentLoaded()
	await initializeCardboardDom()
	void css
	const appRoot = document.getElementById("app")
	if(!appRoot){
		throw new Error("No app root!")
	}
	router.startAt(appRoot)
}

void main()