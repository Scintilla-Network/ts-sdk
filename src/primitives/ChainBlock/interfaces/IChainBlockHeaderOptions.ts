export interface IChainBlockHeaderOptions {
    timestamp?: Date;
    height?: number;
    previousHash?: string | null;
    proposer?: string | null;
}
