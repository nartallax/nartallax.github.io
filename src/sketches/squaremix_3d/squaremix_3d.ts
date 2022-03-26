import {addCssToPage} from "common/css_utils"
import {tag, waitLoadEvent, waitUntil} from "common/dom_utils"

function doCss(): void {
	addCssToPage("squaremix_3d", `
html, body {
	position: absolute;
	width: 100vw;
	height: 100vh;
	border: 0;
	margin: 0;
	padding: 0;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

canvas {
	border: 2px solid #888;
}

.initial-image {
	max-width: 100vw;
	max-height: 100vh;
	width: auto;
	height: auto;
}
	`)
}

const columnsCount = 16
const rowsCount = 16

export async function main(): Promise<void> {
	doCss()

	document.head.appendChild(tag({tagName: "script", src: "/js/three.min.js", async: "async"}))

	let img = tag({tagName: "img", src: "/img/sketch/squaremix_3d.jpg", class: "initial-image"})
	document.body.appendChild(img)
	await Promise.all([
		waitLoadEvent(img),
		waitUntil(() => typeof(THREE) !== "undefined")
	])

	let isActive = false

	let btn = tag({tagName: "input", type: "button", value: "Replay"})
	btn.addEventListener("click", runAction)
	document.body.appendChild(btn)

	let rect = img.getBoundingClientRect()
	let displayWidth = rect.width, displayHeight = rect.height
	let scene = new THREE.Scene()
	let camera = new THREE.OrthographicCamera(-0.5, 0.5, -0.5, 0.5, 0.1, 1000)
	camera.position.z = 2
	camera.position.x = camera.position.y = 0
	camera.lookAt(0, 0, 0)
	camera.rotateZ(Math.PI)

	let renderer = new THREE.WebGLRenderer()
	renderer.setSize(displayWidth, displayHeight)

	let textureLoader = new THREE.TextureLoader()
	let texture = await textureLoader.loadAsync(img.src)
	let material = new THREE.MeshBasicMaterial({map: texture})

	img.after(renderer.domElement)
	img.remove()

	runAction()

	async function runAction(): Promise<void> {
		if(isActive){
			return
		}
		isActive = true
		try {
			let action = new TransformAction(scene, material, camera, () => renderer.render(scene, camera))
			await action.run()
		} finally {
			isActive = false
		}
	}
}

class TransformAction {

	private readonly colHeights: number[][]
	private readonly disposeables = [] as {dispose(): void}[]
	private readonly group: THREE.Group

	constructor(
		private readonly scene: THREE.Scene,
		private readonly material: THREE.Material,
		private readonly camera: THREE.Camera,
		private readonly render: () => void
	) {
		this.colHeights = this.generateColumnHeights(columnsCount, rowsCount)
		this.group = new THREE.Group()
		this.scene.add(this.group)
	}

	async run(): Promise<void> {
		this.generateColumnObjects()

		await forEachFrameProgress(1 / 4, progress => {
			this.group.rotation.y = (Math.PI / 2) * ((1 - progress) + 2)
			this.camera.rotation.z = (Math.PI / 2) * (progress + 2)
			this.render()
		})

		this.dispose()
	}

	private generateColumnHeights(columns: number, rows: number): number[][] {
		let maxDerivation = 3

		let result = new Array(columns) as number[][]
		for(let c = 0; c < columns; c++){
			let column = result[c] = new Array(rows) as number[]
			for(let r = 0; r < rows; r++){
				let derivation = maxDerivation * ((Math.random() * 2) - 1) // +- maxDerivation
				let depth = (columns - c) + derivation
				depth = Math.min(1, Math.max(0, Math.round(depth) / columns))
				column[r] = depth
			}
		}

		return result
	}

	private generateColumnObjects(): void {
		for(let x = 0; x < this.colHeights.length; x++){
			for(let y = 0; y < this.colHeights[x]!.length; y++){
				this.generateColumnObject(x, y, this.colHeights[x]![y]!)
			}
		}
	}

	private generateColumnObject(x: number, y: number, height: number): void {
		this.addTopPlane(x, y, height)
		this.addSidePlane(x, y, height)
	}

	private addSidePlane(x: number, y: number, height: number): void {
		if(height === 0){
			return
		}
		let plane = this.makeAddSlicePlane(
			1 - height, 1,
			y / rowsCount, (y + 1) / rowsCount
		)

		plane.rotateY(-Math.PI / 2)

		plane.translateX(0.5 - height)
		plane.translateY(y / rowsCount - 0.5)
		plane.translateZ(-(x + 1) / columnsCount + 0.5)
	}

	private addTopPlane(x: number, y: number, height: number): void {
		let plane = this.makeAddSlicePlane(
			x / columnsCount, (x + 1) / columnsCount,
			y / rowsCount, (y + 1) / rowsCount,
			true
		)

		plane.translateX(x / columnsCount - 0.5)
		plane.translateY(y / rowsCount - 0.5)
		plane.translateZ(0.5 - height)
	}

	private makeAddSlicePlane(left: number, right: number, top: number, bottom: number, rotate = false): THREE.Object3D {
		let geom = new THREE.PlaneGeometry()
		this.disposeables.push(geom)
		let plane = new THREE.Mesh(geom, this.material)

		let uv = geom.attributes.uv
		if(!rotate){
			for(let i = 0; i < uv.count; i++){
				uv.setX(i, uv.getX(i) === 0 ? left : right)
				uv.setY(i, uv.getY(i) === 0 ? top : bottom)
			}
		} else {
			let l = 1 - top, r = 1 - bottom
			let t = left, b = right
			for(let i = 0; i < uv.count; i++){
				if(uv.getX(i) === 0){
					if(uv.getY(i) === 0){
						uv.setXY(i, l, t)
					} else {
						uv.setXY(i, r, t)
					}
				} else if(uv.getY(i) === 0){
					uv.setXY(i, l, b)
				} else {
					uv.setXY(i, r, b)
				}
			}
		}
		uv.needsUpdate = true

		let xOffset = right - left, yOffset = bottom - top
		let pos = geom.attributes.position
		for(let i = 0; i < pos.count; i++){
			pos.setX(i, pos.getX(i) < 0 ? 0 : xOffset)
			pos.setY(i, pos.getY(i) < 0 ? 0 : yOffset)
		}
		pos.needsUpdate = true
		this.group.add(plane)

		return plane
	}

	private dispose(): void {
		this.disposeables.forEach(x => x.dispose())
		this.disposeables.length = 0
		this.scene.remove(this.group)
	}
}

function forEachFrameProgress(incrementPerSecond: number, doOnFrame: (progress: number) => void): Promise<void> {
	return new Promise((ok, bad) => {
		let progress = 0
		let prevFrameStart = Date.now()
		let wrappedHandler = () => {
			let frameStart = Date.now()
			try {
				doOnFrame(Math.min(1, progress))
			} catch(e){
				bad(e)
				return
			}
			if(progress < 1){
				requestAnimationFrame(wrappedHandler)
			} else {
				ok()
			}
			progress += incrementPerSecond * ((frameStart - prevFrameStart) / 1000)
			prevFrameStart = frameStart
		}
		wrappedHandler()
	})
}