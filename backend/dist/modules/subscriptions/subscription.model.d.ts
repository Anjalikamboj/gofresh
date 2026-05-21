import { Document, Types } from 'mongoose';
export interface ISubscriptionItem {
    sku: string;
    quantity: number;
}
export interface ISubscription extends Document {
    _id: Types.ObjectId;
    user_id: string;
    items: ISubscriptionItem[];
    frequency: 'daily' | 'weekly';
    start_date: Date;
    next_run_at: Date;
    status: 'active' | 'paused';
    created_at: Date;
}
export declare const SubscriptionModel: import("mongoose").Model<ISubscription, {}, {}, {}, Document<unknown, {}, ISubscription, {}, {}> & ISubscription & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=subscription.model.d.ts.map