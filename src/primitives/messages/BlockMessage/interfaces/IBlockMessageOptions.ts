// Assuming this file is located at src/interfaces/IBlockMessageOptions.ts
import { IBlockModules } from './IBlockModules.js';

export interface IBlockMessageOptions {
    hash?: string;
    previousHash?: string;
    height?: number;
    time?: Date | null;
    proposer?: string | null; // Adjust as necessary for your application's data structure
    statement?: any; // Define a more specific type if possible
    modules?: IBlockModules;
}
