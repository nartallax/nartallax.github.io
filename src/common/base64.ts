export function base64strToUint8Array(base64: string): Uint8Array {
	const binaryString = atob(base64)
	const bytes = new Uint8Array(binaryString.length)
	for(let i = 0; i < binaryString.length; i++){
		bytes[i] = binaryString.charCodeAt(i)
	}
	return bytes
}

export function uint8ArrayToBase64str(bytes: Uint8Array): string {
	let binary = ""
	for(let i = 0; i < bytes.byteLength; i++){
		binary += String.fromCharCode(bytes[i]!)
	}
	return window.btoa(binary)
}