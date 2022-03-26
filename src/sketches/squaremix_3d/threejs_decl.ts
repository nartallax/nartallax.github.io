import type * as THREE_type from "three";

// небольшой хак, чтобы бандл не требовал реального модуля THREE, а использовал имеющийся на странице
type resultingThreejsType = typeof THREE_type;
declare global {
	const THREE: resultingThreejsType
}
//export let THREE: resultingThreejsType = window.THREE as unknown as resultingThreejsType;