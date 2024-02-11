import {getBinder} from "common/binder/binder"
import {box} from "common/box"
import {makeBottomBar} from "sketches/zen_blockbreaker/bottom_bar"
import {ZenBlockbreaker} from "sketches/zen_blockbreaker/zen_blockbreaker_impl"

const blockColors = [0x000000, 0x53bc01, 0xffeb03, 0xffa801, 0xf93a1d, 0xe21a5f, 0x572c62, 0xa1ccd3, 0x006898]

export function main(rootContainer: HTMLElement): void {
	const initialTicksPerFrame = 3
	const speedMult = 0.5 / initialTicksPerFrame
	const sideCount = 4

	const speed = box(initialTicksPerFrame)
	getBinder(rootContainer).watch(speed, speed => blockbreaker.setTicksPerFrame(speed))

	const stats = new Array(sideCount).fill(null).map(() => box(0))
	const contentContainer = makeBottomBar({
		speed,
		colors: blockColors,
		stats,
		root: rootContainer
	})

	const rect = contentContainer.getBoundingClientRect()
	const screenSpacePx = rect.width * rect.height
	const blockSizePx = Math.floor(Math.sqrt(screenSpacePx) / 25)

	const blockbreaker: ZenBlockbreaker = new ZenBlockbreaker({
		ticksPerFrame: initialTicksPerFrame,
		ballSpeed: speedMult * ((rect.height + rect.width) / blockSizePx),
		// TODO: think about something more interesting here. fill the whole screen with the board..?
		// also block size may be related to DPI
		blockSizePx,
		height: Math.floor(rect.height / blockSizePx),
		width: Math.floor(rect.width / blockSizePx),
		sideCount,
		onStatsChange: () => {
			for(const [color, stat] of blockbreaker.stats){
				stats[color - 1]!(stat)
			}
		},
		colors: blockColors,
		render: "svg",
		tailLength: 1 * initialTicksPerFrame
	})
	contentContainer.appendChild(blockbreaker.root)

	blockbreaker.run()
}
