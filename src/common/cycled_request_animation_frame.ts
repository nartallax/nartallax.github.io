/** Wrapped RequestAnimationFrame, which cycles.
 * Passes time since previous frame as argument.
 * Returns stopper function
 * Unmounting root also stops it */
export function cycledRequestAnimationFrame(root: HTMLElement | SVGElement, handler: (delta: number) => void, onStop?: () => void): () => void {
	let stopped = false

	let prevCallTime = 0

	const wrappedHandler = (time: number) => {
		if(stopped){
			onStop?.()
			return
		}
		if(!root.isConnected){
			onStop?.()
			stopped = true
			return
		}
		const delta = time - prevCallTime
		prevCallTime = time
		requestAnimationFrame(wrappedHandler)
		handler(delta)
	}

	requestAnimationFrame(wrappedHandler)

	return () => stopped = true
}