import { IPeerInfoMessageOptions } from "./interfaces/IPeerInfoMessageOptions.js";
import { NetMessage } from "../NetMessage/NetMessage.js";
export declare class PeerInfoMessage {
    identity: {
        moniker: string;
    };
    modules: any[];
    score: number;
    constructor({ identity, modules, score }?: IPeerInfoMessageOptions);
    toMessage(props?: {}): NetMessage;
}
export default PeerInfoMessage;
//# sourceMappingURL=PeerInfoMessage.d.ts.map