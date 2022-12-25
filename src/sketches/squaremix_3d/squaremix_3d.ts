import * as THREE from "three"
import {waitDOMEvent} from "common/wait_dom_event"
import {tag} from "common/tag"
import * as css from "./squaremix_3d.module.scss"
import {getBinder} from "common/binder/binder"

const imageUrl = "/img/sketch/squaremix_3d.png"
const imageWidth = 1920
const imageHeight = 1080

let img: HTMLImageElement | null = null
let canvas: HTMLCanvasElement | null = null

async function init(root: HTMLElement): Promise<void> {
	const bodyRect = root.getBoundingClientRect()

	if(img){
		img.remove()
		img = null
	}
	if(canvas){
		canvas.remove()
		canvas = null
	}

	img = tag({tagName: "img", attrs: {src: imageUrl}, class: css.initialImage})
	if(bodyRect.width / bodyRect.height > imageWidth / imageHeight){
		img.style.maxWidth = "100vw"
	} else {
		img.style.maxHeight = "100vh"
	}
	root.appendChild(img)
	await waitDOMEvent(img, "load")

	let isActive = false

	const imgRect = img.getBoundingClientRect()
	const xRatio = imgRect.width / bodyRect.width
	const yRatio = imgRect.height / bodyRect.height
	const scene = new THREE.Scene()
	const camera = new THREE.OrthographicCamera(-0.5 / xRatio, 0.5 / xRatio, -0.5 / yRatio, 0.5 / yRatio, 0.1, 1000)
	camera.position.z = 2
	camera.position.x = camera.position.y = 0
	camera.lookAt(0, 0, 0)
	camera.rotateZ(Math.PI)

	const squareSize = 100
	const columnsCount = Math.ceil(imgRect.height / squareSize)
	const rowsCount = Math.ceil(imgRect.width / squareSize)

	const renderer = new THREE.WebGLRenderer()
	// renderer.setSize(rect.width, rect.height)
	renderer.setSize(bodyRect.width, bodyRect.height)

	const textureLoader = new THREE.TextureLoader()
	const texture = await textureLoader.loadAsync(img.src)
	const material = new THREE.MeshBasicMaterial({map: texture})

	canvas = renderer.domElement
	canvas.classList.add(css.squaremixCanvas ?? "")
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
			const action = new TransformAction(columnsCount, rowsCount, scene, material, camera, () => renderer.render(scene, camera))
			await action.run()
		} finally {
			isActive = false
		}
	}
}

export function main(root: HTMLElement): void {
	init(root)

	getBinder(root).onResize(() => init(root))
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
		const maxDerivation = 3

		const result = new Array(columns) as number[][]
		for(let c = 0; c < columns; c++){
			const column = result[c] = new Array(rows) as number[]
			for(let r = 0; r < rows; r++){
				const derivation = maxDerivation * ((Math.random() * 2) - 1) // +- maxDerivation
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

		const plane = this.makeAddSlicePlane(0, 1, 0, 1)
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
		const plane = this.makeAddSlicePlane(
			1 - height, 1,
			y / this.rowsCount, (y + 1) / this.rowsCount
		)

		plane.rotateY(-Math.PI / 2)

		plane.translateX(0.5 - height)
		plane.translateY(y / this.rowsCount - 0.5)
		plane.translateZ(-(x + 1) / this.columnsCount + 0.5)
	}

	private addTopPlane(x: number, y: number, height: number): void {
		const plane = this.makeAddSlicePlane(
			x / this.columnsCount, (x + 1) / this.columnsCount,
			y / this.rowsCount, (y + 1) / this.rowsCount,
			true
		)

		plane.translateX(x / this.columnsCount - 0.5)
		plane.translateY(y / this.rowsCount - 0.5)
		plane.translateZ(0.5 - height)
	}

	private makeAddSlicePlane(left: number, right: number, top: number, bottom: number, rotate = false): THREE.Object3D {
		const geom = new THREE.PlaneGeometry()
		this.disposeables.push(geom)
		const plane = new THREE.Mesh(geom, this.material)

		const uv = geom.attributes.uv!
		if(!rotate){
			for(let i = 0; i < uv.count; i++){
				uv.setX(i, uv.getX(i) === 0 ? left : right)
				uv.setY(i, uv.getY(i) === 0 ? top : bottom)
			}
		} else {
			const l = 1 - top, r = 1 - bottom
			const t = left, b = right
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

		const xOffset = right - left, yOffset = bottom - top
		const pos = geom.attributes.position!
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
		const wrappedHandler = () => {
			const frameStart = Date.now()
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