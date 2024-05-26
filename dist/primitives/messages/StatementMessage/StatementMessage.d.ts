import { IStatementMessageOptions } from "./interfaces/IStatementMessageOptions.js";
import { ISigner } from "./interfaces/ISigner.js";
import { NetMessage } from "../NetMessage/NetMessage.js";
export declare class StatementMessage {
    identifier: string | null;
    key: string | null;
    type: string;
    kind: string | null;
    data: any | null;
    origin: string | null;
    vote: string | null;
    signer: string | null;
    signature: string | null;
    constructor({ identifier, key, type, data, kind, signer, origin, vote, signature, }?: IStatementMessageOptions);
    sign(signer: ISigner): StatementMessage;
    toJSON(): object;
    generateIdentifier(): string;
    static fromMessage(message: NetMessage): StatementMessage;
    toMessage(): NetMessage;
}
export default StatementMessage;
//# sourceMappingURL=StatementMessage.d.ts.map