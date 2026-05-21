// ─── Order domain types ───────────────────────────────────────────────────────

export type OrderStatus = 'created' | 'blocked' | 'delivered' | 'cancelled';

export interface InventoryCheckItem {
  sku: string;
  required: number;
  available: number;
}
