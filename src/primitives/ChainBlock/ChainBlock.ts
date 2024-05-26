import { Buffer } from 'buffer';
import { ChainBlockHeader } from './ChainBlockHeader.js'; // Adjust import path as needed
import {ChainBlockPayload} from "./ChainBlockPayload.js"; // Ensure correct path for sha256 import
import { IChainBlockOptions } from './interfaces/IChainBlockOptions.js';
import {sha256} from "../../utils/hash.js";

export class ChainBlock {
    header: ChainBlockHeader;
    payload: ChainBlockPayload;

    constructor(options: IChainBlockOptions = {}) {
        this.header = new ChainBlockHeader(options.header);
        this.payload = new ChainBlockPayload(options.data);
    }

    consider(element: any): void {
        // Your consider logic here
        // Example: this.data.consider(element);
        if (!element) {
            console.error('ChainBlock tried to consider an undefined element.');
            return;
        }
        this.payload.consider(element);
    }

    toBuffer(): Buffer {
        const headerBuffer = this.header.toBuffer();
        const dataBuffer = this.payload.toBuffer();

        const headerLengthBuffer = Buffer.alloc(4);
        headerLengthBuffer.writeInt32BE(headerBuffer.length, 0);

        const dataLengthBuffer = Buffer.alloc(4);
        dataLengthBuffer.writeInt32BE(dataBuffer.length, 0);

        return Buffer.concat([headerLengthBuffer, headerBuffer, dataLengthBuffer, dataBuffer]);
    }

    toHex(): string {
        return this.toBuffer().toString('hex');
    }

    static fromBuffer(buffer: Buffer): ChainBlock {
        let offset = 0;

        const headerLength = buffer.readInt32BE(offset);
        offset += 4;
        const headerBuffer = buffer.slice(offset, offset + headerLength);
        const header = ChainBlockHeader.fromBuffer(headerBuffer);
        offset += headerLength;

        const dataLength = buffer.readInt32BE(offset);
        offset += 4;
        const dataBuffer = buffer.slice(offset, offset + dataLength);
        const data = ChainBlockPayload.fromBuffer(dataBuffer);

        return new ChainBlock({
            header: header.toJSON(),
            data: data.toJSON(),
        });
    }

    static fromHex(hex: string): ChainBlock {
        const buffer = Buffer.from(hex, 'hex');
        return ChainBlock.fromBuffer(buffer);
    }

    toHash(encoding: 'buffer' | 'hex' = 'buffer'): string | Buffer {
        const buffer = this.toBuffer();
        const hash = sha256(buffer);
        if (encoding === 'buffer') {
            return hash;
        } else {
            return hash.toString(encoding);
        }
    }

    toJSON(): object {
        return {
            header: this.header.toJSON(),
            data: this.payload.toJSON(),
        };
    }
}

export default ChainBlock;
