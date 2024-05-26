import { describe, it, expect, beforeEach } from 'vitest';
import DAO from './DAO.js';
describe('DAO', () => {
    let dao;
    beforeEach(() => {
        // Initialize DAO with a known state before each test
        dao = new DAO({
            moniker: 'scintilla-dao',
            rules: {},
            members: [
                ['scintilla', 1000, 1000]
            ]
        });
    });
    it('initializes correctly with provided options', () => {
        expect(dao.moniker).toBe('scintilla-dao');
        expect(dao.rules).toEqual({});
        expect(dao.members.length).toBe(1);
        expect(dao.members[0]).toEqual(['scintilla', 1000, 1000]);
    });
    it('adds a new member correctly', () => {
        dao.setMember('newMember', 500, 500);
        expect(dao.members.length).toBe(2);
        expect(dao.getMember('newMember')).toEqual({
            moniker: 'newMember',
            nonVotingPower: 500,
            votingPower: 500,
        });
    });
    it('updates an existing member correctly', () => {
        dao.setMember('scintilla', 1500, 1500);
        expect(dao.getMember('scintilla')).toEqual({
            moniker: 'scintilla',
            nonVotingPower: 1500,
            votingPower: 1500,
        });
    });
    it('returns null for a non-existing member', () => {
        expect(dao.getMember('nonMember')).toBeNull();
    });
    it('serializes to JSON correctly', () => {
        const json = dao.toJSON();
        expect(json).toEqual({
            moniker: 'scintilla-dao',
            rules: {},
            records: {},
            members: [
                ['scintilla', 1000, 1000]
            ]
        });
    });
    // Additional tests can include testing rules, records, and moniker validation
});
//# sourceMappingURL=DAO.spec.js.map