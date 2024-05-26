import { IDAOOptions } from "./interfaces/IDAOOptions.js";
import { IDAOMember, IDAOMembers } from "./interfaces/IDAOMember.js";
import { IStore } from "../Identity/interfaces/IStore.js";
declare class DAO {
    moniker: string | undefined;
    rules: Record<string, any>;
    records: Record<string, any>;
    members: IDAOMembers;
    constructor(options?: IDAOOptions);
    private setMoniker;
    getMember(identityName: string): {
        votingPower: number;
        nonVotingPower: number;
        moniker: string;
    } | null;
    setMember(identityName: string, nonVotingPower: number, votingPower: number): void;
    set(key: string, value: any): void;
    toStore(): IStore;
    toJSON(): {
        moniker: string | undefined;
        rules: Record<string, any>;
        records: Record<string, any>;
        members: IDAOMember[];
    };
}
export default DAO;
//# sourceMappingURL=DAO.d.ts.map