/// <reference types="node" />
import HashProofHeader from "./HashProofHeader.js";
import HashProofPayload from "./HashProofPayload.js";
import { IHashProofOptions } from "./interfaces/IHashProofOptions.js";
import { IHashProofPayloadElement } from "./interfaces/IHashProofPayloadElement.js";
declare class HashProof {
    header: HashProofHeader;
    payload: HashProofPayload;
    constructor(options?: IHashProofOptions);
    consider(element: IHashProofPayloadElement): Promise<void>;
    toBuffer(): Buffer;
    toHex(): string;
    toHash(encoding?: BufferEncoding): string;
    static fromHex(hex: string): HashProof;
    static fromBuffer(buffer: Buffer): HashProof;
    static generateMerkleRoot(data: any[], encoding?: BufferEncoding): {
        hash: string;
        proofs: any[];
    };
    toJSON(): object;
    checkNonce(nonce: number): boolean;
    isValid(): true | {
        error: string;
    };
}
export default HashProof;
//# sourceMappingURL=HashProof.d.ts.map