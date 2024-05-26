// src/primitives/Transfer/interfaces/TransferOptions.ts
import {ITransferAuthorization} from "./ITransferAuthorization.js";
import {ITransferFee} from "./ITransferFee.js";

export interface ITransferOptions {
    module?: string | null;
    action?: string;
    type?: string;
    data?: object;
    timestamp?: number;
    sender?: string | null;
    authorizations?: ITransferAuthorization[] | null;
    fees?: ITransferFee[] | null;
}
