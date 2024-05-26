// src/primitives/Transition/Transition.ts
import { sha256 } from "../../utils/hash.js";
import {ITransitionOptions} from "./interfaces/ITransitionOptions.js";
import {secp256k1} from "@noble/curves/secp256k1";
import makeADR36Doc from "../../utils/makeADR36Doc.js";
import sortedJsonByKeyStringify from "../../utils/sortedJsonByKeyStringify.js";
import escapeHTML from "../../utils/escapeHTML.js";
import {ITransitionAuthorization} from "./interfaces/ITransitionAuthorization.js";
import {ITransitionFee} from "./interfaces/ITransitionFee.js";
import {ITransactionAuthorization} from "../Transaction/interfaces/ITransactionAuthorization.js";
import * as console from "console";
export class Transition {
    kind: string = 'TRANSITION';

    module: string | null;
    action: string | null;
    type: string | null;
    data: object;
    timestamp: number;

    authorizations: ITransitionAuthorization[];
    fees: ITransitionFee[];

    constructor(props: ITransitionOptions = {}) {
        console.log({props});
        this.module = props.module || null;
        this.action = props.action || null;
        this.type = props.type || null;
        this.data = props.data || {};
        this.timestamp = props.timestamp || Date.now();

        this.authorizations = props.authorizations || [];
        this.fees = props.fees || [];
    }

    computeHash(): string {
        console.log('dataBuffer', this)
        const stringified = sortedJsonByKeyStringify(this);
        const dataBuffer = Buffer.from(stringified, 'utf-8');
        const hash = Buffer.from(sha256(dataBuffer));
        return hash.toString('hex');
    }

    toBuffer({excludeAuthorization = false}: { excludeAuthorization?: boolean } = {}): Buffer {
        const data = this.toJSON({excludeAuthorization});
        return Buffer.from(sortedJsonByKeyStringify(data));
    }


    static fromBuffer(buffer: Buffer): Transition {
        const data = JSON.parse(buffer.toString('utf-8'));
        return new Transition(data);
    }

    toHex({excludeAuthorization = false}: { excludeAuthorization?: boolean } = {}): string {
        return this.toBuffer({excludeAuthorization}).toString('hex');
    }

    toUInt8Array({excludeAuthorization = false}: { excludeAuthorization?: boolean } = {}): Uint8Array {
        return Uint8Array.from(Buffer.from(this.toHex({excludeAuthorization}), 'hex'));
    }

    toHash(encoding: BufferEncoding = 'hex'): string {
        const buffer = this.toBuffer();
        return sha256(buffer).toString(encoding);
    }

    toJSON({excludeAuthorization = false}: { excludeAuthorization?: boolean } = {}): object {
        const obj = {
            kind: this.kind,
            module: this.module,
            action: this.action,
            type: this.type,
            data: this.data,
            timestamp: this.timestamp,
            fees: this.fees,
        };

        if (!excludeAuthorization) {
            // @ts-ignore
            obj['authorizations'] = this.authorizations;
        }

        return obj;
    }

    addAuthorization(authorization: ITransactionAuthorization): void {
        if(authorization.signature === '' || authorization.signature === undefined){
            throw new Error('Signature is required for authorization.');
        }
        this.authorizations.push(authorization);
    }
    verifySignature(signer?: any): boolean {
        // get first signature from authorizations
        console.log(this.authorizations.length, 'authorizations')
        const valid = this.authorizations.every(authorization => {
            const signature = authorization.signature;
            if (!signature) {
                throw new Error('Signature is required for verification.');
            }

            const publicKey = authorization?.publicKey || signer?.getPublicKey();
            if (!publicKey) {
                throw new Error('Public key is required for verification.');
            }

            const signableMessage = this.toSignableMessage(publicKey);
            console.log({signableMessage})

            const signableMessageBuffer = Buffer.from(signableMessage, 'utf-8');

            const hashedMessage = sha256(signableMessageBuffer).toString('hex');
            console.log('signature', signature, 'hashedMessage', hashedMessage, 'publicKey', publicKey);

            const valid = secp256k1.verify(signature, hashedMessage, publicKey);
            console.log('valid', valid);
            return valid;
        });

        return valid;
    }

    getPublicKey(): string | undefined {
        return this.authorizations?.[0]?.publicKey;
    }
    toDoc(publicKey: string) {
        const doc = makeADR36Doc(this, publicKey);
        return doc;
    }

    toBase64(): string {
        return this.toBuffer().toString('base64');
    }
    toSignableMessage(publicKey: any): any {
        const doc = this.toDoc(publicKey);
        const escaped = escapeHTML(sortedJsonByKeyStringify(doc));
        return escaped
    }
    async sign(signer: any): Promise<void> {
        const message = this.toUInt8Array({excludeAuthorization: true});
        const [signature, publicKey] = await signer.signMessageWithSecp256k1(message);

        const authorization = {
            signature,
        } as ITransitionAuthorization;

        const moniker = signer?.getMoniker();
        if(moniker){
            // We could omit it, but let's keep it for now
            authorization.publicKey = publicKey;
            authorization.moniker = signer.moniker;
        } else {
            authorization.publicKey = publicKey;
            authorization.address = signer.toAddress();
        }

        this.addAuthorization(authorization);
    }

    validate(): {error: string, valid: boolean} {
        if (!this.authorizations) return {valid: false, error: 'Authorizations are required.'};
        if (!this.authorizations[0].signature) return {valid: false, error: 'Signature is required.'};
        if (!this.authorizations[0].publicKey) return {valid: false, error: 'Public key is required.'};

        if (!this.verifySignature()) return {valid: false,error: 'Invalid signature.'};
        return {valid: true, error: ''};
    }

    isValid(): boolean {
        const {valid} = this.validate();
        return valid;
    }
}

export default Transition;
