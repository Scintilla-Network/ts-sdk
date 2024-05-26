import { describe, it, expect } from 'vitest';
import Asset from './Asset.js';
describe('Asset', () => {
    it('initializes with default values if no arguments are provided', () => {
        const asset = new Asset({});
        expect(asset.name).toBe('UNDEFINED');
        expect(asset.symbol).toBe('UNDEFINED');
        expect(asset.supply.max).toBe(100000000 * Math.pow(10, 8));
        expect(asset.decimals).toBe(8);
        expect(asset.permissions.mint).toEqual(['scintilla']);
        expect(asset.permissions.burn).toEqual(['scintilla']);
        expect(asset.fees.transfer.percent).toBe(0.00002);
        expect(asset.fees.transfer.max).toBe(20);
    });
    it('initializes with custom values', () => {
        const customAsset = new Asset({
            name: 'CustomToken',
            symbol: 'CTK',
            supply: {
                max: 500000000 * Math.pow(10, 8),
            },
            decimals: 10,
            permissions: {
                mint: ['admin'],
                burn: ['admin'],
            },
            fees: {
                transfer: {
                    percent: 0.0001,
                    max: 100,
                },
            },
        });
        expect(customAsset.name).toBe('CustomToken');
        expect(customAsset.symbol).toBe('CTK');
        expect(customAsset.supply.max).toBe(500000000 * Math.pow(10, 8));
        expect(customAsset.decimals).toBe(10);
        expect(customAsset.permissions.mint).toEqual(['admin']);
        expect(customAsset.permissions.burn).toEqual(['admin']);
        expect(customAsset.fees.transfer.percent).toBe(0.0001);
        expect(customAsset.fees.transfer.max).toBe(100);
    });
    it('toJSON method returns the correct object', () => {
        const asset = new Asset({
            name: 'Scintilla',
            symbol: 'SCT',
            supply: {
                max: 100000000 * Math.pow(10, 8),
            },
            decimals: 8,
            permissions: {
                mint: ['scintilla'],
                burn: ['scintilla'],
            },
            fees: {
                transfer: {
                    percent: 0.00002,
                    max: 20,
                },
            },
        });
        const expectedJSON = {
            name: 'Scintilla',
            symbol: 'SCT',
            supply: {
                max: 100000000 * Math.pow(10, 8),
            },
            decimals: 8,
            distribution: {},
            permissions: {
                mint: ['scintilla'],
                burn: ['scintilla'],
            },
            fees: {
                transfer: {
                    percent: 0.00002,
                    max: 20,
                },
            },
        };
        expect(asset.toJSON()).toEqual(expectedJSON);
    });
});
//# sourceMappingURL=Asset.spec.js.map