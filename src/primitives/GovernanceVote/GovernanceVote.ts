import { IGovernanceVoteOptions } from "./interfaces/IGovernanceVoteOptions.js";

class GovernanceVote {
    proposal: string;
    vote: string;
    dao: string;

    constructor(options: IGovernanceVoteOptions) {
        this.proposal = options.proposal;
        this.vote = options.vote;
        this.dao = options.dao;
    }

    toBuffer(): Buffer {
        const dataBuffer = Buffer.from(JSON.stringify(this.toJSON()));
        return Buffer.concat([dataBuffer]);
    }

    toHash(): string {
        return this.toBuffer().toString('hex');
    }

    toJSON(): IGovernanceVoteOptions {
        return {
            proposal: this.proposal,
            vote: this.vote,
            dao: this.dao,
        };
    }
}

export default GovernanceVote;
