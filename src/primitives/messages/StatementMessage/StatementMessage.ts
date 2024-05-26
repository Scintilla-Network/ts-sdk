// src/messages/StatementMessage.ts
import { sha256 } from "../../../utils/hash.js";
import { Buffer } from 'buffer';
import { IStatementMessageOptions } from "./interfaces/IStatementMessageOptions.js";
import {ISigner} from "./interfaces/ISigner.js";
import {NetMessage} from "../NetMessage/NetMessage.js";

export class StatementMessage {
    identifier: string | null;
    key: string | null;
    type: string;
    kind: string | null;
    data: any | null; // Use IStatementData for a more specific type
    origin: string | null;
    vote: string | null;
    signer: string | null;
    signature: string | null;

    constructor({
                    identifier = null,
                    key = null,
                    type = 'QUORUM',
                    data = null,
                    kind = null,
                    signer = null,
                    origin = null,
                    vote = null,
                    signature = null,
                }: IStatementMessageOptions = {}) {
        this.identifier = identifier;
        this.key = key;
        this.type = type;
        this.kind = kind;
        this.data = data;
        this.origin = origin;
        this.vote = vote;
        this.signer = signer ? signer.moniker : null;
        this.signature = signature;

        if (!this.identifier) {
            this.identifier = this.generateIdentifier();
        }
    }

    sign(signer: ISigner): StatementMessage {
        const string = JSON.stringify(this.data);
        if (!signer) {
            throw new Error('Signer is required to sign the statement');
        }
        this.signer = signer.moniker;
        this.signature = signer.sign(string);
        return this;
    }

    toJSON(): object {
        return {
            identifier: this.identifier,
            type: this.type,
            key: this.key,
            kind: this.kind,
            data: this.data,
            origin: this.origin,
            signer: this.signer,
            vote: this.vote,
            signature: this.signature,
        };
    }

    generateIdentifier(): string {
        const string = JSON.stringify(this.data);
        return sha256(string).toString('hex');
    }

    static fromMessage(message: NetMessage): StatementMessage {
        if(!message.payload) {
            throw new Error('No payload in message');
        }
        const payload = JSON.parse(message.payload.toString('utf-8'));
        return new StatementMessage(payload);
    }

    toMessage(): NetMessage {
        return new NetMessage({
            kind: 'STATEMENT',
            payload: Buffer.from(JSON.stringify(this.toJSON()))
        });
    }
}

export default StatementMessage;
