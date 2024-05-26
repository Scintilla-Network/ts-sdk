import { sha256 } from "../../utils/hash.js";
class GovernanceProposal {
    constructor(options) {
        var _a, _b, _c, _d, _e;
        this.title = options.title;
        this.description = options.description;
        this.funding = options.funding;
        if (options.funding && !options.funding.recipient) {
            throw new Error('GovernanceProposal with funding must have a recipient');
        }
        this.rules = (_a = options.rules) !== null && _a !== void 0 ? _a : [{ kind: 'type', options: ['yes', 'no', 'abstain'], value: 'oneOf' }];
        this.status = (_b = options.status) !== null && _b !== void 0 ? _b : 'proposed';
        this.votes = (_c = options.votes) !== null && _c !== void 0 ? _c : [];
        this.totalVotes = (_d = options.totalVotes) !== null && _d !== void 0 ? _d : 0;
        this.startDate = options.startDate;
        this.endDate = options.endDate;
        if (!this.endDate) {
            throw new Error('GovernanceProposal must have an end date');
        }
        this.proposer = options.proposer;
        this.dao = options.dao;
        this.hash = (_e = options.hash) !== null && _e !== void 0 ? _e : null;
        if (!this.hash) {
            this.hash = generateHash(this);
        }
    }
    considerVote({ vote, voter, votingPower }) {
        if (this.votes.find(v => v.voter === voter)) {
            // remove previous vote
            this.votes = this.votes.filter(v => v.voter !== voter);
        }
        const normalizeVotingPower = Math.abs(votingPower);
        this.votes.push({ vote, voter, votingPower: normalizeVotingPower });
        this.totalVotes += normalizeVotingPower;
    }
    toBuffer() {
        return Buffer.from(JSON.stringify(this.toJSON()));
    }
    toJSON() {
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
function generateHash(proposal) {
    return sha256(proposal.toBuffer()).toString('hex');
}
export default GovernanceProposal;
//# sourceMappingURL=GovernanceProposal.js.map