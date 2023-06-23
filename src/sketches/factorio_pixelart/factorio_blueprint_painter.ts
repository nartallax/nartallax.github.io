import {FactorioBlueprint} from "sketches/factorio_pixelart/factorio_blueprint_format"

export class Painter {

	readonly brightnessLevels = 4

	constructor(readonly blueprint: FactorioBlueprint = {
		icons: [{
			index: 1,
			signal: {type: "item", name: "stone-brick"}
		}],
		version: 0,
		item: "blueprint"
	}) {}

	set(x: number, y: number, brightnessLevel: number): void {
		switch(Math.round(brightnessLevel) % this.brightnessLevels){
			case 0: this.pushTile(x, y, "refined-concrete"); break
			case 1:	this.pushTile(x, y, "concrete"); break
			case 2:	this.pushTile(x, y, "stone-path"); break
			case 3: this.pushEntity(x, y, "stone-wall"); break
		}
	}

	private pushTile(x: number, y: number, name: string): void {
		(this.blueprint.tiles ||= []).push({
			name: name,
			position: {x, y}
		})
	}

	private pushEntity(x: number, y: number, name: string): void {
		const entities = (this.blueprint.entities ||= [])
		entities.push({
			name: name,
			position: {x: x + 0.5, y: y + 0.5},
			entity_number: entities.length + 1
		})
	}
}