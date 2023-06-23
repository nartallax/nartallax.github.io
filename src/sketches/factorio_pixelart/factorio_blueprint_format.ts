import {base64strToUint8Array, uint8ArrayToBase64str} from "common/base64"
import * as Pako from "pako"

// https://wiki.factorio.com/Blueprint_string_format

export interface FactorioBlueprintWrapper {
	blueprint: FactorioBlueprint
}

export interface FactorioBlueprint {
	item: string
	label?: string
	label_color?: Color
	tiles?: Tile[]
	icons: Icon[]
	schedules?: Schedule[]
	entities?: Entity[]
	version: number
}

interface Entity {
	entity_number: number // 1-based
	name: string // entity type name
	position: Position
	direction?: number
	orientation?: number // 0 to 1, for smoothly rotatable entities
	connections?: Connections
	neighbours?: number[] // array of entity ids that are connected by the (copper) wires
	control_behaviour?: unknown // ??????
	items?: ItemRequest
	recipe?: string
	bar?: number // see Inventory.bar
	inventory?: Inventory
	infinitySettings?: InfinitySettings
	type?: "input" | "output" // underground belts
	input_priority?: "right" | "left" // splitters
	output_priority?: "right" | "left" // splitters
	filter?: string // splitter filter item name
	filters?: ItemFilter[] // filter inserters
	filter_mode?: "blacklist" | "whitelist" // filter inserters
	override_stack_size?: number // inserters
	drop_position?: Position // inserters
	pickup_position?: Position // inserters
	request_filters?: LogisticFilter // logistic containers
	request_from_buffers?: boolean // logistic containers
	parameters?: SpeakerParameter
	alert_parameters?: SpeakerAlertParameter
	auto_launch?: boolean // rocket silo
	variation?: number // graphic variation
	color?: Color
	station?: string // train stops
}

interface Color {
	// in range of 0 to 1
	r: number
	g: number
	b: number
	a: number
}

interface LogisticFilter {
	name: string
	index: number // 1-based
	count: number
}

interface InfinityFilter {
	name: string
	count: number
	mode: "at-least" | "at-most" | "exactly"
	index: number // 1-based
}

interface InfinitySettings {
	remove_unfiltered_items: boolean
	filters: InfinityFilter[]
}

interface ItemFilter {
	name: string
	index: number // 1-based
}

interface ItemRequest {
	[itemName: string]: number // amount
}

interface SpeakerAlertParameter {
	show_alert: boolean
	show_on_map: boolean
	icon_signal_id: SignalID
	alert_message: string
}

interface SpeakerParameter {
	playback_volume: number
	playback_globally: number
	allow_polyphony: boolean
}

interface ConnectionData {
	entity_id: number
	circuit_id: number
}

interface ConnectionPoint {
	red?: ConnectionData[]
	green?: ConnectionData[]
}

interface Connections {
	"1"?: ConnectionPoint
	"2"?: ConnectionPoint
}

interface Position {
	x: number
	y: number
}

interface Tile {
	name: string
	position: Position
}

interface WaitCondition {
	type: "time" | "inactivity" | "full" | "empty" | "item_count" | "circuit" | "robots_inactive" | "fluid_count" | "passenger_present" | "passenger_not_present"
	compare_type: "and" | "or"
	ticks?: number
	condition?: "item_count" | "circuit" | "fluid_count"
}

interface ScheduleRecord {
	station: string
	wait_conditions: WaitCondition
}

interface Schedule {
	schedule: ScheduleRecord[]
	locomotives: number[] // ids
}

interface Icon {
	index: number // 1-based
	signal: SignalID
}

interface Inventory {
	filters?: ItemFilter[]
	bar?: number // slot limiting, 0-based
}

interface SignalID {
	name: string
	type: "item" | "fluid" | "virtual"
}


const versionByte = "0"

export function decodeFactorioBlueprint(blueprintStr: string): FactorioBlueprintWrapper {
	if(blueprintStr.charAt(0) !== versionByte){
		throw new Error("Unsupported blueprint format version.")
	}
	const blueprintStrWithoutVersion = blueprintStr.substring(1)
	const bytes = base64strToUint8Array(blueprintStrWithoutVersion)
	const unpacked = Pako.inflate(bytes, {to: "string"})
	return JSON.parse(unpacked)
}

export function encodeFactorioBlueprint(blueprint: FactorioBlueprintWrapper): string {
	const deflated = Pako.deflate(JSON.stringify(blueprint), {level: 9})
	const base64 = uint8ArrayToBase64str(deflated)
	return versionByte + base64
}