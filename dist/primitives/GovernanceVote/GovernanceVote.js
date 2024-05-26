class GovernanceVote {
    constructor(options) {
        this.proposal = options.proposal;
        this.vote = options.vote;
        this.dao = options.dao;
    }
    toBuffer() {
        const dataBuffer = Buffer.from(JSON.stringify(this.toJSON()));
        return Buffer.concat([dataBuffer]);
    }
    toHash() {
        return this.toBuffer().toString('hex');
    }
    toJSON() {
        return {
            proposal: this.proposal,
            vote: this.vote,
            dao: this.dao,
        };
    }
}
export default GovernanceVote;
//# sourceMappingURL=GovernanceVote.js.map