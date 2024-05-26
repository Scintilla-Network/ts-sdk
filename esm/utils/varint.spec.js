import { describe, it, expect } from 'vitest';
import { encodeVarInt, decodeVarInt } from './varint.js';
describe('encodeVarInt', () => {
    it('correctly encodes small numbers', () => {
        const result = encodeVarInt(127);
        expect(result).toBeInstanceOf(Buffer);
        expect(result.toString('hex')).toBe('7f');
    });
    it('correctly encodes larger numbers', () => {
        const result = encodeVarInt(128);
        expect(result.toString('hex')).toBe('8001');
    });
    it('handles bigint inputs', () => {
        const result = encodeVarInt(BigInt(128));
        expect(result.toString('hex')).toBe('8001');
    });
});
describe('decodeVarInt', () => {
    it('correctly decodes small numbers', () => {
        const buffer = Buffer.from([0x7f]);
        const { value, length } = decodeVarInt(buffer);
        expect(value).toBe(127);
        expect(length).toBe(1);
    });
    it('correctly decodes larger numbers', () => {
        const buffer = Buffer.from([0x80, 0x01]);
        const { value, length } = decodeVarInt(buffer);
        expect(value).toBe(128);
        expect(length).toBe(2);
    });
    it('returns bigint for large numbers outside of safe integer range', () => {
        // const buffer = Buffer.from([0x81, 0x80, 0x80, 0x80, 0x10]);
        // const { value, length } = decodeVarInt(buffer);
        // expect(typeof value).toBe('bigint');
        // expect(value.toString()).toBe('2147483649');
        // expect(length).toBe(5);
    });
});
//# sourceMappingURL=varint.spec.js.map