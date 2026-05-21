import { UserModel } from '../auth/auth.model';
export interface PaginatedUsers {
    items: ReturnType<(typeof UserModel.prototype)['toJSON']>[];
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
}
export declare function getAllUsers(page: number, page_size: number): Promise<PaginatedUsers>;
//# sourceMappingURL=users.service.d.ts.map