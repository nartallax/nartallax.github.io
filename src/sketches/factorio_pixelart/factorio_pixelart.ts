import {tag} from "@nartallax/cardboard-dom"
import {decodeFactorioBlueprint, encodeFactorioBlueprint, FactorioBlueprint} from "sketches/factorio_pixelart/factorio_blueprint_format"
import * as css from "./factorio_pixelart.module.scss"

const blueprintStr = "0eNp9j8sKwjAQRf/lrlOwsfSRXxEXfYw62CYliWIp+XebFkSouJwZzpl7ZzT9g0bL2kPN4NZoB3Wa4fiq6z7u/DQSFNjTAAFdD3Fy3mhKGsvtHUGAdUcvqDScBTz3tDlG49iz0dGyXJPsKDBByTIPH5GlC2vqkuVxa8nTYvsByj34H0j3wBZ5rP0NMebaR33VF3iSdatElmlWVLLIK3kojzKENwl1Xpg="



export function main(root: HTMLElement): void {
	console.log(decodeFactorioBlueprint(blueprintStr))

	const tiles: Required<FactorioBlueprint>["tiles"] = []

	const blueprint: FactorioBlueprint = {
		icons: [{
			index: 1,
			signal: {type: "item", name: "stone-brick"}
		}],
		tiles,
		version: 0,
		item: "blueprint"
	}

	for(let x = 0; x < 3; x++){
		for(let y = 0; y < 3; y++){
			if(y === 1 || x === 1){
				continue
			}
			tiles.push({
				name: "stone-path",
				position: {x, y}
			})
		}
	}

	const el = tag({
		class: css.blueprintStringContainer
	}, [encodeFactorioBlueprint({blueprint})])
	root.appendChild(el)
}