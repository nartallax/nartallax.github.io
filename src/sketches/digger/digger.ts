import {DiggerWorld, DiggerWorldOptions} from "./digger_world"

export async function main(root: HTMLElement): Promise<void> {
	const config: DiggerWorldOptions = {
		widthCells: 15,
		heightCells: 10,
		screenWidth: document.body.clientWidth,
		screenHeight: document.body.clientHeight,
		wallThickness: 0.1,
		colors: {
			terrainA: "#d45500",
			terrainB: "#aa4400",
			terrainEmpty: "#2b1100"
		},
		dramaticDrawTiming: {
			terrain: 0.5
		}
	}

	const world = new DiggerWorld(config)
	root.appendChild(world.el)
	world.start()

	world.digVertical(0, 0, 5)
	world.digVertical(0, 0, 4)

	/*
	let rects = [
		{x: 100, y: 100, w: 100, h: 100},
		{x: 175, y: 175, w: 100, h: 100},
		{x: 250, y: 125, w: 100, h: 100}
	]

	let dedup = new RectanlgeDeduplicator()
	rects.forEach(rect => dedup.add(rect))
	document.body.style.cssText = "position: relative; width: 100vw; height: 100vh; background-color: #000"
	for(let rect of dedup.getNonIntersectingRects()){
	// for(let rect of rects){
		console.log(rect)
		document.body.appendChild(tag({
			style: {
				position: "absolute",
				top: rect.y + "px",
				left: rect.x + "px",
				width: rect.w + "px",
				height: rect.h + "px",
				backgroundColor: "rgba(255, 255, 255, 0.5)",
				boxSizing: "border-box",
				border: "3px solid red"
			}
		}))
	}
	*/
}