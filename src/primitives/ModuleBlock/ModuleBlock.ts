import {ModuleBlockPayload} from "./ModuleBlockPayload.js";
import {ModuleBlockHeader} from "./ModuleBlockHeader.js";
import {IModuleBlockOptions} from "./interfaces/IModuleBlockOptions.js";
import {sha256} from "../../utils/hash.js";
//@ts-ignore
import Logger from 'hermodlog';
import {decodeVarInt, encodeVarInt} from "../../utils/varint.js";
import {secp256k1} from "@noble/curves/secp256k1";
import escapeHTML from "../../utils/escapeHTML.js";
import sortedJsonByKeyStringify from "../../utils/sortedJsonByKeyStringify.js";
import makeADR36Doc from "../../utils/makeADR36Doc.js";

interface IStateAction {
    kind: string;
    type: string;
    data: any;
    timestamp: number;
}

interface IElement {
    header: {
        module: string;
    };
    payload: {
        data: IStateAction[];
    };
    toHash: (encoding: BufferEncoding) => string;
}

const VALID_STATE_ACTIONS_KIND = ['TRANSFER', "TRANSACTION", "TRANSITION"];

export default class ModuleBlock {
    header: ModuleBlockHeader;
    payload: ModuleBlockPayload;
    signature: string;

    constructor(options: IModuleBlockOptions = {}) {
        const headerOptions = options.header || {};
        this.header = new ModuleBlockHeader(headerOptions);

        const payloadOptions = options.payload || {};
        this.payload = new ModuleBlockPayload(payloadOptions);

        this.signature = options.signature || '';
    }

    consider(element: IElement): boolean {
        if (!element) {
            console.error('Block tried to consider an undefined element.');
            return false;
        }
        const logger = new Logger().context('ModuleBlock').method('consider');
        logger.log(`Considering element`, element.constructor.name);

        if (element.header.module !== this.header.module) {
            throw new Error(`Element module ${element.header.module} does not match block module ${this.header.module}`);
        }

        if (!element.payload) {
            throw new Error('Element has no payload');
        }
        console.log('element.payload', element.payload);
        const {data} = element.payload;

        const hash = element.toHash('hex');

        data.forEach((stateActions, index) => {
            if (!stateActions.kind) {
                throw new Error('State action has no kind');
            }
            if (!VALID_STATE_ACTIONS_KIND.includes(stateActions.kind)) {
                throw new Error(`Invalid state action kind ${stateActions.kind}`);
            }

            const {type, timestamp} = stateActions;

            const key = `${timestamp}:${type}:${hash}:${index}`;
            logger.log(`Considering key ${key}`);
            this.payload.consider(key);
        });

        return true;
    }

    toBuffer(): Buffer {
        const headerBuffer = this.header.toBuffer();
        const varintHeaderBuffer = encodeVarInt(headerBuffer.length);

        const payloadBuffer = this.payload.toBuffer();
        const varintPayloadBuffer = encodeVarInt(payloadBuffer.length);

        const signatureBuffer = Buffer.from(this.signature, 'hex');

        const buffer = Buffer.concat([varintHeaderBuffer, headerBuffer, varintPayloadBuffer, payloadBuffer, signatureBuffer]);
        return buffer;
    }

    toHex(): string {
        return this.toBuffer().toString('hex');
    }

    static fromHex(hex: string): ModuleBlock {
        const buffer = Buffer.from(hex, 'hex');
        return this.fromBuffer(buffer);
    }

    static fromBuffer(buffer: Buffer): ModuleBlock {
        // let offset = 0;
        //
        // const headerLength = buffer.readInt32BE(offset);
        // offset += 4;
        // const headerBuffer = buffer.subarray(offset, offset + headerLength);
        // const header = ModuleBlockHeader.fromBuffer(headerBuffer);
        // offset += headerLength;
        //
        // const payloadLength = buffer.readInt32BE(offset);
        // offset += 4;
        // const payloadBuffer = buffer.subarray(offset, offset + payloadLength);
        // const payload = ModuleBlockPayload.fromBuffer(payloadBuffer);
        let offset = 0;
        const {
            length: headerLengthBytes,
            value: headerLengthValue
        } = decodeVarInt(buffer);

        offset += headerLengthBytes;
        const headerBuffer = buffer.subarray(offset, offset + Number(headerLengthValue));
        offset += Number(headerLengthValue);

        const {
            length: payloadLengthBytes,
            value: payloadLengthValue
        } = decodeVarInt(buffer.subarray(offset));
        offset += payloadLengthBytes;

        const payloadBuffer = buffer.subarray(offset, offset + Number(payloadLengthValue));

        const header = ModuleBlockHeader.fromBuffer(headerBuffer);
        const payload = ModuleBlockPayload.fromBuffer(payloadBuffer);

        const signature = buffer.subarray(offset + Number(payloadLengthValue)).toString('hex');

        return new ModuleBlock({header, payload, signature});
    }

    toString(): string {
        return this.toBuffer().toString('hex');
    }

    toHash(encoding: BufferEncoding = 'hex'): string | Buffer {
        const headerHash = this.header.toHash();
        const payloadHash = this.payload.toHash();
        const combinedHash = sha256(Buffer.from(headerHash + payloadHash, 'hex'));

        return (encoding === 'hex') ? combinedHash.toString('hex') : combinedHash;
    }

    toJSON(): object {
        return {
            header: this.header.toJSON(),
            payload: this.payload.toJSON(),
            signature: this.signature
        };
    }

    isFrozen(): boolean {
        // Placeholder for isFrozen logic
        return false;
    }

    isOpen() {
        console.log('this.header.timestamp', this.header.timestamp);
        console.log('new Date().getTime()', new Date().getTime());
        console.log('new Date().getTime() - this.header.timestamp', new Date().getTime() - this.header.timestamp);
        console.log('new Date().getTime() - this.header.timestamp < 60000', new Date().getTime() - this.header.timestamp < 60000);
        // return true if block is between timestamp - 1m and timestamp -7 s
        return new Date().getTime() - this.header.timestamp < 60000 && !this.isFrozen() && !this.isVoting();
    }

    isVoting() {
        // return true if block is between timestamp - 5s and timestamp
        return new Date().getTime() - this.header.timestamp < 5000;
    }

    isValid() {
        const logger = new Logger().context('Block').method('isValid');
        logger.log('Checking if block is valid...');

        // TODO:

        return true;
    }

    toDoc(publicKey: any){
        // @ts-ignore
        this._publicKey = publicKey;
        return makeADR36Doc(this, publicKey);
    }

    sign(signer: any): void {
        const privateKey = signer.privateKey;

        const publicKey = secp256k1.getPublicKey(privateKey);
        const doc = this.toDoc(publicKey);
        console.log({doc});
        const escaped = escapeHTML(sortedJsonByKeyStringify(doc));
        const message = Buffer.from(sha256(Buffer.from(escaped))).toString('hex');

        const signature = secp256k1.sign(message, privateKey);

        this.signature = Buffer.from(signature.toCompactRawBytes()).toString('hex');

        console.log('this.signature', this.signature);
    }

    verifySignature(publicKey:any): boolean {
        if(!this.signature){
            throw new Error('Signature is required for verification.');
        }
        if(!publicKey){
            throw new Error('Public key is required for verification.');
        }
        //@ts-ignore
        this._publicKey = publicKey;
        const doc = makeADR36Doc(this, publicKey);
        const escaped = escapeHTML(sortedJsonByKeyStringify(doc));
        const message = Buffer.from(sha256(Buffer.from(escaped))).toString('hex');

        return secp256k1.verify(this.signature, message, publicKey);
    }

}
