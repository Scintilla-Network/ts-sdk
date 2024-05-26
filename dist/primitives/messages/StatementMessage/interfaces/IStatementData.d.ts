export interface IStatementData {
    height?: number;
    hash?: string;
    previous?: string | null;
    modules?: {
        core: Array<[string, string]>;
        consensus: any[];
        external: any[];
    };
    time?: number;
}
//# sourceMappingURL=IStatementData.d.ts.map