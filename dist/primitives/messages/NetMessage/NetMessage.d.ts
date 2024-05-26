/// <reference types="node" />
import { Buffer } from 'buffer';
import { NET_KINDS } from "./NET_KINDS.js";
import { INetMessageOptions } from "./interfaces/INetMessageOptions.js";
export declare class NetMessage {
    static NET_KINDS: typeof NET_KINDS;
    chain: Buffer;
    kind: keyof typeof NET_KINDS;
    module: string;
    payload: Buffer | null;
    length: number;
    constructor(props?: INetMessageOptions);
    setPayload(payload: Buffer | null): void;
    toHex(): string;
    static fromHex(hex: string): NetMessage;
    toBuffer(): Buffer;
    static fromBuffer(buffer: Buffer): NetMessage;
    toHash(): string;
}
export default NetMessage;
//# sourceMappingURL=NetMessage.d.ts.map