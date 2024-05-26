import {ITransitionAuthorization} from "./ITransitionAuthorization.js";
import {ITransitionFee} from "./ITransitionFee.js";

export interface ITransitionOptions {
    module?: string;
    action?: string;
    type?: string;
    data?: object;
    timestamp?: number;

    authorizations?: ITransitionAuthorization[] | [];
    fees?: ITransitionFee[] | [];
}
