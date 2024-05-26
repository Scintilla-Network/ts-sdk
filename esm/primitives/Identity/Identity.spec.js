import { describe, it, expect } from 'vitest';
import Identity from './Identity.js';
describe('Identity', () => {
    it('initializes with default values when no options are provided', () => {
        const identity = new Identity();
        expect(identity.moniker).toBe('');
        // expect(identity.address).toBe('');
        expect(identity.records).toEqual({});
    });
    it('initializes with provided values', () => {
        const options = {
            moniker: 'testuser',
            records: { key1: 'value1' },
            members: [['testaddress']]
        };
        const identity = new Identity(options);
        expect(identity.moniker).toBe(options.moniker);
        expect(identity.members).toEqual(options.members);
        expect(identity.records).toEqual(options.records);
    });
    it('sets and gets records correctly', () => {
        const identity = new Identity({ moniker: 'user' });
        identity.setRecord('profile.name', 'John Doe');
        identity.setRecord('profile.age', 30);
        expect(identity.records.profile.name).toBe('John Doe');
        expect(identity.records.profile.age).toBe(30);
    });
    it('ensures moniker is alphanumeric, hyphens, or underscores and does not exceed 64 characters', () => {
        const longMoniker = 'a'.repeat(65) + '-_';
        const identity = new Identity({ moniker: longMoniker });
        expect(identity.moniker).toHaveLength(64);
    });
    it('toStore method returns correctly structured object', () => {
        const identity = new Identity({ moniker: 'user' });
        identity.setRecord('profile.name', 'John Doe');
        identity.setRecord('profile.age', 30);
        const store = identity.toStore();
        expect(store).toHaveProperty(`/user/identity.json`);
        expect(store[`/user/identity.json`].moniker).toBe('user');
        expect(store[`/user/identity.json`].records['_profile']).toBe(1);
        expect(store[`/user/profile.json`].records['name']).toBe('John Doe');
        expect(store[`/user/profile.json`].records['age']).toBe(30);
    });
    it('toJSON returns the correct object', () => {
        const options = {
            moniker: 'testuser',
            members: [['testaddress']],
            records: { key1: 'value1' },
        };
        const identity = new Identity(options);
        const json = identity.toJSON();
        expect(json).toEqual(options);
    });
});
//# sourceMappingURL=Identity.spec.js.map