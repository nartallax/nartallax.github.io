import {tag} from "@nartallax/cardboard-dom"

const testKey = "test_value_key"

export const main = (root: HTMLElement) => {
	const db = new KVIndexedDbWrapper<string>("test_db_name")

	const localStorageInput = tag({
		tag: "input", attrs: {
			placeholder: "Local storage value",
			type: "text",
			value: localStorage[testKey] ?? ""
		}
	})
	const dbInput = tag({
		tag: "input", attrs: {
			placeholder: "indexeddb value",
			type: "text"
		}
	})

	root.appendChild(localStorageInput)
	root.appendChild(dbInput)

	void(async() => {
		dbInput.value = await db.get(testKey) ?? ""
	})()

	const onLocalStorageChange = () => {
		localStorage[testKey] = localStorageInput.value
	}
	const onIDBChange = () => {
		void db.set(testKey, dbInput.value)
	}

	for(const [input, onChange] of [[localStorageInput, onLocalStorageChange], [dbInput, onIDBChange]] as const){
		input.addEventListener("keydown", onChange)
		input.addEventListener("change", onChange)
		input.addEventListener("paste", onChange)
	}
}

/** Wrapper around IndexedDB which makes it work as key-value storage
IndexedDB API is convoluted, and it's nice to reduce it to a few simple operations */
class KVIndexedDbWrapper<T> {
	constructor(readonly dbName: string) {}
	private readonly dbVersion = 1
	private readonly storeName = "default_store"

	private migrate(db: IDBDatabase): Promise<void> {
		const store = db.createObjectStore(this.storeName)
		return new Promise((resolve, reject) => {
			store.transaction.onerror = e => reject(e)
			store.transaction.oncomplete = () => resolve()
		})
	}

	private async getDb(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const req = window.indexedDB.open(this.dbName, this.dbVersion)
			req.onerror = e => {
				reject(e)
			}
			req.onsuccess = e => {
				resolve((e.target as any).result)
			}
			req.onupgradeneeded = async e => {
				const db = (e.target as any).result as IDBDatabase
				await this.migrate(db)
				resolve(db)
			}
		})
	}

	private async inTransaction<R>(db: IDBDatabase, callback: (store: IDBObjectStore, transaction: IDBTransaction) => Promise<R>): Promise<R> {
		const transaction = db.transaction([this.storeName], "readwrite")
		const store = transaction.objectStore(this.storeName)
		let result: R | null = null
		let hasResult = false
		let hasComplete = false
		let resolveResult: ((value: R) => void) | null = null

		const resultPromise = new Promise<R>((resolve, reject) => {
			resolveResult = resolve
			transaction.oncomplete = () => {
				hasComplete = true
				if(hasResult){
					resolve(result as R)
				}
			}
			transaction.onerror = e => reject(e)
		})

		result = await callback(store, transaction)
		hasResult = true
		if(hasComplete){
			resolveResult!(result)
		}

		return resultPromise
	}

	private performPutRequest(store: IDBObjectStore, key: string, value: T): Promise<void> {
		// put = upsert
		const request = store.put(value, key)
		return new Promise((resolve, reject) => {
			request.onerror = e => reject(e)
			request.onsuccess = () => resolve()
		})
	}

	private performGetRequest(store: IDBObjectStore, key: string): Promise<T> {
		const request = store.get(key)
		return new Promise((resolve, reject) => {
			request.onerror = e => reject(e)
			request.onsuccess = e => resolve((e.target as any).result)
		})
	}

	private performDeleteRequest(store: IDBObjectStore, key: string): Promise<void> {
		const request = store.delete(key)
		return new Promise((resolve, reject) => {
			request.onerror = e => reject(e)
			request.onsuccess = () => resolve
		})
	}

	async get(key: string): Promise<T | undefined> {
		const db = await this.getDb()
		return await this.inTransaction(db, async store => {
			return await this.performGetRequest(store, key)
		})
	}

	async set(key: string, value: T): Promise<void> {
		const db = await this.getDb()
		await this.inTransaction(db, async store => {
			await this.performPutRequest(store, key, value)
		})
	}

	async delete(key: string): Promise<void> {
		const db = await this.getDb()
		await this.inTransaction(db, async store => {
			await this.performDeleteRequest(store, key)
		})
	}
}