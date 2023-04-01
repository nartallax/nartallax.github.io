function twoHex(x: number): string {
	return (x > 0xf ? "" : "0") + x.toString(16)
}

export function rgbNumberToColorString(rgb: number): string {
	const b = rgb & 0xff
	rgb >>= 8
	const g = rgb & 0xff
	rgb >>= 8
	const r = rgb & 0xff

	return "#" + twoHex(r) + twoHex(g) + twoHex(b)
}