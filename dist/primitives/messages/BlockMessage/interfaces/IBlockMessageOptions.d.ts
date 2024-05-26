import { IBlockModules } from './IBlockModules.js';
export interface IBlockMessageOptions {
    hash?: string;
    previousHash?: string;
    height?: number;
    time?: Date | null;
    proposer?: string | null;
    statement?: any;
    modules?: IBlockModules;
}
//# sourceMappingURL=IBlockMessageOptions.d.ts.map