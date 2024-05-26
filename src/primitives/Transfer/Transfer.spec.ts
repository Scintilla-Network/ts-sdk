import { describe, it, expect } from 'vitest';
import { Transfer } from './Transfer.js';

describe('Transfer', () => {
    it('should be able to create a Transfer instance', () => {
        const transfer = new Transfer();
        expect(transfer).toBeDefined();
    });

    it('should have a kind property', () => {
        const transfer = new Transfer();
        expect(transfer.kind).toBe('TRANSFER');
    });

    it('should have a module property', () => {
        const transfer = new Transfer();
        expect(transfer.module).toBeNull();
    });

    it('should have an action property', () => {
        const transfer = new Transfer();
        expect(transfer.action).toBeNull();
    });

    it('should have a type property', () => {
        const transfer = new Transfer();
        expect(transfer.type).toBeNull();
    });

    it('should have a data property', () => {
        const transfer = new Transfer();
        expect(transfer.data).toEqual({});
    });

    it('should have a timestamp property', () => {
        const transfer = new Transfer();
        expect(transfer.timestamp).toBeDefined();
    });

    it('should have a sender property', () => {
        const transfer = new Transfer();
        expect(transfer.sender).toBeNull();
    });

    it('should have a computeHash method', () => {
        const transfer = new Transfer();
        expect(transfer.computeHash).toBeDefined();
    });

    it('should have a toBuffer method', () => {
        const transfer = new Transfer();
        expect(transfer.toBuffer).toBeDefined();
    });

    it('should have a toHex method', () => {
        const transfer = new Transfer();
        expect(transfer.toHex).toBeDefined();
    });

    it('should have a toUInt8Array method', () => {
        const transfer = new Transfer();
        expect(transfer.toUInt8Array).toBeDefined();
    });

    it('should have a toHash method', () => {
        const transfer = new Transfer();
        expect(transfer.toHash).toBeDefined();
    });

    it('should have a toJSON method', () => {
        const transfer = new Transfer();
        expect(transfer.toJSON).toBeDefined();
    });
});

describe('Transfer.computeHash', () => {
    it('should return a string', () => {
        const transfer = new Transfer();
        const result = transfer.computeHash();
        expect(typeof result).toBe('string');
    });
    it('should return consistent hash', () => {
        const transfer = new Transfer({
            timestamp: 1234567890,
        });
        const result = transfer.computeHash();
        expect(result).toBe('9ae9563d309b396fd641e08e01b62234a599ed2daacd24d84beb6d76ff1e4f3a');
    });
});

describe('Transfer - Functions', () => {
    it('should initialize with default values', () => {
        // @ts-ignore
        const transfer = new Transfer({
            timestamp: 1234567890,
            module: 'core.banking',
            action: 'EXECUTE',
            type: 'ASSET',
            sender: 'alex',
            data: {
                asset: 'SCT',
                amount: 300000 * 10 ** 8,
                recipient: 'tech-dao',
            },
            // equivalent of signatures: [{ sig: 'signature', identity: 'alex' }] as it assume sender.
            authorizations:[{
                signature: 'signature',
            }],

            fees: [{
                amount: 1000,
                asset: 'SCT',
                payer: 'alex',
            }],
        });
        expect(transfer.module).toBeNull();
        expect(transfer.action).toBeNull();
        expect(transfer.type).toBeNull();
        expect(transfer.data).toEqual({});
        expect(transfer.timestamp).toBeDefined();
        expect(transfer.sender).toBeNull();
    });
    it('should multisig', () => {
        const transfer = new Transfer({
            timestamp: 1234567890,
            module: 'core.banking',
            action: 'EXECUTE',
            type: 'ASSET',
            data: {
                asset: 'SCT',
                amount: 300000 * 10 ** 8,
                recipient: 'tech-dao',
            },
            sender: 'techdao',
            authorizations:[{
                moniker: 'alex',
                signature: 'signature',
            },{
                moniker: 'bob',
                signature: 'signature',
            }],
            fees: [{
                amount: 1000,
                asset: 'SCT',
                payer: 'alex',
            }],
        });

        expect(transfer.module).equal('core.banking');
        expect(transfer.action).equal('EXECUTE');
        expect(transfer.type).equal('ASSET');
        expect(transfer.data).toEqual({
            asset: 'SCT',
            amount: 300000 * 10 ** 8,
            recipient: 'tech-dao',
        });
        expect(transfer.timestamp).toBeDefined();
        expect(transfer.sender).equal('techdao');

        expect(transfer.authorizations).toEqual([{
            moniker: 'alex',
            signature: 'signature',
        },{
            moniker: 'bob',
            signature: 'signature',
        }]);

        expect(transfer.fees).toEqual([{
            amount: 1000,
            asset: 'SCT',
            payer: 'alex',
        }]);

    });
})
