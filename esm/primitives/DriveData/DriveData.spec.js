import { describe, it, expect, beforeEach } from 'vitest';
import DriveData from './DriveData.js';
// Import mocks if you have external dependencies
describe('DriveData', () => {
    let driveData;
    beforeEach(() => {
        // Reset driveData before each test
        driveData = new DriveData({
            type: 'text',
            content: 'Hello, World!',
        });
    });
    it('initializes correctly with default values', () => {
        const defaultDriveData = new DriveData();
        expect(defaultDriveData.type).toBe('text');
        expect(defaultDriveData.content).toBe('');
    });
    it('initializes correctly with provided options', () => {
        expect(driveData.type).toBe('text');
        expect(driveData.content).toBe('Hello, World!');
    });
    it('converts to JSON correctly', () => {
        const expectedJSON = {
            type: 'text',
            content: 'Hello, World!',
        };
        expect(driveData.toJSON()).toEqual(expectedJSON);
    });
    it('converts to Buffer correctly', () => {
        // This test assumes you have a way to validate the buffer conversion
        // You might need to mock `encodeVarInt` and check if it's called correctly
        // For simplicity, this example will not dive into buffer contents
        const buffer = driveData.toBuffer();
        expect(buffer).toBeInstanceOf(Buffer);
        // Further assertions can be added to verify buffer contents
    });
    it('generates a hash correctly', () => {
        // Assuming `sha256` is mocked or you're testing the hash generation indirectly
        const hash = driveData.toHash();
        expect(hash).toBeDefined();
        // Additional checks against a known hash value can be added here
    });
    // Add more tests as needed for methods like fromHex, fromBuffer, toHex, toString, and fromJSON
});
//# sourceMappingURL=DriveData.spec.js.map