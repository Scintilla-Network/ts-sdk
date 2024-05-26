import { Buffer } from 'buffer';
import { decodeVarInt, encodeVarInt } from "../../utils/varint.js";
import { sha256 } from "../../utils/hash.js";
export class ModuleBlockHeader {
    constructor(options = {}) {
        this.timestamp = options.timestamp ?? Date.now();
        this.height = options.height ?? 0;
        this.previousHash = options.previousHash ?? null;
        this.proposer = options.proposer ?? null;
        this.module = options.module ?? '';
    }
    toBuffer() {
        const heightBuffer = Buffer.alloc(4);
        heightBuffer.writeInt32BE(this.height);
        const timestampBuffer = Buffer.alloc(8);
        timestampBuffer.writeBigInt64BE(BigInt(this.timestamp));
        const previousHashBuffer = this.previousHash ? Buffer.from(this.previousHash, 'hex') : Buffer.alloc(32);
        const varIntModuleLength = encodeVarInt(this.module.length);
        const moduleBuffer = Buffer.from(this.module, 'utf8');
        const varIntProposerLength = this.proposer ? encodeVarInt(this.proposer.length) : Buffer.alloc(0);
        const proposerBuffer = this.proposer ? Buffer.from(this.proposer, 'utf8') : Buffer.alloc(0);
        return Buffer.concat([
            heightBuffer,
            timestampBuffer,
            previousHashBuffer,
            varIntModuleLength,
            moduleBuffer,
            varIntProposerLength,
            proposerBuffer
        ]);
    }
    toHash() {
        return sha256(this.toBuffer()).toString('hex');
    }
    static fromBuffer(buffer) {
        let offset = 0;
        const height = buffer.readInt32BE(offset);
        offset += 4;
        const timestamp = buffer.readBigInt64BE(offset);
        offset += 8;
        const previousHash = buffer.slice(offset, offset + 32).toString('hex');
        offset += 32;
        const { value: moduleLength, length: varIntModuleLength } = decodeVarInt(buffer.slice(offset));
        offset += varIntModuleLength;
        const module = buffer.slice(offset, offset + Number(moduleLength)).toString('utf8');
        offset += Number(moduleLength);
        const { value: proposerLength, length: varIntProposerLength } = decodeVarInt(buffer.slice(offset));
        offset += varIntProposerLength;
        const proposer = buffer.slice(offset, offset + Number(proposerLength)).toString('utf8');
        return new ModuleBlockHeader({
            height,
            timestamp: Number(timestamp),
            previousHash,
            module,
            proposer
        });
    }
    toJSON() {
        return {
            timestamp: this.timestamp.toString(),
            height: this.height,
            previousHash: this.previousHash,
            proposer: this.proposer,
            module: this.module,
        };
    }
}
//# sourceMappingURL=ModuleBlockHeader.js.map