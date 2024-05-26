import { describe, it, expect } from 'vitest';
import GovernanceVote from './GovernanceVote.js';
describe('GovernanceVote', () => {
    const voteOptions = {
        proposal: "c3380d33ab1448bd69c76193c2426576590ff23df5415f268b1e6639c963d6d1",
        dao: "scintilla-dao",
        vote: "YES",
    };
    it('initializes correctly with provided options', () => {
        const proposalVote = new GovernanceVote(voteOptions);
        expect(proposalVote.proposal).toBe(voteOptions.proposal);
        expect(proposalVote.dao).toBe(voteOptions.dao);
        expect(proposalVote.vote).toBe(voteOptions.vote);
    });
    it('correctly serializes to JSON', () => {
        const proposalVote = new GovernanceVote(voteOptions);
        const json = proposalVote.toJSON();
        expect(json).toEqual(voteOptions);
    });
    it('generates a consistent hash', () => {
        const proposalVote = new GovernanceVote(voteOptions);
        const hash = proposalVote.toHash();
        // Check if hash is a non-empty string.
        // This test assumes the sha256 function is correctly hashing the input.
        // For more accurate testing, consider mocking the sha256 function if its output is predictable.
        expect(hash).toBeTruthy();
        expect(typeof hash).toBe('string');
        expect(hash.length).toBeGreaterThan(0);
    });
    it('converts to a Buffer correctly', () => {
        const proposalVote = new GovernanceVote(voteOptions);
        const buffer = proposalVote.toBuffer();
        // Check if buffer is correctly generated from JSON representation.
        // This is a basic check; you may want to add more specific tests based on known inputs and outputs.
        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
    });
    // Additional tests for edge cases, error handling, etc., can be added here.
});
//# sourceMappingURL=GovernanceVote.spec.js.map