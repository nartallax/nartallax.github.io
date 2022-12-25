import * as THREE from "three"
import * as OIMO from "lib/oimo"

function copyPos(phys: OIMO.PhysicalObjectInstance, graph: THREE.Object3D): void {
	const q = phys.getQuaternion()
	graph.quaternion.x = q.x
	graph.quaternion.y = q.y
	graph.quaternion.z = q.z
	graph.quaternion.w = q.w

	const p = phys.getPosition()
	graph.position.x = p.x
	graph.position.y = p.y
	graph.position.z = p.z
}

function makeHorisontalRectGeom(def: {zSize: number, xSize: number, dy: number}): THREE.BufferGeometry {
	const geometry = new THREE.PlaneGeometry(1, 1, 1)

	const pos = geometry.attributes.position!
	for(let i = 0; i < pos.count; i++){
		pos.setXYZ(i,
			-pos.getX(i) * def.xSize,
			def.dy,
			pos.getY(i) * def.zSize
		)
	}
	pos.needsUpdate = true

	const norm = geometry.attributes.normal!
	for(let i = 0; i < norm.count; i++){
		norm.setXYZ(i,
			-norm.getX(i) * def.xSize,
			def.dy,
			norm.getY(i) * def.zSize
		)
	}
	norm.needsUpdate = true

	return geometry
}

export async function main(root: HTMLElement): Promise<void> {
	const textureLoader = new THREE.TextureLoader()
	const scene = new THREE.Scene()
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

	const renderer = new THREE.WebGLRenderer({
		antialias: true
	})
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.shadowMap.enabled = true
	renderer.shadowMap.type = THREE.PCFSoftShadowMap

	const canvas = renderer.domElement
	root.appendChild(canvas)
	canvas.addEventListener("click", () => {
		start()
	})
	canvas.style.cursor = "pointer"

	const texture = await textureLoader.loadAsync("/img/sketch/recursive_cubes_orange_square.png")
	const cubeMaterial = new THREE.MeshLambertMaterial({map: texture})
	const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)

	const floorGeometry = makeHorisontalRectGeom({xSize: 100, zSize: 100, dy: 0.5})
	const floorMaterial = new THREE.MeshLambertMaterial({color: 0x3a2434})

	{
		const light = new THREE.AmbientLight(0xffffff, 0.5)
		scene.add(light)
	}

	{
		const light = new THREE.DirectionalLight(0xffffff, 0.75)
		light.castShadow = true
		light.shadow.mapSize.width = 2048
		light.shadow.mapSize.height = 2048
		light.shadow.camera.near = 0.5
		light.shadow.camera.far = 100
		light.shadow.camera.left = -50
		light.shadow.camera.right = 50
		light.shadow.camera.top = 50
		light.shadow.camera.bottom = -50
		light.position.y = 50
		light.position.x = -25
		light.position.z = 25
		scene.add(light)
		// scene.add(new THREE.CameraHelper(light.shadow.camera))
	}

	camera.position.x = 25
	camera.position.y = 25
	camera.position.z = 25
	camera.lookAt(0, 0, 0)

	let section: Section | null = null
	function start(): void {
		const currentSection = new Section(
			cubeGeometry, cubeMaterial,
			floorGeometry, floorMaterial,
			scene
		)

		if(section){
			section.delete()
		}
		section = currentSection

		function animate() {
			if(section !== currentSection){
				return
			}
			requestAnimationFrame(animate)
			currentSection.step()

			camera.lookAt(currentSection.targetCube.graph.position)
			renderer.render(scene, camera)
		}

		animate()
	}

	start()
}

const sideCubeCount = 5
const floorSideSize = 100
const floorHeight = 1

interface PGObject {
	phys: OIMO.PhysicalObjectInstance
	graph: THREE.Object3D
}

class Section {

	private readonly world = new OIMO.World({
		timestep: 1 / 60,
		iterations: 8,
		broadphase: 2,
		worldscale: 1,
		random: false,
		info: false,
		gravity: [0, -9.8, 0]
	})

	private readonly cubes: PGObject[]
	private readonly floor: PGObject
	readonly targetCube: PGObject

	constructor(
		private readonly cubeGeometry: THREE.BufferGeometry,
		private readonly cubeMaterial: THREE.Material,
		private readonly floorGeometry: THREE.BufferGeometry,
		private readonly floorMaterial: THREE.Material,
		private readonly scene: THREE.Scene
	) {
		const {targetCube, cubes} = this.createCubes()
		this.cubes = cubes
		this.targetCube = targetCube
		this.floor = this.createFloor()
	}

	delete(): void {
		this.rmPg(this.floor)
		for(const cube of this.cubes){
			this.rmPg(cube)
		}

	}

	private rmPg(pg: PGObject): void {
		this.scene.remove(pg.graph)
		pg.phys.remove()
	}

	private createCubes(): {cubes: PGObject[], targetCube: PGObject} {
		const cubes = [] as PGObject[]
		let targetCube = null as PGObject | null
		for(let x = 0; x < sideCubeCount; x++){
			for(let y = 0; y < sideCubeCount; y++){
				for(let z = 0; z < sideCubeCount; z++){
					const phys = this.world.add({
						type: "box",
						size: [1, 1, 1],
						pos: [x, y + 25, z],
						rot: [0, 0, 0],
						move: true,
						density: 1,
						friction: 0.5
					})
					// phys.linearVelocity.x = 4 + 2 * (Math.random() - 0.5)
					// phys.linearVelocity.y = y * x * 2 + (2 * (Math.random() - 0.5))
					phys.linearVelocity.x = x - (sideCubeCount / 2) + (2 * (Math.random() - 0.5))
					phys.linearVelocity.z = z - (sideCubeCount / 2) + (2 * (Math.random() - 0.5))
					phys.linearVelocity.y = y - (sideCubeCount / 2) + (2 * (Math.random() - 0.5))
					const graph = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial)
					graph.castShadow = true
					graph.receiveShadow = true
					this.scene.add(graph)
					const pg = {phys, graph}
					cubes.push(pg)
					if(x === sideCubeCount - 1 && y === sideCubeCount - 1 && z === Math.floor(sideCubeCount / 2)){
						// phys.linearVelocity.x *= 1.25
						// phys.linearVelocity.y *= 1.25
						// phys.angularVelocity.y = 0
						// phys.angularVelocity.z = 0
						targetCube = pg
					} else if(x !== sideCubeCount - 1 && y !== sideCubeCount - 1 && z !== Math.floor(sideCubeCount / 2)){
						phys.angularVelocity.x = Math.random() * Math.PI
						phys.angularVelocity.y = Math.random() * Math.PI
						phys.angularVelocity.z = Math.random() * Math.PI
					}
				}
			}
		}
		return {cubes, targetCube: targetCube!}
	}

	private createFloor(): PGObject {
		const phys = this.world.add({
			type: "box",
			size: [floorSideSize, floorHeight, floorSideSize],
			pos: [0, -floorHeight, 0],
			rot: [0, 0, 0],
			density: 1,
			friction: 0.5
		})
		const graph = new THREE.Mesh(this.floorGeometry, this.floorMaterial)
		graph.receiveShadow = true
		this.scene.add(graph)
		copyPos(phys, graph)
		return {phys, graph}
	}

	step(): void {
		this.world.step()
		for(const {phys, graph} of this.cubes){
			copyPos(phys, graph)
		}
	}

}