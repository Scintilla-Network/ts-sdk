class Queue<T> {
    private items: T[];

    constructor() {
        this.items = [];
    }

    enqueue(item: T): void {
        this.items.push(item);
    }

    dequeue(item?: T | null | undefined): T | null {
        if (this.isEmpty()) {
            return null;
        }

        if(item) {
            // We can use the filter method to remove the item from the array
            this.items = this.items.filter((i) => i !== item);
            return item;
        } else {

            return this.items.shift() || null; // Ensures null is returned if shift() returns undefined
        }
    }

    toArray(): T[] {
        return this.items;
    }

    peek(): T | null {
        return this.items.length > 0 ? this.items[0] : null;
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }

    clear(): void {
        this.items = [];
    }
}

export default Queue;
