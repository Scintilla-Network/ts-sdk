// src/messages/NetMessage.ts
import { Buffer } from 'buffer';
import { NET_KINDS } from "./NET_KINDS.js";
import { sha256 } from "../../../utils/hash.js";
import {INetMessageOptions} from "./interfaces/INetMessageOptions.js";
import {CHAIN_SCINTILLA_1_MAGIC} from "../../../CONSTANTS.js";
import {decodeVarInt, encodeVarInt} from "../../../utils/varint.js";

function estimateLength(payload: Buffer): number {
    // return payload ? payload.length + 4 + 4 + 12 : 0;
    return payload.length;
}

function _computeChecksum(payload: Buffer | null): Buffer {
    if (!payload) {
        return Buffer.alloc(4);
    }
    const hash = sha256(payload);
    return hash.subarray(0, 4);
}

export class NetMessage {
    static NET_KINDS = NET_KINDS;
    chain: Buffer;
    kind: keyof typeof NET_KINDS;
    module: string;
    payload: Buffer | null;
    length: number;

    constructor(props: INetMessageOptions = {}) {
        this.chain = props.chain || CHAIN_SCINTILLA_1_MAGIC;

        if (!(this.chain instanceof Buffer)) {
            throw new Error("Chain magic number must be a buffer");
        }

        this.kind = props.kind || 'UNKNOWN';

        if (!Object.keys(NET_KINDS).includes(this.kind)) {
            this.kind = 'UNKNOWN';
        }

        this.module = props.module || 'unknown';

        this.payload = null;
        this.length = 0;
        this.setPayload(props.payload || null);
    }

    setPayload(payload: Buffer | null): void {
        if (payload && !(payload instanceof Buffer)) {
            throw new Error("Payload must be a buffer");
        }
        this.payload = payload;
        this.length = estimateLength(this.payload || Buffer.alloc(0));
    }

    toHex(): string {
        return this.toBuffer().toString('hex');
    }

    static fromHex(hex: string): NetMessage {
        const buffer = Buffer.from(hex, 'hex');
        return NetMessage.fromBuffer(buffer);
    }

    toBuffer(): Buffer {
        const chainMagicNumberBuffer = this.chain;
        const kindValue = NET_KINDS[this.kind] || NET_KINDS.UNKNOWN;
        // No length check here, as the kind is always a single varint
        const kindBuffer = encodeVarInt(kindValue);

        const moduleValue = Buffer.from(this.module, 'utf8');
        const moduleLengthBuffer = encodeVarInt(moduleValue.length);

        const payloadBuffer = this.payload || Buffer.alloc(0);
        const checksumBuffer = _computeChecksum(payloadBuffer);
        const lengthBuffer = Buffer.alloc(4);

        lengthBuffer.writeInt32BE(this.length);

        const buffer = Buffer.concat([
            chainMagicNumberBuffer,
            kindBuffer,
            moduleLengthBuffer,
            moduleValue,
            checksumBuffer,
            lengthBuffer,
            payloadBuffer
        ]);

        return buffer;
    }

    static fromBuffer(buffer: Buffer): NetMessage {
        let offset: number = 0;
        const chainMagic = buffer.subarray(offset, offset + 4);
        offset += 4;
        const { value: kindValue, length: kindLength } = decodeVarInt(buffer.subarray(offset));
        offset += kindLength;

        const { value: moduleLengthValue, length: moduleOffsetLength } = decodeVarInt(buffer.subarray(offset));
        offset += moduleOffsetLength;

        const module = buffer.toString('utf8', offset, offset + Number(moduleLengthValue));
        offset += Number(moduleLengthValue);

        const checksumFromMessage = buffer.subarray(offset, offset + 4);
        offset += 4;
        const payloadLength = buffer.readInt32BE(offset);
        offset += 4;
        const payload = buffer.subarray(offset, offset + payloadLength);
        offset += payloadLength;

        const calculatedChecksum = _computeChecksum(payload);
        if (!calculatedChecksum.equals(checksumFromMessage)) {
            throw new Error("Checksum mismatch! The payload might have been tampered with.");
        }

        const kindString = Object.keys(NET_KINDS).find(key => NET_KINDS[key as keyof typeof NET_KINDS] === kindValue) || 'UNKNOWN';
        return new NetMessage({
            chain: chainMagic,
            kind: kindString as keyof typeof NET_KINDS,
            payload,
            module
        });
    }

    toHash(): string {
        return sha256(this.toBuffer()).toString('hex');
    }
}

export default NetMessage;
