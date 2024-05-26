import { Buffer } from 'buffer';
import {IModuleBlockPayloadOptions} from "./interfaces/IModuleBlockPayloadOptions.js";
import {decodeVarInt, encodeVarInt} from "../../utils/varint.js";
import {sha256} from "../../utils/hash.js";

export class ModuleBlockPayload {
    hashProofHashes: string[];
    orderedStateActions: string[];

    constructor(props: IModuleBlockPayloadOptions = {}) {
        this.hashProofHashes = props.hashProofHashes || [];
        this.orderedStateActions = props.orderedStateActions || [];
        console.log(this);
    }

    consider(key: string): void {
        if (!key || typeof key !== 'string') {
            console.error('BlockData tried to consider without a proper key element.');
            return;
        }

        const [timestamp, type, hashProofHash, keyHashProofIndex] = key.split(':');

        console.log(`timestamp: ${timestamp}, type: ${type}, hashProofHash: ${hashProofHash}, keyHashProofIndex: ${keyHashProofIndex}`);
        // Logic for ordering and considering state actions
        const insertIndex = this.orderedStateActions.findIndex((element) => {
            const [timestampElement] = element.split(':');
            return timestampElement > timestamp;
        });

        if (!this.hashProofHashes.includes(hashProofHash)) {
            this.hashProofHashes.push(hashProofHash);
        }

        const hashProofIndex = this.hashProofHashes.findIndex((element) => element === hashProofHash);
        if (hashProofIndex === -1) {
            throw new Error(`HashProofHash ${hashProofHash} not found`);
        }

        const actionKey = `${hashProofIndex}:${keyHashProofIndex}`;
        if (insertIndex === -1) {
            this.orderedStateActions.push(actionKey);
        } else {
            this.orderedStateActions.splice(insertIndex, 0, actionKey);
        }
    }

    toBuffer(): Buffer {
        const hashProofHashesBuffer = Buffer.from(JSON.stringify(this.hashProofHashes));
        const orderedStateActionsBuffer = Buffer.from(JSON.stringify(this.orderedStateActions));

        const varintHashProofHashesLength = encodeVarInt(hashProofHashesBuffer.length);
        const varintOrderedStateActionsLength = encodeVarInt(orderedStateActionsBuffer.length);

        return Buffer.concat([varintHashProofHashesLength, hashProofHashesBuffer, varintOrderedStateActionsLength, orderedStateActionsBuffer]);
    }

    toHash(): string {
        return sha256(this.toBuffer()).toString('hex');
    }

    static fromBuffer(buffer: Buffer): ModuleBlockPayload {
        let offset = 0;

        const { value: hashProofHashesLength, length: varintHashProofHashesLength } = decodeVarInt(buffer.slice(offset));
        offset += varintHashProofHashesLength;
        const hashProofHashes = JSON.parse(buffer.slice(offset, offset + Number(hashProofHashesLength)).toString('utf8'));
        offset += Number(hashProofHashesLength);

        const { value: orderedStateActionsLength, length: varintOrderedStateActionsLength } = decodeVarInt(buffer.slice(offset));
        const orderedStateActions = JSON.parse(buffer.slice(offset + varintOrderedStateActionsLength, offset + varintOrderedStateActionsLength + Number(orderedStateActionsLength)).toString('utf8'));

        return new ModuleBlockPayload({
            hashProofHashes,
            orderedStateActions,
        });
    }

    toJSON(): object {
        return {
            hashProofHashes: this.hashProofHashes,
            orderedStateActions: this.orderedStateActions,
        };
    }
}
