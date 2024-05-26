/// <reference types="node" />
import { ITransactionOptions } from './interfaces/ITransactionOptions.js';
import { ITransactionAuthorization } from "./interfaces/ITransactionAuthorization.js";
import { ITransactionFee } from "./interfaces/ITransactionFee.js";
export declare class Transaction {
    kind: string;
    module: string | null;
    action: string | null;
    type: string | null;
    data: object;
    timestamp: number;
    sender: string | null;
    authorizations: ITransactionAuthorization[];
    fees: ITransactionFee[];
    constructor(props?: ITransactionOptions);
    computeHash(): string;
    toBuffer({ excludeAuthorization }?: {
        excludeAuthorization?: boolean;
    }): Buffer;
    static fromBuffer(buffer: Buffer): Transaction;
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
    isValid(): boolean | {
        error: string;
    };
}
export default Transaction;
//# sourceMappingURL=Transaction.d.ts.map