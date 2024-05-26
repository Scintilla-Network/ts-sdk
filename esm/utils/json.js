export function sortObjectByKey(obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(sortObjectByKey);
    }
    const sortedKeys = Object.keys(obj).sort();
    const result = {};
    sortedKeys.forEach((key) => {
        result[key] = sortObjectByKey(obj[key]);
    });
    return result;
}
export function sortedJsonByKeyStringify(obj) {
    return JSON.stringify(sortObjectByKey(obj));
}
//# sourceMappingURL=json.js.map