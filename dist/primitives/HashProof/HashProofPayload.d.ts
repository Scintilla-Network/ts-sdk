/// <reference types="node" />
import { IHashProofPayloadElement } from "./interfaces/IHashProofPayloadElement.js";
import { IHashProofPayloadOptions } from "./interfaces/IHashProofPayloadOptions.js";
declare class HashProofPayload {
    data: IHashProofPayloadElement[];
    constructor(options: IHashProofPayloadOptions);
    consider(element: IHashProofPayloadElement | null): void;
    private insertionSortByTimestamp;
    toBuffer(): Buffer;
    toHash(): string;
    static fromHex(hex: string): HashProofPayload | undefined;
    static fromBuffer(buffer: Buffer): HashProofPayload;
    toJSON(): {
        data: IHashProofPayloadElement[];
    };
}
export default HashProofPayload;
//# sourceMappingURL=HashProofPayload.d.ts.map