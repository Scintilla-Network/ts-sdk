import { hash as stablelibHash } from '@stablelib/sha256';

type Bufferizable = Buffer | ArrayBuffer | Uint8Array | string;

/**
 * Simplifies input to Uint8Array and computes SHA-256 hash.
 * @param bufferizable A value that can be converted into a buffer.
 * @returns A Buffer containing the SHA-256 hash of the input.
 */
export function sha256(bufferizable: Bufferizable): Buffer {
    let inputAsUint8Array: Uint8Array;

    if (bufferizable instanceof Uint8Array) {
        inputAsUint8Array = bufferizable;
    } else if (typeof bufferizable === 'string') {
        inputAsUint8Array = new Uint8Array(Buffer.from(bufferizable, 'utf8'));
    } else if (bufferizable instanceof ArrayBuffer) {
        inputAsUint8Array = new Uint8Array(bufferizable);
    } else if (Buffer.isBuffer(bufferizable)) {
        inputAsUint8Array = new Uint8Array(bufferizable);
    } else {
        throw new TypeError('Unsupported input type for hashing');
    }

    return Buffer.from(stablelibHash(inputAsUint8Array));
}
