import {Queue} from "common/queue"

/** A queue that also stores time with items.
 * Is useful when you need to store only last x seconds of something */
export class TimeQueue<T> {
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
}