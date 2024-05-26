/// <reference types="node" />
import { Buffer } from 'buffer';
import { IModuleBlockPayloadOptions } from "./interfaces/IModuleBlockPayloadOptions.js";
export declare class ModuleBlockPayload {
    hashProofHashes: string[];
    orderedStateActions: string[];
    constructor(props?: IModuleBlockPayloadOptions);
    consider(key: string): void;
    toBuffer(): Buffer;
    toHash(): string;
    static fromBuffer(buffer: Buffer): ModuleBlockPayload;
    toJSON(): object;
}
//# sourceMappingURL=ModuleBlockPayload.d.ts.map