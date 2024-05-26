/// <reference types="node" />
import { ITransferOptions } from "./interfaces/ITransferOptions.js";
import { ITransferAuthorization } from "./interfaces/ITransferAuthorization.js";
import { ITransferFee } from "./interfaces/ITransferFee.js";
import { ITransactionAuthorization } from "../Transaction/interfaces/ITransactionAuthorization.js";
export declare class Transfer {
    kind: string;
    module: string | null;
    action: string | null;
    type: string | null;
    data: object;
    timestamp: number;
    sender: string | null;
    authorizations: ITransferAuthorization[];
    fees: ITransferFee[];
    constructor(props?: ITransferOptions);
    computeHash(): string;
    toBuffer({ excludeAuthorization }?: {
        excludeAuthorization?: boolean;
    }): Buffer;
    static fromBuffer(buffer: Buffer): Transfer;
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
    addAuthorization(authorization: ITransactionAuthorization): void;
    toSignableMessage(publicKey: any): any;
    sign(signer: any): Promise<void>;
    isValid(): boolean | {
        error: string;
    };
}
export default Transfer;
//# sourceMappingURL=Transfer.d.ts.map