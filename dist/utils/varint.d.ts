/// <reference types="node" />
export declare function encodeVarInt(num: number | bigint): Buffer;
export declare function decodeVarInt(buffer: Buffer): {
    value: number | bigint;
    length: number;
};
//# sourceMappingURL=varint.d.ts.map