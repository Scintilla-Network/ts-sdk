import { ITransactionAuthorization } from "./ITransactionAuthorization.js";
import { ITransactionFee } from "./ITransactionFee.js";
export interface ITransactionOptions {
    module?: string;
    action?: string;
    type?: string;
    data?: object;
    timestamp?: number;
    sender?: string | null;
    authorizations?: ITransactionAuthorization[] | [];
    fees?: ITransactionFee[] | [];
}
//# sourceMappingURL=ITransactionOptions.d.ts.map