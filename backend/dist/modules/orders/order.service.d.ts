import { IOrder } from './order.model';
type OrderJSON = ReturnType<IOrder['toJSON']>;
export declare function listOrders(userStubId?: string): Promise<OrderJSON[]>;
export declare function getOrder(orderId: string): Promise<OrderJSON>;
export declare function updateOrderStatus(orderId: string, status: string): Promise<OrderJSON>;
export {};
//# sourceMappingURL=order.service.d.ts.map