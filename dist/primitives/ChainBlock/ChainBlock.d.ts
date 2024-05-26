/// <reference types="node" />
import { Buffer } from 'buffer';
import { ChainBlockHeader } from './ChainBlockHeader.js';
import { ChainBlockPayload } from "./ChainBlockPayload.js";
import { IChainBlockOptions } from './interfaces/IChainBlockOptions.js';
export declare class ChainBlock {
    header: ChainBlockHeader;
    payload: ChainBlockPayload;
    constructor(options?: IChainBlockOptions);
    consider(element: any): void;
    toBuffer(): Buffer;
    toHex(): string;
    static fromBuffer(buffer: Buffer): ChainBlock;
    static fromHex(hex: string): ChainBlock;
    toHash(encoding?: 'buffer' | 'hex'): string | Buffer;
    toJSON(): object;
}
export default ChainBlock;
//# sourceMappingURL=ChainBlock.d.ts.map