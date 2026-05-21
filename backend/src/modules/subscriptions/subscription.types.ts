// ─── Subscription domain types ────────────────────────────────────────────────

export interface SubscriptionItemDto {
  sku: string;
  quantity: number;
}

export interface SubscriptionCreateDto {
  items: SubscriptionItemDto[];
  frequency: 'daily' | 'weekly';
  start_date?: string | Date;
}

export interface SubscriptionUpdateDto {
  status?: 'active' | 'paused';
  items?: SubscriptionItemDto[];
  frequency?: 'daily' | 'weekly';
}
