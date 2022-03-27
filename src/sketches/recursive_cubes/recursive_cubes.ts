import {addCssToPage} from "common/css_utils"
import {tag, waitUntil} from "common/dom_utils"

function doCss(): void {
	addCssToPage("recursive_cubes", `
	`)
}

export async function main(): Promise<void> {
	doCss()
	document.head.appendChild(tag({tagName: "script", src: "/js/three.min.js", async: "async"}))
	document.head.appendChild(tag({tagName: "script", src: "/js/oimo.min.js", async: "async"}))
	await Promise.all([
		waitUntil(() => typeof(THREE) !== "undefined"),
		waitUntil(() => typeof(OIMO) !== "undefined")
	])

	let scene = new THREE.Scene()
	let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

	let renderer = new THREE.WebGLRenderer()
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	let geometry = new THREE.BoxGeometry()
	let material = new THREE.MeshBasicMaterial({color: 0x00ff00})
	let cube = new THREE.Mesh(geometry, material)
	scene.add(cube)

	camera.position.x = 10
	camera.position.y = 10
	camera.position.z = 10
	camera.lookAt(cube.position)

	let world = new OIMO.World({
		timestep: 1 / 60,
		iterations: 8,
		broadphase: 2,
		worldscale: 1,
		random: false,
		info: false,
		gravity: [0, -9.8, 0]
	})

	let boxPhysics = world.add({
		type: "box",
		size: [1, 1, 1],
		pos: [0, 10, 0],
		rot: [45, 45, 45],
		move: true,
		density: 1
	})

	let basePhysics = world.add({
		size: [50, 10, 50],
		pos: [0, -5, 0],
		density: 1
	})

	void boxPhysics, basePhysics

	function animate() {
		requestAnimationFrame(animate)

		world.step()
		let q = boxPhysics.getQuaternion()
		cube.quaternion.x = q.x
		cube.quaternion.y = q.y
		cube.quaternion.z = q.z
		cube.quaternion.w = q.w

		let p = boxPhysics.getPosition()
		cube.position.x = p.x
		cube.position.y = p.y
		cube.position.z = p.z

		renderer.render(scene, camera)
	}

	animate()
}