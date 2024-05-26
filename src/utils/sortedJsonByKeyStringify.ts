import sortObjectByKey from "./sortObjectByKey.js";

export default function sortedJsonByKeyStringify(obj: any): string {
    return JSON.stringify(sortObjectByKey(obj));
}
