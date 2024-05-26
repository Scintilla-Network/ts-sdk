import HashProofHeader from "./HashProofHeader.js";
import HashProofPayload from "./HashProofPayload.js";
import {sha256} from "../../utils/hash.js";
// @ts-ignore
import {Tree} from "@truestamp/tree";
import {IHashProofOptions} from "./interfaces/IHashProofOptions.js";
import {IHashProofPayloadElement} from "./interfaces/IHashProofPayloadElement.js";
import {decodeVarInt, encodeVarInt} from "../../utils/varint.js";
import getTargetHash from "../../utils/getTargetHash.js";

class HashProof {
    header: HashProofHeader;
    payload: HashProofPayload;

    constructor(options: IHashProofOptions = {}) {
        this.header = new HashProofHeader(options?.header);
        this.payload = new HashProofPayload(options.payload ?? {data: []});
    }

    async consider(element: IHashProofPayloadElement): Promise<void> {
        if (!element || !element.type) {
            console.error('HashProof tried to consider an undefined or invalid element.');
            return;
        }
        this.payload.consider(element);

        // const buffers = [this.payload.toBuffer()];
        // console.log('Generating merkle root', buffers);
        // this.header.merkleRoot = HashProof.generateMerkleRoot(buffers, 'hex').hash;
        this.header.merkleRoot = HashProof.generateMerkleRoot(this.payload.data, 'hex').hash;
    }

    toBuffer(): Buffer {
        const headerBuffer = this.header.toBuffer();
        const varintHeaderBuffer = encodeVarInt(headerBuffer.length);

        const payloadBuffer = this.payload.toBuffer();
        const varintPayloadBuffer = encodeVarInt(payloadBuffer.length);

        const buffer = Buffer.concat([varintHeaderBuffer, headerBuffer, varintPayloadBuffer, payloadBuffer]);
        return buffer;
    }

    toHex(): string {
        return this.toBuffer().toString('hex');
    }

    toHash(encoding: BufferEncoding = 'hex'): string {
        const buffer = this.toBuffer();
        return sha256(buffer).toString(encoding);
    }

    static fromHex(hex: string): HashProof {
        const buffer = Buffer.from(hex, 'hex');
        return this.fromBuffer(buffer);
    }

    static fromBuffer(buffer: Buffer): HashProof {
        let offset = 0;
        const {
            length: headerLengthBytes,
            value: headerLengthValue
        } = decodeVarInt(buffer);

        offset += headerLengthBytes;
        const headerBuffer = buffer.subarray(offset, offset + Number(headerLengthValue));
        offset += Number(headerLengthValue);

        const {
            length: payloadLengthBytes,
            value: payloadLengthValue
        } = decodeVarInt(buffer.subarray(offset));
        offset += payloadLengthBytes;

        const payloadBuffer = buffer.subarray(offset, offset + Number(payloadLengthValue));

        const header = HashProofHeader.fromBuffer(headerBuffer);
        const payload = HashProofPayload.fromBuffer(payloadBuffer);

        const newHashProof = new HashProof({header: header, payload: payload});

        return newHashProof;
    }

    // static generateMerkleRoot(data: Buffer[], encoding: BufferEncoding = 'hex'): { hash: string; proofs: any[]; } {
    static generateMerkleRoot(data: any[], encoding: BufferEncoding = 'hex'): { hash: string; proofs: any[]; } {
        const hashes = data.map((el) => Buffer.from(el.toHash(), 'hex'));
        const tree = new Tree(hashes, 'sha256', {requireBalanced: false, debug: false});
        const root = tree.root();
        // console.log('Generated merkle root', root);
        const proofs = data.map((el) => {
            return {
                hash: el.toHash('hex'),
                proof: tree.proofObject(Buffer.from(el.toHash('hex'), 'hex'))
            }
        });

        return {hash: Buffer.from(root).toString(encoding), proofs};
    }

    toJSON(): object {
        return {
            header: this.header.toJSON(),
            payload: this.payload.toJSON(),
        };
    }

    checkNonce(nonce: number): boolean {
        const targetHash = getTargetHash(this.header.difficulty);
        const clone = new HashProof({...this});
        clone.header.nonce = nonce;
        const hash = clone.toHash('hex');
        return hash < targetHash;
    }

    isValid() {
        if (!this.header.proposer) {
            return {error: 'Proposer is not defined'}
        }

        if (!this.checkNonce(this.header.nonce)) {
            return {error: 'Nonce is not valid'}
        }

        return true;
    }
}

export default HashProof;
