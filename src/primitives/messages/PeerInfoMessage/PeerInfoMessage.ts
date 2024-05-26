// src/messages/PeerInfoMessage.ts
import {IPeerInfoMessageOptions} from "./interfaces/IPeerInfoMessageOptions.js";
import {Buffer} from 'buffer';
import {NetMessage} from "../NetMessage/NetMessage.js";

export class PeerInfoMessage {
    identity: {
        moniker: string;
    }
    modules: any[];
    score: number;

    constructor({identity = {moniker: 'unknown'}, modules = [], score = 0}: IPeerInfoMessageOptions = {}) {
        this.identity = identity;
        this.modules = modules;
        this.score = score;
    }

    toMessage(props = {}): NetMessage {
        return new NetMessage({
            kind: 'PEER_INFO',
            payload: Buffer.from(JSON.stringify({
                identity: this.identity,
                modules: this.modules,
                score: this.score
            }), 'utf-8'),
            ...props,
        });
    }
}

export default PeerInfoMessage;
