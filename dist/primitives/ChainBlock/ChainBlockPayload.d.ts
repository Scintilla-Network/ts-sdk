/// <reference types="node" />
import { Buffer } from 'buffer';
import { IChainBlockPayloadOptions } from './interfaces/IChainBlockPayloadOptions.js';
export declare class ChainBlockPayload {
    data: any[];
    constructor(options?: IChainBlockPayloadOptions);
    consider(element: any): void;
    toBuffer(): Buffer;
    toHash(): string;
    static fromBuffer(buffer: Buffer): ChainBlockPayload;
    toJSON(): object;
}
export default ChainBlockPayload;
//# sourceMappingURL=ChainBlockPayload.d.ts.map