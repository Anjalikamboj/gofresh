import { Document, Types } from 'mongoose';
import { ISubscriptionItem } from '../subscriptions/subscription.model';
import { OrderStatus, InventoryCheckItem } from './order.types';
export interface IOrder extends Document {
    _id: Types.ObjectId;
    subscription_id: string;
    user_id: string;
    items: ISubscriptionItem[];
    scheduled_for: Date;
    status: OrderStatus;
    reason?: string;
    inventory_check?: InventoryCheckItem[];
    created_at: Date;
}
export declare const OrderModel: import("mongoose").Model<IOrder, {}, {}, {}, Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=order.model.d.ts.map