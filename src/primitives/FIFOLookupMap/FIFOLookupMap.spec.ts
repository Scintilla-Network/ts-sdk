import { describe, it, expect, beforeEach } from 'vitest';
import FIFOLookupMap from './FIFOLookupMap.js';
import { IData } from './interfaces/IData.js'; // Assuming you have an IData interface as described

describe('FIFOLookupMap', () => {
    let fifoMap: FIFOLookupMap;

    beforeEach(() => {
        // Reset FIFO map for each test
        fifoMap = new FIFOLookupMap(3, 'height');
    });

    it('adds items correctly and respects max size limit', () => {
        fifoMap.add({ height: 1, hash: 'hash1', optionalProp: 'opt1' } as IData);
        fifoMap.add({ height: 2, hash: 'hash2', optionalProp: 'opt2' } as IData);
        fifoMap.add({ height: 3, hash: 'hash3', optionalProp: 'opt3' } as IData);
        fifoMap.add({ height: 4, hash: 'hash4', optionalProp: 'opt4' } as IData); // This should evict the first item

        expect(fifoMap.get('height', 1)).toBeUndefined();
        expect(fifoMap.get('height', 4)).toEqual({ height: 4, hash: 'hash4', optionalProp: 'opt4' });
        expect(fifoMap.get('optionalProp', 'opt1')).toBeUndefined(); // The first item should be evicted
        expect(fifoMap.get('optionalProp', 'opt4')).toEqual({ height: 4, hash: 'hash4', optionalProp: 'opt4' });
    });

    it('ensures FIFO behavior upon reaching max size', () => {
        for (let i = 1; i <= 5; i++) {
            fifoMap.add({ height: i, hash: `hash${i}` } as IData);
        }
        // Should have evicted the first two entries
        expect(fifoMap.get('height', 1)).toBeUndefined();
        expect(fifoMap.get('height', 2)).toBeUndefined();
        expect(fifoMap.get('height', 3)).not.toBeUndefined();
        expect(fifoMap.get('height', 5)).toEqual({ height: 5, hash: 'hash5' });
    });

    it('retrieves the last element of a given property', () => {
        fifoMap.add({ height: 2, hash: 'hash2', 'module.core': 'v1' } as IData);
        fifoMap.add({ height: 3, hash: 'hash3', 'module.core': 'v2' } as IData);
        fifoMap.add({ height: 4, hash: 'hash4', 'module.core': 'v3' } as IData);

        const lastModuleCore = fifoMap.getLast('module.core');
        expect(lastModuleCore).toEqual({ height: 4, hash: 'hash4', 'module.core': 'v3' });
    });

    it('handles addition of items with the same primary key correctly', () => {
        fifoMap.add({ height: 1, hash: 'hash1' } as IData);
        fifoMap.add({ height: 1, hash: 'hashNew' } as IData); // Attempt to add another item with the same primary key
        expect(fifoMap.get('height', 1)).toEqual({ height: 1, hash: 'hash1' }); // The original item should remain
    });

    it('removes items correctly', () => {
        fifoMap.add({ height: 1, hash: 'hash1' } as IData);
        fifoMap.add({ height: 2, hash: 'hash2' } as IData);
        fifoMap.remove('1'); // Remove item by primary key value
        expect(fifoMap.get('height', 1)).toBeUndefined();
        expect(fifoMap.get('height', 2)).not.toBeUndefined();
    });
});
