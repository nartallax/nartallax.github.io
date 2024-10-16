import {Growable2DBitmap} from "common/growable_2d_bitmap"
import {makeRandomGenerator} from "common/seeded_random"
import {DungeonMapperSettings} from "sketches/dungeon_mapper/dungeon_mapper_settings"

type DungeonMapPart = {
	type: "room" | "hallway"
	coords: XY[]
}

export type DungeonMap = {
	settings: DungeonMapperSettings
	// is this point free (not a wall)?
	spaceMap: Growable2DBitmap
	parts: DungeonMapPart[]
}

let random: () => number = () => 0

type XY = {x: number, y: number}

export const generateDungeonMap = (settings: DungeonMapperSettings): DungeonMap => {
	const spaceMap = new Growable2DBitmap(settings.width, settings.height)
	random = makeRandomGenerator(settings.seed)

	const rooms = generateRooms(spaceMap, settings)

	return {
		settings, spaceMap, parts: rooms
	}
}

const roomSizeLimit = 3 // min size of a room

const generateRooms = (spaceMap: Growable2DBitmap, settings: DungeonMapperSettings): DungeonMapPart[] => {
	let fillCount = 0
	const rooms: DungeonMapPart[] = []
	const targetFillCount = settings.roomDensity * settings.width * settings.height
	while(fillCount < targetFillCount){
		const roomCenter = findRandomEmptySpot(spaceMap, settings)
		const fillLimit = targetFillCount - fillCount
		if(fillLimit < (roomSizeLimit * roomSizeLimit * 4)){
			// limit is too small, we won't be able to ever fill it, let's stop here
			break
		}

		let ownedCoords: XY[]
		if(random() > 0.5){
			// generating a circle
			let radius = findMaxCircleRadius(spaceMap, roomCenter, settings)
			if(radius < roomSizeLimit){ // too small
				continue
			}

			radius = Math.ceil(radius * (0.5 + (random() * 0.5)))
			const radiusLimit = Math.floor(Math.sqrt(fillLimit / Math.PI))
			radius = Math.min(radiusLimit, radius)

			ownedCoords = fillCircle(spaceMap, roomCenter, radius)
			fillCount += ownedCoords.length
		} else {
			// generating a rectangle
			const dims = findMaxRectangleDimensions(spaceMap, roomCenter, settings)
			if(dims.x < roomSizeLimit || dims.y < roomSizeLimit){
				continue
			}

			dims.x = Math.ceil(dims.x * (0.5 + (random() * 0.5)))
			dims.y = Math.ceil(dims.y * (0.5 + (random() * 0.5)))
			const limitScale = fillLimit / (dims.x * dims.y * 4)
			if(limitScale < 1){
				dims.x *= limitScale
				dims.y *= limitScale
			}
			dims.x = Math.max(dims.x, roomSizeLimit)
			dims.y = Math.max(dims.y, roomSizeLimit)

			ownedCoords = fillRectangle(spaceMap, roomCenter, dims)
			fillCount += ownedCoords.length
		}

		rooms.push({type: "room", coords: ownedCoords})
	}
	console.log(`Filled map with rooms to density = ${(fillCount / (settings.width * settings.height)).toFixed(3)}`)
	return rooms
}

const findRandomEmptySpot = (map: Growable2DBitmap, settings: DungeonMapperSettings): XY => {
	while(true){
		const x = Math.floor(random() * settings.width)
		const y = Math.floor(random() * settings.height)
		if(!map.get(x, y)){
			return {x, y}
		}
	}
}

// this one is random, because depending on growth order different results may be achieved
// more robust approach would be to use stable metrics like "max area",
// but I don't want to think too hard about it right now
const findMaxRectangleDimensions = (map: Growable2DBitmap, center: XY, settings: DungeonMapperSettings): XY => {
	let halfWidth = 0
	let halfHeight = 0
	let canGrowWidth = true
	let canGrowHeight = true
	while(canGrowWidth || canGrowHeight){
		const isGrowingHeight = !canGrowWidth ? true : !canGrowHeight ? false : random() > 0.5
		if(isGrowingHeight){
			if(center.y + halfHeight + 1 >= settings.height || center.y - (halfHeight + 1) < 0){
				canGrowHeight = false
				continue
			}
			halfHeight++
		} else {
			if(center.x + halfWidth + 1 >= settings.width || center.x - (halfWidth + 1) < 0){
				canGrowWidth = false
				continue
			}
			halfWidth++
		}

		let isAttemptFailed = false

		{
			const yMin = center.y - halfHeight
			const yMax = center.y + halfHeight
			for(let dx = -halfWidth; dx <= halfWidth; dx++){
				const x = center.x + dx
				if(map.get(x, yMin) || map.get(x, yMax)){
					isAttemptFailed = true
					break
				}
			}
		}

		if(!isAttemptFailed){
			const xMin = center.x - halfWidth
			const xMax = center.y + halfWidth
			for(let dy = -halfHeight; dy <= halfHeight; dy++){
				const y = center.y + dy
				if(map.get(xMin, y) || map.get(xMax, y)){
					isAttemptFailed = true
					break
				}
			}
		}

		if(isAttemptFailed){
			if(isGrowingHeight){
				halfHeight--
				canGrowHeight = false
			} else {
				halfWidth--
				canGrowWidth = false
			}
		}

	}

	return {x: halfWidth, y: halfHeight}
}

const findMaxCircleRadius = (map: Growable2DBitmap, center: XY, settings: DungeonMapperSettings): number => {
	let radius = 0
	while(true){
		if(center.x + radius + 1 >= settings.width
		|| center.x - (radius + 1) < 0
		|| center.y + radius + 1 >= settings.height
		|| center.y - (radius + 1) < 0){
			return radius
		}
		radius++
		for(let dx = -radius; dx <= radius; dx++){
			const dy = Math.sqrt((radius * radius) - (dx * dx))
			const yMin = Math.floor(center.y - dy)
			const yMax = Math.ceil(center.y + dy)
			const x = center.x + dx
			if(map.get(x, yMin) || map.get(x, yMax)){
				return radius - 1
			}
		}
	}
}

const fillCircle = (map: Growable2DBitmap, center: XY, radius: number): XY[] => {
	const result: XY[] = []
	for(let dx = -radius; dx <= radius; dx++){
		const dy = Math.sqrt((radius * radius) - (dx * dx))
		const yMin = Math.floor(center.y - dy)
		const yMax = Math.ceil(center.y + dy)
		const x = center.x + dx
		for(let y = yMin; y <= yMax; y++){
			map.set(x, y)
			result.push({x, y})
		}
	}
	return result
}

const fillRectangle = (map: Growable2DBitmap, center: XY, dims: XY): XY[] => {
	const result: XY[] = []
	for(let x = center.x - dims.x; x <= center.x + dims.x; x++){
		for(let y = center.y - dims.y; y <= center.y + dims.y; y++){
			map.set(x, y)
			result.push({x, y})
		}
	}
	return result
}