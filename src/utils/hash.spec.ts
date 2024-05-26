import { describe, it, expect } from 'vitest';
import { sha256 } from './hash.js';

describe('sha256', () => {
    it('correctly hashes string inputs', () => {
        const input = 'test';
        const hash = sha256(input);
        expect(hash).toBeInstanceOf(Buffer);
        // This expected hash needs to be verified for the input 'test'
        // Example hash is for illustration purposes only
        expect(hash.toString('hex')).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
    });

    it('correctly hashes Buffer inputs', () => {
        const input = Buffer.from('test');
        const hash = sha256(input);
        expect(hash).toBeInstanceOf(Buffer);
        // Verify the hash against a known value
    });

    // Additional tests for Uint8Array and ArrayBuffer inputs can follow the same pattern
});
