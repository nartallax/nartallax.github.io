/** Wrapped RequestAnimationFrame, which cycles
 * Returns stopper function */
export function cycledRequestAnimationFrame(handler: (timePassed: number) => void): () => void {
	let stopped = false

	const wrappedHandler = (diff: number) => {
		if(stopped){
			return
		}
		requestAnimationFrame(wrappedHandler)
		handler(diff)
	}

	requestAnimationFrame(wrappedHandler)

	return () => stopped = true
}