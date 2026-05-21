import { IProduct } from './product.model';
import { ProductCreateDto, ProductStockUpdateDto, ProductFullUpdateDto } from './product.types';
type ProductJSON = ReturnType<IProduct['toJSON']>;
export declare function listProducts(): Promise<ProductJSON[]>;
export declare function getProduct(productId: string): Promise<ProductJSON>;
export declare function createProduct(dto: ProductCreateDto): Promise<ProductJSON>;
export declare function updateProductStock(productId: string, dto: ProductStockUpdateDto): Promise<ProductJSON>;
export declare function updateProduct(productId: string, dto: ProductFullUpdateDto): Promise<ProductJSON>;
export declare function deleteProduct(productId: string): Promise<{
    message: string;
    id: string;
}>;
export {};
//# sourceMappingURL=product.service.d.ts.map