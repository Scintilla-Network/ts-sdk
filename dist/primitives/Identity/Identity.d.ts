import { IIdentityOptions } from "./interfaces/IIdentityOptions.js";
import { IRecord, IIdentityRecord } from "./interfaces/IRecord.js";
import { IStore } from "./interfaces/IStore.js";
import { IIdentityMember, IIdentityMembers } from "./interfaces/IIdentityMember.js";
declare class Identity {
    parent: string | null;
    moniker: string;
    records: IRecord | IIdentityRecord;
    members: IIdentityMembers;
    childs: string[];
    constructor(options?: IIdentityOptions);
    private setMoniker;
    getMember(identifier: string): IIdentityMember | null;
    setMember(member: IIdentityMember): void;
    setRecord(key: string, value: any): void;
    addChild(element: any): void;
    getFullMoniker(): string;
    toStore(): IStore;
    toJSON(): IIdentityOptions;
}
export default Identity;
//# sourceMappingURL=Identity.d.ts.map