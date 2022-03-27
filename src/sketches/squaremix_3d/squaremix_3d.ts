import {addCssToPage} from "common/css_utils"
import {tag, waitLoadEvent, waitUntil} from "common/dom_utils"
import {makeSketchInfoButton} from "common/sketch_info_button"
import {watchResize} from "common/watch_resize"

const imageUrl = "/img/sketch/squaremix_3d.png"
const imageWidth = 1920
const imageHeight = 1080

function doCss(): void {
	addCssToPage("squaremix_3d", `
body {
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
	overflow: hidden;
}

canvas {
	cursor: pointer;
}

.initial-image {
	width: auto;
	height: auto;
}
	`)
}

async function init(): Promise<void> {
	document.querySelectorAll("canvas").forEach(el => el.remove())
	document.querySelectorAll("img").forEach(el => el.remove())
	let bodyRect = document.body.getBoundingClientRect()

	let img = tag({tagName: "img", src: imageUrl, class: "initial-image"})
	if(bodyRect.width / bodyRect.height > imageWidth / imageHeight){
		img.style.maxWidth = "100vw"
	} else {
		img.style.maxHeight = "100vh"
	}
	document.body.appendChild(img)
	await Promise.all([
		waitLoadEvent(img),
		waitUntil(() => typeof(THREE) !== "undefined")
	])

	let isActive = false

	let imgRect = img.getBoundingClientRect()
	let xRatio = imgRect.width / bodyRect.width
	let yRatio = imgRect.height / bodyRect.height
	let scene = new THREE.Scene()
	let camera = new THREE.OrthographicCamera(-0.5 / xRatio, 0.5 / xRatio, -0.5 / yRatio, 0.5 / yRatio, 0.1, 1000)
	camera.position.z = 2
	camera.position.x = camera.position.y = 0
	camera.lookAt(0, 0, 0)
	camera.rotateZ(Math.PI)

	let squareSize = 100
	let columnsCount = Math.ceil(imgRect.height / squareSize)
	let rowsCount = Math.ceil(imgRect.width / squareSize)

	let renderer = new THREE.WebGLRenderer()
	// renderer.setSize(rect.width, rect.height)
	renderer.setSize(bodyRect.width, bodyRect.height)

	let textureLoader = new THREE.TextureLoader()
	let texture = await textureLoader.loadAsync(img.src)
	let material = new THREE.MeshBasicMaterial({map: texture})

	let canvas = renderer.domElement
	img.after(canvas)
	canvas.addEventListener("click", runAction)
	img.remove()

	runAction()

	async function runAction(): Promise<void> {
		if(isActive){
			return
		}
		isActive = true
		try {
			let action = new TransformAction(columnsCount, rowsCount, scene, material, camera, () => renderer.render(scene, camera))
			await action.run()
		} finally {
			isActive = false
		}
	}
}

export function main(): void {
	doCss()
	makeSketchInfoButton()
	document.head.appendChild(tag({tagName: "script", src: "/js/three.min.js", async: "async"}))
	init()
	watchResize(document.body, init)
}

class TransformAction {

	private readonly colHeights: number[][]
	private readonly disposeables = [] as {dispose(): void}[]
	private readonly group: THREE.Group

	constructor(
		private readonly columnsCount: number,
		private readonly rowsCount: number,
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
		this.generateObjects()

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

	private generateObjects(): void {
		for(let x = 0; x < this.colHeights.length; x++){
			for(let y = 0; y < this.colHeights[x]!.length; y++){
				this.generateColumnObject(x, y, this.colHeights[x]![y]!)
			}
		}

		let plane = this.makeAddSlicePlane(0, 1, 0, 1)
		plane.translateX(-0.5)
		plane.translateY(-0.5)
		plane.translateZ(-0.5)
		plane.rotateY(-Math.PI / 2)
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
			y / this.rowsCount, (y + 1) / this.rowsCount
		)

		plane.rotateY(-Math.PI / 2)

		plane.translateX(0.5 - height)
		plane.translateY(y / this.rowsCount - 0.5)
		plane.translateZ(-(x + 1) / this.columnsCount + 0.5)
	}

	private addTopPlane(x: number, y: number, height: number): void {
		let plane = this.makeAddSlicePlane(
			x / this.columnsCount, (x + 1) / this.columnsCount,
			y / this.rowsCount, (y + 1) / this.rowsCount,
			true
		)

		plane.translateX(x / this.columnsCount - 0.5)
		plane.translateY(y / this.rowsCount - 0.5)
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