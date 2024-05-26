import { Buffer } from 'buffer';
import { NetMessage } from "../NetMessage/NetMessage.js";
export class PeerInfoMessage {
    constructor({ identity = { moniker: 'unknown' }, modules = [], score = 0 } = {}) {
        this.identity = identity;
        this.modules = modules;
        this.score = score;
    }
    toMessage(props = {}) {
        return new NetMessage(Object.assign({ kind: 'PEER_INFO', payload: Buffer.from(JSON.stringify({
                identity: this.identity,
                modules: this.modules,
                score: this.score
            }), 'utf-8') }, props));
    }
}
export default PeerInfoMessage;
//# sourceMappingURL=PeerInfoMessage.js.map