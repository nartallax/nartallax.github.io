interface Block {
	parent: Block | null
	subblocks: Record<string, Block>
	timeStart: number
	timeSum: number
	enterCount: number
}

interface BlockToPrint {
	"ms per enter": number
	"full %": number
	"parent %": number
}

class Perfometer {

	private root: Block = this.makeBlock(null)
	private currentBlock: Block = this.root

	private makeBlock(parent: Block | null): Block {
		return {
			subblocks: {}, parent: parent,
			timeStart: -1, timeSum: 0,
			enterCount: 0
		}
	}

	enterBlock(name: string): void {
		let nextBlock = this.currentBlock.subblocks[name]
		if(!nextBlock){
			nextBlock = this.makeBlock(this.currentBlock)
			this.currentBlock.subblocks[name] = nextBlock
		}
		nextBlock.timeStart = performance.now()
		nextBlock.enterCount++
		this.currentBlock = nextBlock
	}

	exitBlock(): void {
		this.currentBlock.timeSum += performance.now() - this.currentBlock.timeStart
		const parent = this.currentBlock.parent
		if(!parent){
			throw new Error("No parent! Blocks are all messed up.")
		}
		this.currentBlock = parent
	}

	exitEnterBlock(name: string): void {
		this.exitBlock()
		this.enterBlock(name)
	}

	print(): void {
		const table: Record<string, BlockToPrint> = {}
		let fullTime = 0
		for(const name in this.root.subblocks){
			fullTime += this.root.subblocks[name]!.timeSum
		}

		this.forEachBlock((block, name, depth) => {
			name = new Array(depth + 1).join("-") + name
			table[name] = {
				"parent %": strip((block.timeSum / block.parent!.timeSum) * 100),
				"full %": strip((block.timeSum / fullTime) * 100),
				"ms per enter": strip(block.timeSum / block.enterCount)
			}
		})

		console.table(table)
	}

	reset(): void {
		this.root = this.makeBlock(null)
		this.currentBlock = this.root
	}

	private forEachBlock(callback: (block: Block, name: string, depth: number) => void, start: Block = this.root, currentDepth = 0): void {
		for(const name in start.subblocks){
			const subblock = start.subblocks[name]!
			callback(subblock, name, currentDepth)
			this.forEachBlock(callback, subblock, currentDepth + 1)
		}
	}

}

export const performeter = new Perfometer()

function strip(v: number): number {
	return Math.round(v * 100) / 100
}