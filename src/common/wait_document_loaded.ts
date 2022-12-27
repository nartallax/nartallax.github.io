export function waitDocumentLoaded(doc: Document = document): Promise<void> {
	return new Promise(ok => {
		const check = () => {
			if(doc.readyState === "interactive" || doc.readyState === "complete"){
				doc.removeEventListener("readystatechange", check, false)
				ok()
				return true
			}
			return false
		}

		if(check()){
			return
		}

		doc.addEventListener("readystatechange", check, false)
	})
}