import {makeBottomBar} from "sketches/zen_blockbreaker/bottom_bar"
import {ZenBlockbreaker} from "sketches/zen_blockbreaker/zen_blockbreaker_impl"

const blockColors = [0x000000, 0x53bc01, 0xffeb03, 0xffa801, 0xf93a1d, 0xe21a5f, 0x572c62, 0xa1ccd3, 0x006898]

export function main(container: HTMLElement): void {
	const initialTicksPerFrame = 3
	const speedMult = 0.5 / initialTicksPerFrame
	const sideCount = 4

	const wrap = document.createElement("div")
	wrap.style.cssText = "width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-between"
	container.appendChild(wrap)

	const bottomBar = makeBottomBar({
		initialSpeed: initialTicksPerFrame,
		colors: blockColors,
		onSpeedChange: speed => blockbreaker.setTicksPerFrame(speed)
	})
	bottomBar.onStatsUpdate(new Map(new Array(sideCount).fill(null).map((_, i) => [i + 1, 0])))
	wrap.appendChild(bottomBar.root)

	const rect = container.getBoundingClientRect()
	const bottomBarHeight = bottomBar.root.getBoundingClientRect().height
	const width = rect.width
	const height = rect.height - bottomBarHeight
	const screenSpacePx = width * height
	const blockSizePx = Math.floor(Math.sqrt(screenSpacePx) / 25)

	const blockbreaker: ZenBlockbreaker = new ZenBlockbreaker({
		ticksPerFrame: initialTicksPerFrame,
		ballSpeed: speedMult * ((height + width) / blockSizePx),
		// TODO: think about something more interesting here. fill the whole screen with the board..?
		// also block size may be related to DPI
		blockSizePx,
		height: Math.floor(height / blockSizePx),
		width: Math.floor(width / blockSizePx),
		sideCount,
		onStatsChange: () => bottomBar.onStatsUpdate(blockbreaker.stats),
		colors: blockColors,
		render: "svg"
	})

	bottomBar.root.before(blockbreaker.root)
	bottomBar.onStatsUpdate(blockbreaker.stats)

	blockbreaker.run()
}
