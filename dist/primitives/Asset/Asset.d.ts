import { IAssetOptions } from "./interfaces/IAssetOptions.js";
import { IFees } from "./interfaces/IFees.js";
import { IPermissions } from "./interfaces/IPermissions.js";
import { ISupply } from "./interfaces/ISupply.js";
export declare class Asset {
    name: string;
    symbol: string;
    supply: ISupply;
    decimals: number;
    distribution: Record<string, any>;
    permissions: IPermissions;
    fees: IFees;
    constructor({ name, symbol, supply, decimals, distribution, permissions, fees }: IAssetOptions);
    toJSON(): {
        name: string;
        symbol: string;
        supply: ISupply;
        decimals: number;
        distribution: Record<string, any>;
        permissions: IPermissions;
        fees: IFees;
    };
}
export default Asset;
//# sourceMappingURL=Asset.d.ts.map