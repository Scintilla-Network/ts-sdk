class FIFOLookupMap {
    constructor(maxSize, primaryKey = "key", data = []) {
        this.maxSize = maxSize;
        this.primaryKey = primaryKey;
        this.map = new Map(); // Stores the data
        this.keys = new Map(); // Maps each key to its corresponding data key in the map
        this.order = new Set(); // Keeps track of the order data was added for FIFO management, ensuring uniqueness
        data.forEach((dataItem) => {
            this.add(dataItem);
        });
    }
    static fromJSON(json) {
        const map = new FIFOLookupMap(json.maxSize, json.primaryKey);
        json.data.forEach((dataItem) => {
            map.add(dataItem);
        });
        return map;
    }
    toJSON() {
        return {
            maxSize: this.maxSize,
            primaryKey: this.primaryKey,
            data: Array.from(this.map.values())
        };
    }
    get(keyName, value) {
        const dataKey = this.keys.get(`${keyName}:${value}`);
        return this.map.get(dataKey);
    }
    add(data) {
        if (!data.hasOwnProperty(this.primaryKey)) {
            throw new Error(`Data must include the primary key: ${this.primaryKey}`);
        }
        const primaryKeyValue = data[this.primaryKey];
        const dataKey = `data:${primaryKeyValue}`;
        if (this.order.has(primaryKeyValue)) {
            return;
        }
        Object.keys(data).forEach(index => {
            const keyValue = `${index}:${data[index]}`;
            this.keys.set(keyValue, dataKey);
        });
        this.map.set(dataKey, data);
        this.order.add(primaryKeyValue);
        if (this.order.size > this.maxSize) {
            const oldestKey = this.order.values().next().value;
            this.remove(oldestKey);
        }
    }
    getLast(propertyName, value) {
        const reversedOrder = [...this.order].reverse();
        for (const key of reversedOrder) {
            const item = this.map.get(`data:${key}`);
            if (item && item.hasOwnProperty(propertyName) && (value === undefined || item[propertyName] === value)) {
                return item;
            }
        }
        return null;
    }
    remove(primaryKeyValue) {
        const dataKey = `data:${primaryKeyValue}`;
        const dataToRemove = this.map.get(dataKey);
        if (dataToRemove) {
            Object.keys(dataToRemove).forEach(index => {
                this.keys.delete(`${index}:${dataToRemove[index]}`);
            });
        }
        this.map.delete(dataKey);
        this.order.delete(primaryKeyValue);
    }
}
export default FIFOLookupMap;
//# sourceMappingURL=FIFOLookupMap.js.map