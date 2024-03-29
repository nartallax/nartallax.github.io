interface Node<T> {
	prev?: Node<T>
	value: T
}

export class Queue<T> {

	private len = 0
	private headNode?: Node<T>
	private tailNode?: Node<T>

	get length(): number {
		return this.len
	}

	get head(): T | undefined {
		return this.headNode?.value
	}

	get tail(): T | undefined {
		return this.tailNode?.value
	}

	enqueue(value: T): void {
		if(this.headNode && this.tailNode){
			const oldTail = this.tailNode
			this.tailNode = {value}
			oldTail.prev = this.tailNode
		} else {
			this.headNode = this.tailNode = {value}
		}
		this.len++
	}

	dequeue(): T {
		if(!this.headNode){
			throw new Error("Queue empty, cannot dequeue.")
		}
		const result = this.headNode.value
		this.headNode = this.headNode.prev
		this.len--
		return result
	}

	maybeDequeue(): T | undefined {
		if(!this.headNode){
			return undefined
		}
		const result = this.headNode.value
		this.headNode = this.headNode.prev
		this.len--
		return result
	}

	clear(): void {
		this.len = 0
		this.headNode = this.tailNode = undefined
	}

	toArrayHeadFirst(): T[] {
		const result: T[] = new Array(this.len)
		let node = this.headNode
		let i = 0
		while(node){
			result[i++] = node.value
			node = node.prev
		}
		return result
	}

}