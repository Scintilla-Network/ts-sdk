/// <reference types="node" />
import { Buffer } from 'buffer';
import { IChainBlockHeaderOptions } from "./interfaces/IChainBlockHeaderOptions.js";
export declare class ChainBlockHeader {
    timestamp: Date;
    height: number;
    previousHash: string | null;
    proposer: string | null;
    constructor(options?: IChainBlockHeaderOptions);
    toBuffer(): Buffer;
    toHash(): string;
    static fromBuffer(buffer: Buffer): ChainBlockHeader;
    toJSON(): object;
}
export default ChainBlockHeader;
//# sourceMappingURL=ChainBlockHeader.d.ts.map