import {ReactNode, useEffect, useRef, useState} from "react"
import * as css from "./wheel_clock.module.scss"
import {createRoot} from "react-dom/client"
import * as React from "react"

const EXTRA_VALUES_DISPLAYED_PER_SIDE = 3
const FACE_DESCRIPTIONS = (() => {
	const result: {
		faceDirection: number
		apparency: number
		offset: number
	}[] = []
	let cumulativeOffset = 0
	for(let i = -EXTRA_VALUES_DISPLAYED_PER_SIDE - 1; i <= EXTRA_VALUES_DISPLAYED_PER_SIDE + 1; i++){
		let apparency: number
		if(i < -EXTRA_VALUES_DISPLAYED_PER_SIDE){
			apparency = 0
		} else if(i > EXTRA_VALUES_DISPLAYED_PER_SIDE){
			apparency = 0
		} else {
			apparency = 1.5 ** (-Math.abs(i))
		}
		const offset = cumulativeOffset + (apparency / 2) + 0.5
		cumulativeOffset += apparency
		result.push({
			faceDirection: i < 0 ? -1 : i > 0 ? 1 : 0,
			offset,
			apparency
		})
	}
	return result
})()
const TOTAL_WHEEL_HEIGHT_BLOCKS = FACE_DESCRIPTIONS.map(d => d.apparency).reduce((a, b) => a + b)

const SEPARATOR_REL_WIDTH = 1 / 3
const WHEELS_COUNT = 6
const SEPARATORS_COUNT = 2
const TOTAL_REL_WIDTH = WHEELS_COUNT + SEPARATOR_REL_WIDTH * SEPARATORS_COUNT
const HEIGHT_WIDTH_RATIO = 1

const MAX_WIDTH_PX = 750
const MAX_HEIGHT_PX = 750

export const main = (root: HTMLElement) => {
	createRoot(root).render(<div className={css.page}>
		<Clock parent={root}/>
	</div>)
}

const figureOutClockSizeVars = (availableWidth: number, availableHeight: number): Record<string, string> => {
	availableWidth = Math.min(MAX_WIDTH_PX, availableWidth)
	availableHeight = Math.min(MAX_HEIGHT_PX, availableHeight)
	let width: number, height: number
	const heightByWidth = availableWidth * HEIGHT_WIDTH_RATIO
	if(heightByWidth > availableHeight){
		width = availableHeight / HEIGHT_WIDTH_RATIO
		height = availableHeight
	} else {
		height = heightByWidth
		width = availableWidth
	}

	const separatorSpace = width * ((SEPARATOR_REL_WIDTH * SEPARATORS_COUNT) / TOTAL_REL_WIDTH)
	const wheelSpace = width * (WHEELS_COUNT / TOTAL_REL_WIDTH)

	return {
		"--block-height": (height / TOTAL_WHEEL_HEIGHT_BLOCKS) + "px",
		"--wheel-width": (wheelSpace / WHEELS_COUNT) + "px",
		"--separator-width": (separatorSpace / SEPARATORS_COUNT) + "px",
		"--block-font-size": (wheelSpace / WHEELS_COUNT) + "px",
		"--total-wheel-height-blocks": TOTAL_WHEEL_HEIGHT_BLOCKS + ""
	}
}

const Clock = ({parent}: {parent: HTMLElement}) => {
	const pageSize = useElementDimensions(parent)
	const style = figureOutClockSizeVars(pageSize.width, pageSize.height)


	const [now, setNow] = useState(new Date())
	const nowRef = useRef(now)
	nowRef.current = now

	useRaf(() => {
		const newNow = new Date()
		if(nowRef.current.getUTCSeconds() !== newNow.getUTCSeconds()){
			setNow(newNow)
			nowRef.current = newNow
		}
	})

	const nowTimeSeconds = Math.floor(now.getTime() / 1000)

	return (
		<div className={css.clock} style={style}>
			<ClockWheel limit={3} value={Math.floor(now.getHours() / 10)} valueKey={Math.floor(nowTimeSeconds / 36000)}/>
			<ClockWheel limit={10} value={Math.floor(now.getHours() % 10)} valueKey={Math.floor(nowTimeSeconds / 3600)}/>
			<ClockWheelSeparator/>
			<ClockWheel limit={6} value={Math.floor(now.getMinutes() / 10)} valueKey={Math.floor(nowTimeSeconds / 600)}/>
			<ClockWheel limit={10} value={now.getMinutes() % 10} valueKey={Math.floor(nowTimeSeconds / 60)}/>
			<ClockWheelSeparator/>
			<ClockWheel limit={6} value={Math.floor(now.getSeconds() / 10)} valueKey={Math.floor(nowTimeSeconds / 10)}/>
			<ClockWheel limit={10} value={now.getSeconds() % 10} valueKey={nowTimeSeconds}/>
		</div>
	)
}

const ClockWheelSeparator = React.memo(() => {
	return (
		<div className={css.clockWheelSeparator}>
			{generateFaces(0, i => i === 0 ? ":" : null)}
		</div>
	)
})

const generateFaces = (keyBase: number, getValue: (i: number) => ReactNode): ReactNode[] => {
	const faces: ReactNode[] = []
	for(let i = -EXTRA_VALUES_DISPLAYED_PER_SIDE - 1; i <= EXTRA_VALUES_DISPLAYED_PER_SIDE + 1; i++){
		const {offset, apparency, faceDirection} = FACE_DESCRIPTIONS[i + EXTRA_VALUES_DISPLAYED_PER_SIDE + 1]!
		const style: Record<string, string> = {
			"--apparency": apparency + "",
			"--offset": (TOTAL_WHEEL_HEIGHT_BLOCKS - offset) + "",
			"--face-direction": faceDirection + ""
		}
		const block = (
			<div className={css.clockWheelFace} key={keyBase + i} style={style}>
				<span>{getValue(i)}</span>
			</div>
		)
		faces.push(block)
	}
	return faces
}

const ClockWheel = React.memo(({value, limit, valueKey}: {value: number, limit: number, valueKey: number}) => {
	const faces = generateFaces(valueKey, i => (value + i + limit) % limit)
	return <div className={css.clockWheel}>{faces}</div>
})

const useRaf = (callback: () => void) => {
	const callbackRef = useRef(callback)
	callbackRef.current = callback

	useEffect(() => {
		let stopped = false
		const run = () => {
			callbackRef.current()
			if(!stopped){
				return requestAnimationFrame(run)
			}
			return null
		}
		const handle = run()
		return () => {
			stopped = true
			if(handle !== null){
				cancelAnimationFrame(handle)
			}
		}
	}, [])
}

const useElementDimensions = (element: HTMLElement): Readonly<{width: number, height: number}> => {
	const [size, setSize] = useState({width: element.clientWidth, height: element.clientHeight})

	useEffect(() => {
		const observer = new ResizeObserver(() => {
			const newSize = {width: element.clientWidth, height: element.clientHeight}
			setSize(oldSize => oldSize.width !== newSize.width || oldSize.height !== newSize.height ? newSize : oldSize)
		})
		observer.observe(element)
		return () => {
			observer.unobserve(element)
			observer.disconnect()
		}
	}, [element])

	return size
}