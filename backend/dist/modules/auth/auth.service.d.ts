import { UserCreateDto, UserLoginDto, UserUpdateDto, AuthResponse } from './auth.types';
export declare function registerUser(dto: UserCreateDto): Promise<AuthResponse>;
export declare function loginUser(dto: UserLoginDto): Promise<AuthResponse>;
export declare function getMe(userId: string): Promise<Record<string, unknown>>;
export declare function updateProfile(userId: string, dto: UserUpdateDto): Promise<Record<string, unknown>>;
//# sourceMappingURL=auth.service.d.ts.map