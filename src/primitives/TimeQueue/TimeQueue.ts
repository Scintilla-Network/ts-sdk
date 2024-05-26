import { ITimeQueueItem } from "./interfaces/ITimeQueueItem.js";

export default class TimeQueue {
    private queue: Map<number, ITimeQueueItem[]>;

    constructor() {
        this.queue = new Map<number, ITimeQueueItem[]>();
    }

    static fromJSON(json: string): TimeQueue {
        const queue = new TimeQueue();
        const entries: [number, ITimeQueueItem[]][] = JSON.parse(json);
        for (const [timestamp, items] of entries) {
            for (const item of items) {
                queue.enqueue(timestamp, item);
            }
        }
        return queue;
    }

    enqueue(timestamp: number, item: ITimeQueueItem): void {
        if (!this.queue.has(timestamp)) {
            this.queue.set(timestamp, []);
        }
        this.queue.get(timestamp)?.push(item);
    }

    dequeue(upToTimestamp: number): ITimeQueueItem[] {
        const keysToRemove = [...this.queue.keys()].filter(key => key <= upToTimestamp);
        const dequeuedItems: ITimeQueueItem[] = [];

        for (const key of keysToRemove) {
            const items = this.queue.get(key) || [];
            dequeuedItems.push(...items);
            this.queue.delete(key);
        }

        return dequeuedItems;
    }

    peekNextTimestamp(): number | null {
        if (this.queue.size === 0) {
            return null;
        }
        const nextTimestamp = Math.min(...this.queue.keys());
        return nextTimestamp;
    }

    isEmpty(): boolean {
        return this.queue.size === 0;
    }

    toJSON(): string {
        return JSON.stringify([...this.queue]);
    }
}
