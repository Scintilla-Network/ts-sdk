/// <reference types="node" />
import { Buffer } from 'buffer';
import { IModuleBlockHeaderOptions } from './interfaces/IModuleBlockHeaderOptions.js';
export declare class ModuleBlockHeader {
    timestamp: number;
    height: number;
    previousHash: string | null;
    proposer: string | null;
    module: string;
    constructor(options?: IModuleBlockHeaderOptions);
    toBuffer(): Buffer;
    toHash(): string;
    static fromBuffer(buffer: Buffer): ModuleBlockHeader;
    toJSON(): object;
}
//# sourceMappingURL=ModuleBlockHeader.d.ts.map