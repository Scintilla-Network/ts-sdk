import { IRecord } from "./IRecord.js";
import { IIdentityMembers } from "./IIdentityMember.js";
export interface IIdentityOptions {
    parent?: string | null;
    childs?: (string)[];
    moniker?: string;
    members?: IIdentityMembers;
    records?: IRecord;
}
//# sourceMappingURL=IIdentityOptions.d.ts.map