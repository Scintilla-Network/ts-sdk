import {IStatementData} from "./IStatementData.js";
import {ISigner} from "./ISigner.js";

export interface IStatementMessageOptions {
    identifier?: string | null;
    key?: string | null;
    type?: string;
    data?: IStatementData | null;
    kind?: string | null;
    signer?: ISigner | null;
    origin?: string | null;
    vote?: string | null;
    signature?: string | null;
}
