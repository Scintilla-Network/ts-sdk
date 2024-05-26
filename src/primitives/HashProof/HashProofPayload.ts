import { IHashProofPayloadElement } from "./interfaces/IHashProofPayloadElement.js";
import {IHashProofPayloadOptions} from "./interfaces/IHashProofPayloadOptions.js";
import sortedJsonByKeyStringify from "../../utils/sortedJsonByKeyStringify.js";
import Transition from "../Transition/Transition.js";
import Transfer from "../Transfer/Transfer.js";
import Transaction from "../Transaction/Transaction.js";

class HashProofPayload {
    public data: IHashProofPayloadElement[];
    constructor(options: IHashProofPayloadOptions) {
        this.data = options.data ?? [];
    }

    consider(element: IHashProofPayloadElement | null): void {
        if (!element) {
            console.error('BlockData tried to consider an undefined element.');
            return;
        }
        const { type, kind } = element;
        if (!type || !kind) {
            console.error('Element has no type or kind');
            return;
        }

        if (["TRANSACTION", "TRANSITION", "TRANSFER"].includes(kind)) {
            this.data.push(element);
            // Optimization: Consider sorting only when necessary, not on every insert
            if (this.data.length > 1) {
                // Assuming elements are mostly in order, insertion sort might be more efficient
                this.insertionSortByTimestamp(this.data);
            }
        }
    }

    private insertionSortByTimestamp(data: IHashProofPayloadElement[]): void {
        for (let i = 1; i < data.length; i++) {
            let j = i;
            while (j > 0 && data[j - 1].timestamp > data[j].timestamp) {
                [data[j], data[j - 1]] = [data[j - 1], data[j]];
                j--;
            }
        }
    }

    toBuffer(): Buffer {
        const lengthBuffer = Buffer.alloc(4);
        if (this.data.length > 1_000_000) {
            throw new Error('Unusually large data');
        }
        const stringified = sortedJsonByKeyStringify(this.data);
        const dataBuffer = Buffer.from(stringified);
        lengthBuffer.writeInt32BE(dataBuffer.length);
        return Buffer.concat([lengthBuffer, dataBuffer]);
    }

    toHash(): string {
        return this.toBuffer().toString('hex');
    }

    static fromHex(hex: string): HashProofPayload | undefined {
        const buffer = Buffer.from(hex, 'hex');
        return this.fromBuffer(buffer);
    }

    static fromBuffer(buffer: Buffer): HashProofPayload {
        try {
            const length = buffer.readInt32BE(0);
            const data = JSON.parse(buffer.subarray(4, 4 + length).toString('utf8'));

            // For each data element, we need to convert to its respective class based on the kind
            const elements = data.map((element: IHashProofPayloadElement) => {
                switch (element.kind) {
                    case 'TRANSITION':
                        return new Transition(element);
                    case 'TRANSFER':
                        return new Transfer(element);
                    case 'TRANSACTION':
                        return new Transaction(element);
                    default:
                        throw new Error('Unknown kind');
                }
            });

            return new HashProofPayload({ data:elements });
        } catch (e) {
            console.error(e);
            console.error(buffer.subarray(0, -2).toString('utf8'));
            throw new Error('Failed to parse HashProofPayload from buffer');
        }
    }

    toJSON(): { data: IHashProofPayloadElement[] } {
        return {
            data: this.data
        };
    }
}

export default HashProofPayload;
