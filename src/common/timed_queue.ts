import {Queue} from "common/queue"

/** A queue that also stores time with items.
 * Is useful when you need to store only last x seconds of something */
export class TimedQueue<T> {
	private readonly items = new Queue<{time: number, item: T}>()

	enqueue(time: number, item: T): void {
		this.items.enqueue({time, item})
	}

	dropUntil(time: number): void {
		while(this.items.head && this.items.head.time < time){
			this.items.dequeue()
		}
	}

	/** Convert contents of the queue into array.
	 * Oldest elements go first. */
	toArray(): T[] {
		return this.items.toArrayHeadFirst().map(x => x.item)
	}

	get head(): T | undefined {
		return this.items.head?.item
	}

	get tail(): T | undefined {
		return this.items.tail?.item
	}
}