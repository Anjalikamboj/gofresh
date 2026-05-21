export type OrderStatus = 'created' | 'blocked' | 'delivered' | 'cancelled';
export interface InventoryCheckItem {
    sku: string;
    required: number;
    available: number;
}
//# sourceMappingURL=order.types.d.ts.map