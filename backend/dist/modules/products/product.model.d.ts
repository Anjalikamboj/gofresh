import { Document, Types } from 'mongoose';
export interface IProduct extends Document {
    _id: Types.ObjectId;
    sku: string;
    name: string;
    unit: string;
    price: number;
    stock_on_hand: number;
    image_url?: string;
    images?: string[];
    description?: string;
    long_description?: string;
    benefits?: string[];
    storage?: string;
    created_at: Date;
}
export declare const ProductModel: import("mongoose").Model<IProduct, {}, {}, {}, Document<unknown, {}, IProduct, {}, {}> & IProduct & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=product.model.d.ts.map