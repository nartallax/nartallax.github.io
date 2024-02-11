import wasm from "sketches/random_rhombus_tilings/wasm/rhombus_randomiser.wasm"
import {instantiate} from "./wasm/rhombus_randomiser"

export type WasmRhombusRandomiser = ReturnType<typeof instantiate> extends Promise<infer X>? X: never

export const getWasmRhombusRandomiser = async(): Promise<WasmRhombusRandomiser> => {
	return await instantiate(fetch(wasm))
}