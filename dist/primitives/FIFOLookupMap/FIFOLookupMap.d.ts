import { IData } from "./interfaces/IData.js";
declare class FIFOLookupMap {
    maxSize: number;
    primaryKey: string;
    map: Map<string, IData>;
    keys: Map<string, string>;
    order: Set<string>;
    constructor(maxSize: number, primaryKey?: string, data?: IData[]);
    static fromJSON(json: {
        maxSize: number;
        primaryKey: string;
        data: IData[];
    }): FIFOLookupMap;
    toJSON(): {
        maxSize: number;
        primaryKey: string;
        data: IData[];
    };
    get(keyName: string, value: any): IData | undefined;
    add(data: IData): void;
    getLast(propertyName: string, value?: any): IData | null;
    remove(primaryKeyValue: string): void;
}
export default FIFOLookupMap;
//# sourceMappingURL=FIFOLookupMap.d.ts.map