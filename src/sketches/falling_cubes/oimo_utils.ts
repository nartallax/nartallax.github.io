// those are not really useful right now
// saving them just not to lose

import * as OIMO from "lib/oimo"

function monkeypatch<K extends string>(proto: {[k in K]: (...args: unknown[]) => unknown}, name: string & K, type: "before" | "after", fn: (...args: unknown[]) => unknown) {
	const origFn = proto[name]

	proto[name] = type === "before" ? function(this: unknown, ...args: unknown[]): unknown {
		fn.apply(this, args)
		return origFn.apply(this, args)
	} : function(this: unknown, ...args: unknown[]): unknown {
		const result = origFn.apply(this, args)
		fn.apply(this, args)
		return result
	}
}

export namespace OIMOUtils {
	export function monkeypatchSleepWake(sample: OIMO.PhysicalObjectInstance, onChange: (item: OIMO.PhysicalObjectInstance) => void): void {

		function callChange(this: OIMO.PhysicalObjectInstance) {
			onChange(this)
		}
		monkeypatch(Object.getPrototypeOf(sample), "sleep", "after", callChange)
		monkeypatch(Object.getPrototypeOf(sample), "awake", "after", callChange)
	}
}