import { sha256 } from "../../utils/hash.js";
import { encodeVarInt, decodeVarInt } from "../../utils/varint.js";
import { IDriveDataOptions } from "./interfaces/IDriveDataOptions.js";

class DriveData {
    type: string;
    content: string;

    constructor(options: IDriveDataOptions = {}) {
        this.type = options.type || 'text';
        this.content = options.content || '';
    }

    toJSON(): { type: string; content: string } {
        return {
            type: this.type,
            content: this.content,
        };
    }

    toBuffer(): Buffer {
        const varIntType = encodeVarInt(this.type.length);
        let typeBuffer = Buffer.alloc(0);
        if (this.type) {
            typeBuffer = Buffer.from(this.type, 'utf8');
        }

        const varIntContent = encodeVarInt(this.content.length);
        let contentBuffer = Buffer.alloc(0);
        if (this.content) {
            contentBuffer = Buffer.from(this.content, 'utf8');
        }

        return Buffer.concat([varIntType, typeBuffer, varIntContent, contentBuffer]);
    }

    toHash(encoding: BufferEncoding = 'hex'): string {
        const buffer = this.toBuffer();
        return sha256(buffer).toString(encoding);
    }

    static fromHex(hex: string): DriveData {
        const buffer = Buffer.from(hex, 'hex');
        return this.fromBuffer(buffer);
    }

    static fromBuffer(buffer: Buffer): DriveData {
        try {
            const { value: _typeLength, length: _varIntTypeLength } = decodeVarInt(buffer);
            const typeLength = Number(_typeLength);
            const varIntTypeLength = _varIntTypeLength;
            const type = buffer.subarray(varIntTypeLength, varIntTypeLength + Number(typeLength)).toString('utf8');

            const { value: _contentLength, length: varIntContentLength } = decodeVarInt(buffer.subarray(varIntTypeLength + typeLength));
            // This assumes that we don't handle DriveData buffer highest than 2^53 - 1 bytes, else we should use BigInt
            const contentLength = Number(_contentLength);
            const content = buffer.subarray(varIntTypeLength + typeLength + varIntContentLength, varIntTypeLength + typeLength + varIntContentLength + contentLength).toString('utf8');

            return new DriveData({
                type,
                content,
            });
        } catch (e) {
            console.error(e);
            return new DriveData(); // Return a default instance in case of error
        }
    }

    toHex(): string {
        return this.toBuffer().toString('hex');
    }

    toString(): string {
        return this.toHex();
    }

    static fromJSON(json: IDriveDataOptions): DriveData {
        return new DriveData(json);
    }
}

export default DriveData;
