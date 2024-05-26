/// <reference types="node" />
import { ModuleBlockPayload } from "./ModuleBlockPayload.js";
import { ModuleBlockHeader } from "./ModuleBlockHeader.js";
import { IModuleBlockOptions } from "./interfaces/IModuleBlockOptions.js";
interface IStateAction {
    kind: string;
    type: string;
    data: any;
    timestamp: number;
}
interface IElement {
    header: {
        module: string;
    };
    payload: {
        data: IStateAction[];
    };
    toHash: (encoding: BufferEncoding) => string;
}
export default class ModuleBlock {
    header: ModuleBlockHeader;
    payload: ModuleBlockPayload;
    signature: string;
    constructor(options?: IModuleBlockOptions);
    consider(element: IElement): boolean;
    toBuffer(): Buffer;
    toHex(): string;
    static fromHex(hex: string): ModuleBlock;
    static fromBuffer(buffer: Buffer): ModuleBlock;
    toString(): string;
    toHash(encoding?: BufferEncoding): string | Buffer;
    toJSON(): object;
    isFrozen(): boolean;
    isOpen(): boolean;
    isVoting(): boolean;
    isValid(): boolean;
    toDoc(publicKey: any): {
        chain_id: string;
        account_number: string;
        sequence: string;
        fee: {
            gas: string;
            amount: never[];
        };
        msgs: {
            type: string;
            value: {
                signer: string;
                data: string;
            };
        }[];
        memo: string;
    };
    sign(signer: any): void;
    verifySignature(publicKey: any): boolean;
}
export {};
//# sourceMappingURL=ModuleBlock.d.ts.map