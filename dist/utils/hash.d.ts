/// <reference types="node" />
type Bufferizable = Buffer | ArrayBuffer | Uint8Array | string;
/**
 * Simplifies input to Uint8Array and computes SHA-256 hash.
 * @param bufferizable A value that can be converted into a buffer.
 * @returns A Buffer containing the SHA-256 hash of the input.
 */
export declare function sha256(bufferizable: Bufferizable): Buffer;
export {};
//# sourceMappingURL=hash.d.ts.map