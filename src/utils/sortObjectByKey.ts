export type Sortable = { [key: string]: any } | any[];

export default function sortObjectByKey(obj: any): any {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(sortObjectByKey);
    }
    const sortedKeys = Object.keys(obj).sort();
    const result: Sortable = {};
    sortedKeys.forEach((key) => {
        result[key] = sortObjectByKey(obj[key]);
    });
    return result;
}
