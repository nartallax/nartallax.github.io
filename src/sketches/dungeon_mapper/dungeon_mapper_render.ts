import {DungeonMap} from "sketches/dungeon_mapper/dungeon_mapper_generator"
import * as css from "./dungeon_mapper.module.scss"
import {tag} from "@nartallax/cardboard-dom"

export const renderDungeonMap = (map: DungeonMap): HTMLElement => {
	const result = tag({class: css.mapContainer})
	for(let x = 0; x < map.settings.width; x++){
		const column = tag({class: css.mapColumn})
		result.appendChild(column)
		for(let y = 0; y < map.settings.height; y++){
			const square = tag({
				class: [
					css.mapSquare,
					map.spaceMap.get(x, y) ? css.empty : css.full
				].join(" ")
			})
			column.appendChild(square)
		}
	}
	return result
}