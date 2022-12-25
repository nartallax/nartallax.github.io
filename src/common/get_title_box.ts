import {box, WBox} from "common/box"

let titleBox: WBox<string> | null = null

export function getTitleBox(): WBox<string> {
	if(!titleBox){
		titleBox = box(document.title)

		titleBox.subscribe(value => document.title = value)
	}

	return titleBox
}