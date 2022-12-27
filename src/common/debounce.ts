export function debounce(time: number, handler: () => void): () => void {
	let timer: ReturnType<typeof setTimeout> | null = null

	return () => {
		if(!timer){
			timer = setTimeout(() => {
				timer = null
				handler()
			}, time)
		}
	}
}