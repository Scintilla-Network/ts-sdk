import { decodeVarInt, encodeVarInt } from "../../utils/varint.js";
class HashProofHeader {
    constructor(options = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.timestamp = (_a = options.timestamp) !== null && _a !== void 0 ? _a : Date.now();
        this.height = (_b = options.height) !== null && _b !== void 0 ? _b : 0;
        this.previousHash = (_c = options.previousHash) !== null && _c !== void 0 ? _c : null;
        this.module = (_d = options.module) !== null && _d !== void 0 ? _d : '';
        this.proposer = (_e = options.proposer) !== null && _e !== void 0 ? _e : null;
        this.merkleRoot = (_f = options.merkleRoot) !== null && _f !== void 0 ? _f : null;
        this.nonce = (_g = options.nonce) !== null && _g !== void 0 ? _g : 0;
        this.difficulty = (_h = options.difficulty) !== null && _h !== void 0 ? _h : BigInt(0); // Ensure a default is provided
    }
    toBuffer() {
        var _a, _b;
        const heightBuffer = Buffer.alloc(4);
        heightBuffer.writeInt32BE(this.height);
        const timestampBuffer = Buffer.alloc(8);
        timestampBuffer.writeBigInt64BE(BigInt(this.timestamp));
        const previousHashBuffer = this.previousHash ? Buffer.from(this.previousHash, 'hex') : Buffer.alloc(32);
        const varIntModule = encodeVarInt(this.module.length);
        const moduleBuffer = Buffer.from(this.module, 'utf8');
        const varIntProposer = encodeVarInt((_b = (_a = this.proposer) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0);
        const proposerBuffer = this.proposer ? Buffer.from(this.proposer, 'utf8') : Buffer.alloc(0);
        const merkleRootBuffer = this.merkleRoot ? Buffer.from(this.merkleRoot, 'hex') : Buffer.alloc(32);
        const nonceBuffer = Buffer.alloc(8);
        nonceBuffer.writeInt32BE(this.nonce);
        const difficultyBuffer = Buffer.alloc(8);
        difficultyBuffer.writeBigInt64BE(BigInt(this.difficulty));
        // Concatenate all buffers to form the complete header buffer
        return Buffer.concat([heightBuffer, timestampBuffer, previousHashBuffer, varIntModule, moduleBuffer, varIntProposer, proposerBuffer, merkleRootBuffer, nonceBuffer, difficultyBuffer]);
    }
    toHash() {
        return this.toBuffer().toString('hex');
    }
    toJSON() {
        return {
            timestamp: this.timestamp.toString(),
            height: this.height,
            previousHash: this.previousHash,
            module: this.module,
            proposer: this.proposer,
            merkleRoot: this.merkleRoot,
            nonce: this.nonce.toString(),
            difficulty: this.difficulty.toString()
        };
    }
    static fromBuffer(buffer) {
        let offset = 0;
        const height = buffer.readInt32BE(offset);
        offset += 4;
        const timestamp = buffer.readBigInt64BE(offset);
        offset += 8;
        const previousHash = buffer.toString('hex', offset, offset + 32);
        offset += 32;
        const { value: moduleLength, length: varIntModuleLength } = decodeVarInt(buffer.subarray(offset));
        offset += varIntModuleLength;
        const module = buffer.toString('utf8', offset, offset + Number(moduleLength));
        offset += Number(moduleLength);
        const { value: proposerLength, length: varIntProposerLength } = decodeVarInt(buffer.subarray(offset));
        offset += varIntProposerLength;
        const proposer = buffer.toString('utf8', offset, offset + Number(proposerLength));
        offset += Number(proposerLength);
        const merkleRoot = buffer.toString('hex', offset, offset + 32);
        offset += 32;
        const nonce = buffer.readInt32BE(offset);
        offset += 4;
        const difficulty = buffer.readBigInt64BE(offset);
        // offset += 8; // Uncomment if more fields are read after this
        const blockHeader = new HashProofHeader({
            height: Number(height),
            timestamp: Number(timestamp),
            previousHash: previousHash === Buffer.alloc(32).toString('hex') ? null : previousHash,
            module,
            proposer: proposer === Buffer.alloc(0).toString('utf8') ? null : proposer,
            merkleRoot: merkleRoot === Buffer.alloc(32).toString('hex') ? null : merkleRoot,
            nonce: Number(nonce),
            difficulty: BigInt(difficulty)
        });
        return blockHeader;
    }
}
export default HashProofHeader;
//# sourceMappingURL=HashProofHeader.js.map