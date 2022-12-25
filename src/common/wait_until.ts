export function waitUntil(checker: () => boolean, timeLimit = 5000, checkInterval = 50): Promise<void> {
	return new Promise((ok, bad) => {
		let timePassed = 0
		const check = () => {
			if(checker()){
				clearInterval(interval)
				ok()
				return
			}
			timePassed += checkInterval
			if(timePassed >= timeLimit){
				clearInterval(interval)
				bad(new Error("Failed to wait for checker " + checker + ": timeout."))
			}
		}

		const interval = setInterval(check, checkInterval)
		check()
	})
}