/** Wrapped RequestAnimationFrame, which cycles and gives you actual time passed since last invocation
 * Returns stopper function */
export function raf(handler: (timePassed: number) => void): () => void {
	let lastInvokeTime = Date.now();
	let stopped = false;

	let wrappedHandler = () => {
		if(stopped){
			return;
		}
		requestAnimationFrame(wrappedHandler);
		let newNow = Date.now();
		let diff = newNow - lastInvokeTime;
		lastInvokeTime = newNow;
		handler(diff);
	}

	requestAnimationFrame(wrappedHandler);

	return () => stopped = true;
}