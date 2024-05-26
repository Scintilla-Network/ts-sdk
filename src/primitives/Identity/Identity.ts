import { IIdentityOptions } from "./interfaces/IIdentityOptions.js";
import { IRecord,IIdentityRecord } from "./interfaces/IRecord.js";
import { IStore } from "./interfaces/IStore.js";
import {IIdentityMember, IIdentityMembers} from "./interfaces/IIdentityMember.js";
import console from "console";

// Maximum length of a moniker is 64 characters
class Identity {
    parent: string | null;
    moniker: string;
    records: IRecord | IIdentityRecord;
    members: IIdentityMembers;
    childs: string[] = [];

    constructor(options: IIdentityOptions = {}) {
        // very like we are trying to create a 'sct' parent, but null might be passed as value, so we need to check for undefined
        this.parent = options.parent || (options.parent === undefined ? 'sct' : null); // default parent is 'sct'
        this.moniker = this.setMoniker(options.moniker) || '';
        this.records = options.records || {};

        this.members = [] as IIdentityMembers;
        options.members?.forEach(member => this.setMember(member));

        this.childs = options.childs || [];
    }

    private setMoniker(moniker?: string): string | undefined {
        const monikerRegex = /^[a-z0-9_-]+$/;
        // If moniker is alphanumeric, hyphens, or underscores and not exceed 64 characters
        // Due to the way identity can transact, null parent and 'sct...' moniker are not allowed.
        // For now, the whole 'parent' field is limited for now.
        if (moniker && moniker.match(monikerRegex)) {
            return moniker.substring(0, 64);
        }
        // If moniker contains dots, and parent is not set, split the moniker
        if (moniker && moniker.includes('.')) {
            const parts = moniker.split('.');
            const monikerPart = parts[parts.length - 1];
            const parentParts = parts.slice(0, -1).join('.');
            if(!monikerPart.match(monikerRegex)) {
                throw new Error(`Moniker must be alphanumeric, hyphens, or underscores and not exceed 64 characters - ${monikerPart}`);
            }
            // Can have multiple levels of parent (e.g. parent.parent.moniker - dot separated so we allow dots in parent)
            if(!parentParts.match(monikerRegex)) {
                throw new Error(`Parent moniker must be alphanumeric, hyphens, or underscores and not exceed 64 characters - ${parentParts}`);
            }

            if(this.parent) {
                // Check if parent is set and matches the parent in the moniker
                if(this.parent !== parentParts) {
                    console.warn(`Parent moniker does not match moniker - ${this.parent} !== ${parentParts} - overwriting parent to ${parentParts}`);
                }
            }
            this.parent = parentParts;
            return monikerPart.substring(0, 64);
        }

        throw new Error(`Moniker must be alphanumeric, hyphens, or underscores and not exceed 64 characters - ${moniker}`);
    }

    public getMember(identifier: string): IIdentityMember | null {
        const findMember = this.members.find(member => member[0] === identifier);
        if (findMember) {
            const [identifier, ownerWeight, spendWeight, stakeWeight, proposeWeight, voteWeight, operateWeight] = findMember;
            return [identifier, ownerWeight, spendWeight, stakeWeight, proposeWeight, voteWeight, operateWeight];
        }
        return null;

    }

    public setMember(member: IIdentityMember): void {
        // We are still pondering if we should reinitiate the non-voting power down below.
        // It has the equivalent of a distribution value (no right, but still involved to distribution of rewards - such as a stakeWeight not a stakePermitWeight)
        // Every value down velow will now be used as a PermitWeight in certain cases (permit to vote, permit to propose, permit to operate, while that non-voting power is more an entitlement to a share of the rewards)
        // For now, we will intend that a records['modules']['core.banking']['stake'] can be used instead.

        // member is [identifier, ownerWeight, spendWeight, stakeWeigth, proposeWeight, voteWeight, operateWeight]
        let [ identifier, ownerWeight, spendWeight, stakeWeight, proposeWeight, voteWeight, operateWeight] = member;

        console.log('member', member,[ identifier, ownerWeight, spendWeight, stakeWeight, proposeWeight, voteWeight, operateWeight]);
        const findMember = this.members.find(member => member[0] === identifier);

        // Member weights are always positive numbers and are optionals. If specific not set, it is equals to the previous set value. If none set, it is equals to 1.
        // and that powers are always positive numbers
        // pubkey = pubkey ? pubkey : findMember ? findMember[1] : '';
        ownerWeight = ownerWeight ? Math.abs(ownerWeight) : findMember ? findMember[1] : 0;
        spendWeight = spendWeight ? Math.abs(spendWeight) : findMember ? findMember[2] : 0;
        stakeWeight = stakeWeight ? Math.abs(stakeWeight) : findMember ? findMember[3] : 0;
        proposeWeight = proposeWeight ? Math.abs(proposeWeight) : findMember ? findMember[4] : 0;
        voteWeight = voteWeight ? Math.abs(voteWeight) : findMember ? findMember[5] : 0;
        operateWeight = operateWeight ? Math.abs(operateWeight) : findMember ? findMember[6] : 0;

        if (findMember) {
            this.members.splice(this.members.indexOf(findMember), 1, [identifier, ownerWeight, spendWeight, stakeWeight, proposeWeight, voteWeight, operateWeight]);
        } else {
            this.members.push([identifier, ownerWeight, spendWeight, stakeWeight, proposeWeight, voteWeight, operateWeight]);
        }
        // Normalize that member are always sorted by identifier
        this.members.sort((a, b) => a[0].localeCompare(b[0]));
    }

    public setRecord(key: string, value: any): void {
        const keys = key.split('.');
        let current: IRecord | any = this.records;

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

    // Add a child's moniker to the identity
    public addChild(element: any): void {
        const isIdentity = element.hasOwnProperty('moniker') && element.hasOwnProperty('members') && element.hasOwnProperty('records');
        if(!isIdentity) {
            throw new Error('Element is not an Identity');
        }

        if (this.childs.find(moniker => moniker === element.moniker)) {
            throw new Error(`Child with moniker ${element.moniker} already exists`);
        }

        this.childs.push(element.moniker);
    }

    public getFullMoniker(): string {
        return this.parent ? `${this.parent}.${this.moniker}` : this.moniker;
    }
    public toStore(): IStore {
        const store = {} as IStore;

        // Store in .identity all but childs to which we only pin the moniker as a list.
        // Childs are stored in their own files
        store[`/${this.getFullMoniker()}/.identity.json`] = JSON.stringify(this) as IIdentityOptions;

        return store;
    }

    public toJSON(): IIdentityOptions {
        return {
            parent: this.parent,
            moniker: this.moniker,
            members: this.members,
            records: this.records,
            childs: this.childs,
        };
    }
}

export default Identity;
