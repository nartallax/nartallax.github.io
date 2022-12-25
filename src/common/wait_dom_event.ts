type DOMEventEmitter<K, E> = {
	addEventListener(name: K, handler: (e: E) => void): void
}

type DOMEventEmitterWithError<K, E> = DOMEventEmitter<K, E> & {
	addEventListener(name: "error", handler: (e: ErrorEvent) => void): void
}

export function waitDOMEvent<K, E, I extends DOMEventEmitterWithError<K, E>>(obj: I, name: K): Promise<E> {
	return new Promise((ok, bad) => {
		obj.addEventListener("error", err => bad(new Error(err.message)))
		obj.addEventListener(name, e => ok(e))
	})
}