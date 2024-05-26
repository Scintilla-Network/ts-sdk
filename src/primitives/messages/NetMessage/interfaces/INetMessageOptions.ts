import { Buffer } from 'buffer';
import { NET_KINDS } from '../NET_KINDS.js';

export interface INetMessageOptions {
    module?: string | null;
    chain?: Buffer;
    kind?: keyof typeof NET_KINDS;
    payload?: Buffer | null;
}
