import {sha256} from "../../utils/hash.js";
import {secp256k1} from "@noble/curves/secp256k1";
import {ITransferOptions} from "./interfaces/ITransferOptions.js";
import escapeHTML from "../../utils/escapeHTML.js";
import sortedJsonByKeyStringify from "../../utils/sortedJsonByKeyStringify.js";
import makeADR36Doc from "../../utils/makeADR36Doc.js";
import {ITransferAuthorization} from "./interfaces/ITransferAuthorization.js";
import {ITransferFee} from "./interfaces/ITransferFee.js";
import {ITransactionAuthorization} from "../Transaction/interfaces/ITransactionAuthorization.js";
import * as console from "console";

export class Transfer {
    kind: string = 'TRANSFER';

    module: string | null;
    action: string | null;
    type: string | null;
    data: object;
    timestamp: number;
    sender: string | null;

    authorizations: ITransferAuthorization[];
    fees: ITransferFee[];

    constructor(props: ITransferOptions = {}) {
        this.module = props.module || null;
        this.action = props.action || null;
        this.type = props.type || null;
        this.data = props.data || {};
        this.timestamp = props.timestamp || Date.now();

        this.sender = props.sender || null;

        this.authorizations = props.authorizations || [];
        this.fees = props.fees || [];
    }

    computeHash(): string {
        const stringified = JSON.stringify(this);
        const dataAsBuffer = Buffer.from(stringified, 'utf-8');
        const hash = Buffer.from(sha256(dataAsBuffer));
        return hash.toString('hex');
    }

    toBuffer({excludeAuthorization = false}: { excludeAuthorization?: boolean } = {}): Buffer {
        const data = this.toJSON({excludeAuthorization});
        return Buffer.from(JSON.stringify(data));
    }

    static fromBuffer(buffer: Buffer): Transfer {
        const data = JSON.parse(buffer.toString('utf-8'));
        return new Transfer(data);
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
            sender: this.sender,
            fees: this.fees,
        };

        if (!excludeAuthorization) {
            // @ts-ignore
            obj['authorizations'] = this.authorizations;
        }

        return obj;
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

    addAuthorization(authorization: ITransactionAuthorization): void {
        if (authorization.signature === '' || authorization.signature === undefined) {
            throw new Error('Signature is required for authorization.');
        }
        this.authorizations.push(authorization);
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
            publicKey
        } as ITransactionAuthorization;

        if(signer?.getMoniker()){
            authorization.moniker = signer.getMoniker();
        }

        this.addAuthorization(authorization);
    }

    isValid(): boolean | { error: string } {
        if (!this.sender) return {error: 'Sender is required.'};
        if (!this.authorizations) return {error: 'Authorizations are required.'};
        if (!this.authorizations[0].signature) return {error: 'Signature is required.'};
        if (!this.authorizations[0].publicKey) return {error: 'Public key is required.'};

        if (!this.verifySignature()) return {error: 'Invalid signature.'};
        return true;
    }
}

export default Transfer;
