// src/models/interfaces/IAssetOptions.ts
import { ISupply } from "./ISupply.js";
import { IPermissions } from "./IPermissions.js";
import { IFees } from "./IFees.js";

export interface IAssetOptions {
    name?: string;
    symbol?: string;
    supply?: ISupply;
    decimals?: number;
    distribution?: Record<string, any>;
    permissions?: IPermissions;
    fees?: IFees;
}
