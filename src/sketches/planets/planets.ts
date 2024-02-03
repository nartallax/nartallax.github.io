import {cycledRequestAnimationFrame} from "common/cycled_request_animation_frame"
import {PlanetsSimulationWithGraphics} from "sketches/planets/planets_graphics"

export function main(root: HTMLElement): void {
	const scene = new PlanetsSimulationWithGraphics(root, 1e-9)

	const sun = scene.addBody({
		x: 0, y: 0,
		xSpeed: 0, ySpeed: 0,
		mass: 1.989e30, // kg
		color: "#eca72c",
		radius: 25,
		outline: "#ee5622"
	})

	// mercury
	scene.addOrbitingBody({
		orbitTarget: sun,
		distance: 57909050000,
		body: {
			mass: 3.3011e23,
			color: "#96031a",
			radius: 5,
			outline: "#363636"
		}
	})

	// venus
	scene.addOrbitingBody({
		orbitTarget: sun,
		distance: 108208000000,
		orbitZoom: 0.9,
		body: {
			mass: 4.8675e24,
			color: "#63ccca",
			radius: 8,
			outline: "#5da9e9"
		}
	})

	const earth = scene.addOrbitingBody({
		orbitTarget: sun,
		distance: 147.12e9,
		body: {
			mass: 5.972e24,
			color: "#087e8b",
			radius: 10,
			outline: "#08605f"
		}
	})

	// moon
	scene.addOrbitingBody({
		orbitTarget: earth,
		distance: 384400000,
		orbitZoom: 60,
		body: {
			mass: 7.34767309e22,
			color: "#ccc9e7",
			radius: 2,
			outline: "#f5f5f5"
		}
	})

	// mars
	scene.addOrbitingBody({
		orbitTarget: sun,
		distance: 227939366000,
		body: {
			mass: 6.4171e23,
			color: "#bc8034",
			radius: 7,
			outline: "#ff8552"
		}
	})


	cycledRequestAnimationFrame(scene.svg, deltaTime => {
		if(deltaTime > 50){
			return
		}
		scene.step(deltaTime * 5000, 25)
	})
}
