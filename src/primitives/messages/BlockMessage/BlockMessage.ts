// src/BlockMessage.ts
import { sha256 } from "../../../utils/hash.js";
import { IBlockMessageOptions } from "./interfaces/IBlockMessageOptions.js";
import { Buffer } from 'buffer';
import {IBlockModules} from "./interfaces/IBlockModules.js";
import {NetMessage} from "../NetMessage/NetMessage.js";

export class BlockMessage {
    hash: string;
    previousHash: string;
    height: number;
    time: Date | null;
    proposer: string | null;
    statement: any; // Consider defining a more specific type
    modules: IBlockModules;

    constructor({
                    hash = '',
                    previousHash = '',
                    height = 0,
                    time = null,
                    proposer = null,
                    statement = null,
                    modules = { core: [], consensus: [], external: [] },
                }: IBlockMessageOptions = {}) {
        this.hash = hash;
        this.previousHash = previousHash;
        this.height = height;
        this.time = time;
        this.proposer = proposer;
        this.statement = statement;
        this.modules = modules;

        if (!this.hash) {
            this.hash = this.generateHash();
        }
    }

    generateHash(): string {
        const blockData = {
            previousHash: this.previousHash,
            height: this.height,
            time: this.time,
            proposer: this.proposer,
            statement: this.statement,
            modules: this.modules,
        };
        const string = JSON.stringify(blockData);
        return sha256(string).toString('hex');
    }

    static fromMessage(message: NetMessage): BlockMessage {
        if(!message.payload) {
            throw new Error('Message payload is required');
        }
        const { hash, previousHash, height, time, proposer, statement, modules } = JSON.parse(message.payload.toString('utf-8'));
        return new BlockMessage({
            hash,
            previousHash,
            height,
            time: time ? new Date(time) : null,
            proposer,
            statement,
            modules,
        });
    }

    toMessage(): NetMessage {
        return new NetMessage({
            kind: 'BLOCK',
            payload: Buffer.from(JSON.stringify({
                hash: this.hash,
                previousHash: this.previousHash,
                height: this.height,
                time: this.time,
                proposer: this.proposer,
                statement: this.statement,
                modules: this.modules,
            }), 'utf-8'),
        });
    }
}

export default BlockMessage;
