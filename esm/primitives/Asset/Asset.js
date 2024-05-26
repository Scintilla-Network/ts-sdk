export class Asset {
    constructor({ name = 'UNDEFINED', symbol = 'UNDEFINED', supply = { max: 100000000 * 10 ** 8 }, decimals = 8, distribution = {}, permissions = {
        mint: ['scintilla'],
        burn: ['scintilla'],
    }, fees = {
        transfer: {
            percent: 0.00002,
            max: 20
        }
    } }) {
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
//# sourceMappingURL=Asset.js.map