import {router} from "website/routes"

function main(): void {
	const appRoot = document.getElementById("app")
	if(!appRoot){
		throw new Error("No app root!")
	}
	router.startAt(appRoot)
}

main()