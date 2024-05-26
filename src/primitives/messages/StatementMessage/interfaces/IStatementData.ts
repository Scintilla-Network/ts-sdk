// Assuming this file is located at src/messages/interfaces/IStatementMessageOptions.ts

export interface IStatementData {
    // Define the structure of `data` based on your application's needs
    height?: number;
    hash?: string;
    previous?: string | null;
    modules?: {
        core: Array<[string, string]>;
        consensus: any[]; // Specify a more accurate type if possible
        external: any[]; // Specify a more accurate type if possible
    };
    time?: number;
}
