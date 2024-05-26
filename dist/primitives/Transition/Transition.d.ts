/// <reference types="node" />
import { ITransitionOptions } from "./interfaces/ITransitionOptions.js";
import { ITransitionAuthorization } from "./interfaces/ITransitionAuthorization.js";
import { ITransitionFee } from "./interfaces/ITransitionFee.js";
import { ITransactionAuthorization } from "../Transaction/interfaces/ITransactionAuthorization.js";
export declare class Transition {
    kind: string;
    module: string | null;
    action: string | null;
    type: string | null;
    data: object;
    timestamp: number;
    authorizations: ITransitionAuthorization[];
    fees: ITransitionFee[];
    constructor(props?: ITransitionOptions);
    computeHash(): string;
    toBuffer({ excludeAuthorization }?: {
        excludeAuthorization?: boolean;
    }): Buffer;
    static fromBuffer(buffer: Buffer): Transition;
    toHex({ excludeAuthorization }?: {
        excludeAuthorization?: boolean;
    }): string;
    toUInt8Array({ excludeAuthorization }?: {
        excludeAuthorization?: boolean;
    }): Uint8Array;
    toHash(encoding?: BufferEncoding): string;
    toJSON({ excludeAuthorization }?: {
        excludeAuthorization?: boolean;
    }): object;
    addAuthorization(authorization: ITransactionAuthorization): void;
    verifySignature(signer?: any): boolean;
    getPublicKey(): string | undefined;
    toDoc(publicKey: string): {
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
    toBase64(): string;
    toSignableMessage(publicKey: any): any;
    sign(signer: any): Promise<void>;
    validate(): {
        error: string;
        valid: boolean;
    };
    isValid(): boolean;
}
export default Transition;
//# sourceMappingURL=Transition.d.ts.map