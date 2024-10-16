import {box} from "@nartallax/cardboard"
import {generateDungeonMap} from "sketches/dungeon_mapper/dungeon_mapper_generator"
import {DungeonMapperSettings, makeSettingsControl} from "sketches/dungeon_mapper/dungeon_mapper_settings"
import * as css from "./dungeon_mapper.module.scss"
import {tag} from "@nartallax/cardboard-dom"
import {renderDungeonMap} from "sketches/dungeon_mapper/dungeon_mapper_render"

const defaultSettings: DungeonMapperSettings = {
	averageRoomConnectionsCount: 2,
	height: 50,
	width: 50,
	roomDensity: 0.25,
	seed: 313373
}

export async function main(root: HTMLElement): Promise<void> {
	const map = box(generateDungeonMap(defaultSettings))

	const settings = makeSettingsControl(defaultSettings, settings => {
		map.set(generateDungeonMap(settings))
	})

	root.appendChild(tag({class: css.root}, [
		settings,
		map.map(map => renderDungeonMap(map))
	]))
}