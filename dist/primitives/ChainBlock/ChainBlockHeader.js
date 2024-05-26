import { Buffer } from 'buffer';
import { decodeVarInt, encodeVarInt } from "../../utils/varint.js";
import { sha256 } from "../../utils/hash.js";
export class ChainBlockHeader {
    constructor(options = {}) {
        var _a, _b, _c, _d;
        this.timestamp = (_a = options.timestamp) !== null && _a !== void 0 ? _a : new Date();
        this.height = (_b = options.height) !== null && _b !== void 0 ? _b : 0;
        this.previousHash = (_c = options.previousHash) !== null && _c !== void 0 ? _c : null;
        this.proposer = (_d = options.proposer) !== null && _d !== void 0 ? _d : null;
    }
    toBuffer() {
        const heightBuffer = Buffer.alloc(4);
        heightBuffer.writeInt32BE(this.height);
        const timestampBuffer = Buffer.alloc(8);
        timestampBuffer.writeBigInt64BE(BigInt(this.timestamp.getTime()));
        const previousHashBuffer = this.previousHash ? Buffer.from(this.previousHash, 'hex') : Buffer.alloc(32);
        const proposerBuffer = this.proposer ? Buffer.from(this.proposer, 'utf8') : Buffer.alloc(0);
        const proposerLengthBuffer = encodeVarInt(proposerBuffer.length);
        return Buffer.concat([
            heightBuffer,
            timestampBuffer,
            previousHashBuffer,
            proposerLengthBuffer,
            proposerBuffer
        ]);
    }
    toHash() {
        const buffer = this.toBuffer();
        const hash = sha256(buffer);
        return hash.toString('hex');
    }
    static fromBuffer(buffer) {
        let offset = 0;
        const height = buffer.readInt32BE(offset);
        offset += 4;
        const timestamp = buffer.readBigInt64BE(offset);
        offset += 8;
        const previousHashEnd = offset + 32;
        const previousHash = buffer.slice(offset, previousHashEnd).toString('hex');
        offset = previousHashEnd;
        const { value: proposerLength, length: varIntLength } = decodeVarInt(buffer.slice(offset));
        offset += varIntLength;
        // Use type assertion to treat proposerLength as number if you're sure it won't exceed number range
        const proposerEnd = offset + Number(proposerLength);
        const proposer = buffer.slice(offset, proposerEnd).toString('utf8');
        return new ChainBlockHeader({
            timestamp: new Date(Number(timestamp)),
            height,
            previousHash: previousHash.length > 0 ? previousHash : null,
            proposer: proposer.length > 0 ? proposer : null,
        });
    }
    toJSON() {
        return {
            timestamp: this.timestamp,
            height: this.height,
            previousHash: this.previousHash,
            proposer: this.proposer,
        };
    }
}
export default ChainBlockHeader;
//# sourceMappingURL=ChainBlockHeader.js.map