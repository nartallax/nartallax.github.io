import {tag} from "common/tag"
import {waitDOMEvent} from "common/wait_dom_event"
import {CountdownTimer} from "website/controls/countdown_timer"
import {noSketchInfoOnSketchPageArgName} from "website/controls/sketch_page"
import {router, sketchRouteById} from "website/routes"
import {SketchDescription} from "website/sketches"
import * as css from "./sketch_block.module.scss"

export function SketchBlock(sketch: SketchDescription): HTMLElement {

	const imgContainer = tag({class: css.imgContainer}, [
		tag({tagName: "img", attrs: {src: sketch.thumbnail, alt: sketch.description}})
	])

	const root = tag({
		class: css.sketch,
		on: {click: () => router.goTo(sketchRouteById(sketch.id))}
	}, [
		imgContainer,
		tag({class: css.sketchTitle, text: sketch.name})
	])

	let timer: Timer | null = null
	root.addEventListener("mouseenter", () => {
		if(timer){
			return
		}
		timer = runSketchTimer(sketch, imgContainer, 1500)
	}, {passive: true})

	root.addEventListener("mouseleave", () => {
		timer?.stop()
		timer = null
	}, {passive: true})

	return root
}

interface Timer {
	stop(): void
}

function runSketchTimer(sketch: SketchDescription, container: HTMLElement, time: number): Timer {
	let stopped = false
	let timerEl: HTMLElement | null = null
	let sketchFrame: HTMLIFrameElement | null = null

	function cleanup() {
		timerEl?.remove()
		sketchFrame?.remove()
	}

	(async() => {
		timerEl = tag({
			class: css.timerBackground,
			style: {animationDuration: ((time / 4) / 1000) + "s"}
		}, [
			CountdownTimer(time)
		])
		container.appendChild(timerEl)

		await sleep(time / 2)
		if(stopped){
			return
		}

		const url = router.formRouteURL(sketchRouteById(sketch.id), {[noSketchInfoOnSketchPageArgName]: true})
		sketchFrame = tag({
			tagName: "iframe",
			class: css.sketchPreview,
			attrs: {src: url}
		})
		container.appendChild(sketchFrame)
		await Promise.all([
			sleep(time / 2),
			waitDOMEvent(sketchFrame, "load")
		])
		if(stopped){
			return
		}

		sketchFrame.classList.add(css.completed ?? "")
		// timerEl?.remove()
	})()

	return {stop: () => {
		stopped = true
		cleanup()
	}}
}

function sleep(ms: number): Promise<void> {
	return new Promise(ok => setTimeout(ok, ms))
}