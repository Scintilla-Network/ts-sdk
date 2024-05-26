class DAO {
    constructor(options) {
        this.members = [];
        this.moniker = this.setMoniker(options === null || options === void 0 ? void 0 : options.moniker);
        this.rules = (options === null || options === void 0 ? void 0 : options.rules) || {};
        this.records = (options === null || options === void 0 ? void 0 : options.records) || {};
        this.members = (options === null || options === void 0 ? void 0 : options.members) || [['core', 1000, 1000, ['propose', 'vote']]];
        // Normalize that member are always sorted by moniker and votingPower and nonVotingPower are always positive numbers
        this.members.sort((a, b) => a[0].localeCompare(b[0]));
        this.members = this.members.map(member => [member[0], Math.abs(member[1]), Math.abs(member[2])]);
    }
    setMoniker(moniker = '') {
        if (moniker.match(/^[a-z0-9_-]+$/)) {
            return moniker.substring(0, 64);
        }
        return undefined;
    }
    getMember(identityName) {
        const findMember = this.members.find(member => member[0] === identityName);
        if (findMember) {
            return {
                moniker: findMember[0],
                nonVotingPower: findMember[1],
                votingPower: findMember[2]
            };
        }
        return null;
    }
    setMember(identityName, nonVotingPower, votingPower) {
        const findMember = this.members.find(member => member[0] === identityName);
        if (findMember) {
            findMember[1] = nonVotingPower;
            findMember[2] = votingPower;
        }
        else {
            this.members.push([identityName, nonVotingPower, votingPower]);
        }
    }
    set(key, value) {
        const keys = key.split('.');
        let current = this.records;
        // Navigate/create structure for nested keys
        keys.slice(0, -1).forEach(part => {
            if (!current[part]) {
                current[part] = {};
            }
            current = current[part];
        });
        // Set value at the correct location
        current[keys[keys.length - 1]] = value;
    }
    toStore() {
        var _a;
        const RECORD_PROPERTY_HAS_FILE = 1;
        const recurse = (obj, path, output = {}) => {
            Object.entries(obj).forEach(([key, value]) => {
                const newPath = `${path}/${key}.json`;
                if (Array.isArray(value)) {
                    if (!output[path]) {
                        output[path] = { records: {} };
                    }
                    output[path].records[key] = value.map(item => {
                        if (typeof item === 'object' && item !== null) {
                            return Object.assign({}, item);
                        }
                        return item;
                    });
                }
                else if (typeof value === 'object' && value !== null) {
                    if (!output[path]) {
                        output[path] = { records: {} };
                    }
                    output[path].records[`_${key}`] = RECORD_PROPERTY_HAS_FILE;
                    recurse(value, newPath, output);
                }
                else {
                    if (!output[path]) {
                        output[path] = { records: {} };
                    }
                    output[path].records[key] = value;
                }
            });
            return output;
        };
        const store = recurse(this.records, `/${this.moniker}`);
        store[`/${this.moniker}/dao.json`] = {
            moniker: this.moniker,
            records: Object.assign({}, (_a = store[`/${this.moniker}`]) === null || _a === void 0 ? void 0 : _a.records)
        };
        delete store[`/${this.moniker}`];
        return store;
    }
    toJSON() {
        return {
            moniker: this.moniker,
            rules: this.rules,
            records: this.records,
            members: this.members
        };
    }
}
export default DAO;
//# sourceMappingURL=DAO.js.map