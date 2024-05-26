declare class Queue<T> {
    private items;
    constructor();
    enqueue(item: T): void;
    dequeue(item?: T | null | undefined): T | null;
    toArray(): T[];
    peek(): T | null;
    isEmpty(): boolean;
    size(): number;
    clear(): void;
}
export default Queue;
//# sourceMappingURL=Queue.d.ts.map