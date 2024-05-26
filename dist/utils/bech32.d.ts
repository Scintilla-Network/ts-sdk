declare function toWords(bytes: number[]): number[] | string;
declare function fromWordsUnsafe(words: number[]): number[] | undefined;
declare function fromWords(words: number[]): number[];
declare const bech32: {
    decodeUnsafe: (str: string, LIMIT?: number) => {
        prefix: string;
        words: number[];
    } | undefined;
    decode: (str: string, LIMIT?: number) => {
        prefix: string;
        words: number[];
    };
    encode: (prefix: string, words: number[], LIMIT?: number) => string;
    toWords: typeof toWords;
    fromWordsUnsafe: typeof fromWordsUnsafe;
    fromWords: typeof fromWords;
};
declare const bech32m: {
    decodeUnsafe: (str: string, LIMIT?: number) => {
        prefix: string;
        words: number[];
    } | undefined;
    decode: (str: string, LIMIT?: number) => {
        prefix: string;
        words: number[];
    };
    encode: (prefix: string, words: number[], LIMIT?: number) => string;
    toWords: typeof toWords;
    fromWordsUnsafe: typeof fromWordsUnsafe;
    fromWords: typeof fromWords;
};
export { bech32, bech32m };
//# sourceMappingURL=bech32.d.ts.map