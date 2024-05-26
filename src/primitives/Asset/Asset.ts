// src/models/Asset.ts
import { IAssetOptions } from "./interfaces/IAssetOptions.js";
import { IFees } from "./interfaces/IFees.js";
import { IPermissions } from "./interfaces/IPermissions.js";
import { ISupply } from "./interfaces/ISupply.js";

export class Asset {
    name: string;
    symbol: string;
    supply: ISupply;
    decimals: number;
    distribution: Record<string, any>;
    permissions: IPermissions;
    fees: IFees;

    constructor({
                    name = 'UNDEFINED',
                    symbol = 'UNDEFINED',
                    supply = { max: 100_000_000 * 10 ** 8 },
                    decimals = 8,
                    distribution = {},
                    permissions = {
                        mint: ['scintilla'],
                        burn: ['scintilla'],
                    },
                    fees = {
                        transfer: {
                            percent: 0.00002,
                            max: 20
                        }
                    }
                }: IAssetOptions) {
        this.name = name;
        this.symbol = symbol;
        this.supply = supply;
        this.decimals = decimals;
        this.distribution = distribution;
        this.permissions = permissions;
        this.fees = fees;
    }

    toJSON() {
        return {
            name: this.name,
            symbol: this.symbol,
            supply: this.supply,
            decimals: this.decimals,
            distribution: this.distribution,
            permissions: this.permissions,
            fees: this.fees
        };
    }
}

export default Asset;
