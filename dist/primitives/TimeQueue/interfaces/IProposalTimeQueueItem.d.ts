import { ITimeQueueItem } from "./ITimeQueueItem.js";
export interface IProposalTimeQueueItem extends ITimeQueueItem {
    payload: {
        startDate: Date;
        endDate: number;
    };
}
//# sourceMappingURL=IProposalTimeQueueItem.d.ts.map