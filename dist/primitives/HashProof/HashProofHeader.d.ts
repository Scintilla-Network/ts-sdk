/// <reference types="node" />
import { IHashProofHeaderOptions } from "./interfaces/IHashProofHeaderOptions.js";
declare class HashProofHeader {
    timestamp: number;
    height: number;
    previousHash: string | null;
    module: string;
    proposer: string | null;
    merkleRoot: string | null;
    nonce: number;
    difficulty: bigint;
    constructor(options?: IHashProofHeaderOptions);
    toBuffer(): Buffer;
    toHash(): string;
    toJSON(): {
        timestamp: string;
        height: number;
        previousHash: string | null;
        module: string;
        proposer: string | null;
        merkleRoot: string | null;
        nonce: string;
        difficulty: string;
    };
    static fromBuffer(buffer: Buffer): HashProofHeader;
}
export default HashProofHeader;
//# sourceMappingURL=HashProofHeader.d.ts.map