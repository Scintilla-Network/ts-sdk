import { Buffer } from 'buffer';
import { decodeVarInt, encodeVarInt } from "../../utils/varint.js";
import { sha256 } from "../../utils/hash.js";
export class ModuleBlockHeader {
    constructor(options = {}) {
        var _a, _b, _c, _d, _e;
        this.timestamp = (_a = options.timestamp) !== null && _a !== void 0 ? _a : Date.now();
        this.height = (_b = options.height) !== null && _b !== void 0 ? _b : 0;
        this.previousHash = (_c = options.previousHash) !== null && _c !== void 0 ? _c : null;
        this.proposer = (_d = options.proposer) !== null && _d !== void 0 ? _d : null;
        this.module = (_e = options.module) !== null && _e !== void 0 ? _e : '';
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