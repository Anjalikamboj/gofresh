import { ISubscription } from './subscription.model';
import { SubscriptionCreateDto, SubscriptionUpdateDto } from './subscription.types';
type SubscriptionJSON = ReturnType<ISubscription['toJSON']>;
export declare function listSubscriptions(userId: string): Promise<SubscriptionJSON[]>;
export declare function getSubscription(subscriptionId: string, userId: string): Promise<SubscriptionJSON>;
export declare function createSubscription(userId: string, dto: SubscriptionCreateDto): Promise<SubscriptionJSON>;
export declare function updateSubscription(subscriptionId: string, userId: string, dto: SubscriptionUpdateDto): Promise<SubscriptionJSON>;
export declare function deleteSubscription(subscriptionId: string, userId: string): Promise<{
    message: string;
}>;
export {};
//# sourceMappingURL=subscription.service.d.ts.map