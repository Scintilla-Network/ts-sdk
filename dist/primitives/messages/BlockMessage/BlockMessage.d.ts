import { IBlockMessageOptions } from "./interfaces/IBlockMessageOptions.js";
import { IBlockModules } from "./interfaces/IBlockModules.js";
import { NetMessage } from "../NetMessage/NetMessage.js";
export declare class BlockMessage {
    hash: string;
    previousHash: string;
    height: number;
    time: Date | null;
    proposer: string | null;
    statement: any;
    modules: IBlockModules;
    constructor({ hash, previousHash, height, time, proposer, statement, modules, }?: IBlockMessageOptions);
    generateHash(): string;
    static fromMessage(message: NetMessage): BlockMessage;
    toMessage(): NetMessage;
}
export default BlockMessage;
//# sourceMappingURL=BlockMessage.d.ts.map