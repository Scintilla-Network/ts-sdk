var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import HashProofHeader from "./HashProofHeader.js";
import HashProofPayload from "./HashProofPayload.js";
import { sha256 } from "../../utils/hash.js";
// @ts-ignore
import { Tree } from "@truestamp/tree";
import { decodeVarInt, encodeVarInt } from "../../utils/varint.js";
import getTargetHash from "../../utils/getTargetHash.js";
class HashProof {
    constructor(options = {}) {
        var _a;
        this.header = new HashProofHeader(options === null || options === void 0 ? void 0 : options.header);
        this.payload = new HashProofPayload((_a = options.payload) !== null && _a !== void 0 ? _a : { data: [] });
    }
    consider(element) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!element || !element.type) {
                console.error('HashProof tried to consider an undefined or invalid element.');
                return;
            }
            this.payload.consider(element);
            // const buffers = [this.payload.toBuffer()];
            // console.log('Generating merkle root', buffers);
            // this.header.merkleRoot = HashProof.generateMerkleRoot(buffers, 'hex').hash;
            this.header.merkleRoot = HashProof.generateMerkleRoot(this.payload.data, 'hex').hash;
        });
    }
    toBuffer() {
        const headerBuffer = this.header.toBuffer();
        const varintHeaderBuffer = encodeVarInt(headerBuffer.length);
        const payloadBuffer = this.payload.toBuffer();
        const varintPayloadBuffer = encodeVarInt(payloadBuffer.length);
        const buffer = Buffer.concat([varintHeaderBuffer, headerBuffer, varintPayloadBuffer, payloadBuffer]);
        return buffer;
    }
    toHex() {
        return this.toBuffer().toString('hex');
    }
    toHash(encoding = 'hex') {
        const buffer = this.toBuffer();
        return sha256(buffer).toString(encoding);
    }
    static fromHex(hex) {
        const buffer = Buffer.from(hex, 'hex');
        return this.fromBuffer(buffer);
    }
    static fromBuffer(buffer) {
        let offset = 0;
        const { length: headerLengthBytes, value: headerLengthValue } = decodeVarInt(buffer);
        offset += headerLengthBytes;
        const headerBuffer = buffer.subarray(offset, offset + Number(headerLengthValue));
        offset += Number(headerLengthValue);
        const { length: payloadLengthBytes, value: payloadLengthValue } = decodeVarInt(buffer.subarray(offset));
        offset += payloadLengthBytes;
        const payloadBuffer = buffer.subarray(offset, offset + Number(payloadLengthValue));
        const header = HashProofHeader.fromBuffer(headerBuffer);
        const payload = HashProofPayload.fromBuffer(payloadBuffer);
        const newHashProof = new HashProof({ header: header, payload: payload });
        return newHashProof;
    }
    // static generateMerkleRoot(data: Buffer[], encoding: BufferEncoding = 'hex'): { hash: string; proofs: any[]; } {
    static generateMerkleRoot(data, encoding = 'hex') {
        const hashes = data.map((el) => Buffer.from(el.toHash(), 'hex'));
        const tree = new Tree(hashes, 'sha256', { requireBalanced: false, debug: false });
        const root = tree.root();
        // console.log('Generated merkle root', root);
        const proofs = data.map((el) => {
            return {
                hash: el.toHash('hex'),
                proof: tree.proofObject(Buffer.from(el.toHash('hex'), 'hex'))
            };
        });
        return { hash: Buffer.from(root).toString(encoding), proofs };
    }
    toJSON() {
        return {
            header: this.header.toJSON(),
            payload: this.payload.toJSON(),
        };
    }
    checkNonce(nonce) {
        const targetHash = getTargetHash(this.header.difficulty);
        const clone = new HashProof(Object.assign({}, this));
        clone.header.nonce = nonce;
        const hash = clone.toHash('hex');
        return hash < targetHash;
    }
    isValid() {
        if (!this.header.proposer) {
            return { error: 'Proposer is not defined' };
        }
        if (!this.checkNonce(this.header.nonce)) {
            return { error: 'Nonce is not valid' };
        }
        return true;
    }
}
export default HashProof;
//# sourceMappingURL=HashProof.js.map