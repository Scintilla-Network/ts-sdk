import { Buffer } from 'buffer';
import { decodeVarInt, encodeVarInt } from "../../utils/varint.js";
import { sha256 } from "../../utils/hash.js";
export class ChainBlockPayload {
    constructor(options = {}) {
        this.data = options.data || [];
    }
    consider(element) {
        // Logic to consider a new element. Adjust according to your specific logic.
        if (!element) {
            console.error('BlockPayload tried to consider an undefined element.');
            return;
        }
        const { type, key, value } = element;
        if (!type || !key || !value) {
            console.error('BlockPayload tried to consider an element without type, key, or value.');
            return;
        }
        // Implement your specific logic for handling different types of elements here
        this.data.push({ type, key, value });
    }
    toBuffer() {
        // Serialize the payload data into a buffer
        const dataString = JSON.stringify(this.data);
        const dataBuffer = Buffer.from(dataString, 'utf-8');
        // Prepend the length of the data buffer as a varint
        const lengthBuffer = encodeVarInt(dataBuffer.length);
        return Buffer.concat([lengthBuffer, dataBuffer]);
    }
    toHash() {
        // Compute and return a hex string hash of the payload
        const buffer = this.toBuffer();
        const hash = sha256(buffer); // Adjust if your sha256 function signature/return type differs
        return hash.toString('hex');
    }
    static fromBuffer(buffer) {
        let offset = 0;
        const { value: dataLength, length: lengthBytes } = decodeVarInt(buffer.slice(offset));
        offset += lengthBytes;
        // Use type assertion to treat dataLength as number if you're sure it won't exceed number range
        const dataString = buffer.slice(offset, offset + Number(dataLength)).toString('utf-8');
        const data = JSON.parse(dataString);
        return new ChainBlockPayload({ data });
    }
    toJSON() {
        // Return a JSON representation of the payload data
        return this.data;
    }
}
export default ChainBlockPayload;
//# sourceMappingURL=ChainBlockPayload.js.map