import { Document, Types } from 'mongoose';
export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    full_name: string;
    hashed_password: string;
    role: 'user' | 'admin';
    created_at: Date;
}
export declare const UserModel: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=auth.model.d.ts.map