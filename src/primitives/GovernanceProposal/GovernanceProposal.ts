import { sha256 } from "../../utils/hash.js";
import {IGovernanceProposalFunding} from "./interfaces/IGovernanceProposalFunding.js";
import {IGovernanceProposalOptions} from "./interfaces/IGovernanceProposalOptions.js";
import { IGovernanceVote } from "./interfaces/IGovernanceVote.js";
import {IGovernanceProposalRules} from "./interfaces/IGovernanceProposalRules.js";

class GovernanceProposal {
    hash: string | null;
    title: string;
    description: string;
    funding?: IGovernanceProposalFunding;
    status: string;
    votes: IGovernanceVote[];
    totalVotes: number;
    startDate?: number;
    endDate: number;
    proposer?: string;
    dao: string;
    rules: IGovernanceProposalRules[] | { kind: string; options?: string[], value: string }[];

    constructor(options: IGovernanceProposalOptions) {
        this.title = options.title;
        this.description = options.description;
        this.funding = options.funding;
        if (options.funding && !options.funding.recipient) {
            throw new Error('GovernanceProposal with funding must have a recipient');
        }

        this.rules = options.rules ?? [{ kind: 'type', options: ['yes', 'no', 'abstain'], value: 'oneOf' }];

        this.status = options.status ?? 'proposed';
        this.votes = options.votes ?? [];
        this.totalVotes = options.totalVotes ?? 0;
        this.startDate = options.startDate;
        this.endDate = options.endDate;
        if (!this.endDate) {
            throw new Error('GovernanceProposal must have an end date');
        }
        this.proposer = options.proposer;
        this.dao = options.dao;
        this.hash = options.hash ?? null;
        if (!this.hash) {
            this.hash = generateHash(this);
        }
    }

    considerVote({ vote, voter, votingPower }: { vote: string; voter: string; votingPower: number; }) {
        if(this.votes.find(v => v.voter === voter)) {
            // remove previous vote
            this.votes = this.votes.filter(v => v.voter !== voter);
        }
        const normalizeVotingPower = Math.abs(votingPower);
        this.votes.push({ vote, voter, votingPower:normalizeVotingPower });
        this.totalVotes += normalizeVotingPower;
    }

    toBuffer(): Buffer {
        return Buffer.from(JSON.stringify(this.toJSON()));
    }

    toJSON(): IGovernanceProposalOptions {
        return {
            hash: this.hash,
            title: this.title,
            description: this.description,
            funding: this.funding,
            status: this.status,
            votes: this.votes,
            rules: this.rules,
            totalVotes: this.totalVotes,
            startDate: this.startDate,
            endDate: this.endDate,
            proposer: this.proposer,
            dao: this.dao,
        };
    }
}

function generateHash(proposal: GovernanceProposal): string {
    return sha256(proposal.toBuffer()).toString('hex');
}

export default GovernanceProposal;
