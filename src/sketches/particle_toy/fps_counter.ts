export class FpsCounter {
	private count = 0
	private time = 0

	constructor(private readonly reportFreq = 3) {}

	recordFrame(deltaTime: number): void {
		this.time += deltaTime
		this.count++
		while(this.time > this.reportFreq){
			this.time -= this.reportFreq
			console.log(`FPS: ${this.count / this.reportFreq}`)
			this.count = 0
		}
	}
}