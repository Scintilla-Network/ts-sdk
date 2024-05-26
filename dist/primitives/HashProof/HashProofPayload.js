import sortedJsonByKeyStringify from "../../utils/sortedJsonByKeyStringify.js";
import Transition from "../Transition/Transition.js";
import Transfer from "../Transfer/Transfer.js";
import Transaction from "../Transaction/Transaction.js";
class HashProofPayload {
    constructor(options) {
        var _a;
        this.data = (_a = options.data) !== null && _a !== void 0 ? _a : [];
    }
    consider(element) {
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
    insertionSortByTimestamp(data) {
        for (let i = 1; i < data.length; i++) {
            let j = i;
            while (j > 0 && data[j - 1].timestamp > data[j].timestamp) {
                [data[j], data[j - 1]] = [data[j - 1], data[j]];
                j--;
            }
        }
    }
    toBuffer() {
        const lengthBuffer = Buffer.alloc(4);
        if (this.data.length > 1000000) {
            throw new Error('Unusually large data');
        }
        const stringified = sortedJsonByKeyStringify(this.data);
        const dataBuffer = Buffer.from(stringified);
        lengthBuffer.writeInt32BE(dataBuffer.length);
        return Buffer.concat([lengthBuffer, dataBuffer]);
    }
    toHash() {
        return this.toBuffer().toString('hex');
    }
    static fromHex(hex) {
        const buffer = Buffer.from(hex, 'hex');
        return this.fromBuffer(buffer);
    }
    static fromBuffer(buffer) {
        try {
            const length = buffer.readInt32BE(0);
            const data = JSON.parse(buffer.subarray(4, 4 + length).toString('utf8'));
            // For each data element, we need to convert to its respective class based on the kind
            const elements = data.map((element) => {
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
            return new HashProofPayload({ data: elements });
        }
        catch (e) {
            console.error(e);
            console.error(buffer.subarray(0, -2).toString('utf8'));
            throw new Error('Failed to parse HashProofPayload from buffer');
        }
    }
    toJSON() {
        return {
            data: this.data
        };
    }
}
export default HashProofPayload;
//# sourceMappingURL=HashProofPayload.js.map