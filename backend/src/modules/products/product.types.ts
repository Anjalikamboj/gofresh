// ─── Product domain types ─────────────────────────────────────────────────────

export interface ProductCreateDto {
  sku: string;
  name: string;
  unit: string;
  price: number;
  stock_on_hand: number;
  image_url?: string;
  description?: string;
  benefits?: string[];
  storage?: string;
}

/** PATCH /api/products/:id — only updates stock */
export interface ProductStockUpdateDto {
  stock_on_hand: number;
}

/** PUT /api/products/:id — full partial update of all editable fields */
export interface ProductFullUpdateDto {
  name?: string;
  unit?: string;
  price?: number;
  stock_on_hand?: number;
  image_url?: string;
  description?: string;
  benefits?: string[];
  storage?: string;
}
