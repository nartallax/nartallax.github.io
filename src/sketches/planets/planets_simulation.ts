export interface PlanetSimulationBody {
	x: number
	y: number
	mass: number
	xSpeed: number
	ySpeed: number
}

const G = 6.67408e-11

export class PlanetsSimulation<B extends PlanetSimulationBody> {

	bodies: B[] = []

	step(deltaTime: number): void {
		this.velocityStep(deltaTime)
		this.positionStep(deltaTime)
	}

	addBody(body: B): B {
		this.bodies.push(body)
		return body
	}

	findCenterOfMass(bodies: readonly PlanetSimulationBody[]): PlanetSimulationBody {
		const mass = bodies.map(body => body.mass).reduce((a, b) => a + b, 0)
		const x = bodies.map(body => body.mass * body.x).reduce((a, b) => a + b, 0) / mass
		const y = bodies.map(body => body.mass * body.y).reduce((a, b) => a + b, 0) / mass
		const xSpeed = bodies.map(body => body.mass * body.xSpeed).reduce((a, b) => a + b, 0) / mass
		const ySpeed = bodies.map(body => body.mass * body.ySpeed).reduce((a, b) => a + b, 0) / mass
		return {mass, x, y, xSpeed, ySpeed}
	}

	addOrbitingBody(args: {orbitTarget: PlanetSimulationBody | PlanetSimulationBody[], body: Omit<B, "x" | "y" | "xSpeed" | "ySpeed">, distance: number, position?: number, reverse?: boolean}): B {
		const target = this.findCenterOfMass(Array.isArray(args.orbitTarget) ? args.orbitTarget : [args.orbitTarget])

		const orbitSpeed = Math.sqrt((G * target.mass) / args.distance) * (args.reverse ? -1 : 1)
		const pos = (args.position ?? Math.random()) * Math.PI * 2

		return this.addBody({
			x: target.x + args.distance * Math.cos(pos),
			y: target.y + args.distance * Math.sin(pos),
			xSpeed: target.xSpeed - orbitSpeed * Math.sin(pos),
			ySpeed: target.ySpeed + orbitSpeed * Math.cos(pos),
			...args.body
		} as B) // yeah, that's not pretty, but whatever
	}

	private velocityStep(deltaTime: number): void {
		for(let i = 0; i < this.bodies.length; i++){
			const body = this.bodies[i]!
			for(let j = i + 1; j < this.bodies.length; j++){
				const otherBody = this.bodies[j]!
				const dx = otherBody.x - body.x
				const dy = otherBody.y - body.y
				const dist2 = (dx ** 2) + (dy ** 2)
				const direction = Math.atan2(dy, dx)

				const thisDeltaSpeed = ((G * otherBody.mass) / dist2) * deltaTime
				body.xSpeed -= thisDeltaSpeed * Math.cos(direction)
				body.ySpeed += thisDeltaSpeed * Math.sin(direction)

				const otherDeltaSpeed = ((G * body.mass) / dist2) * deltaTime
				otherBody.xSpeed -= otherDeltaSpeed * Math.cos(-direction)
				otherBody.ySpeed += otherDeltaSpeed * Math.sin(-direction)
			}
		}
	}

	protected positionStep(deltaTime: number): void {
		for(const body of this.bodies){
			body.x += body.xSpeed * deltaTime
			body.y += body.ySpeed * deltaTime
		}
	}

}