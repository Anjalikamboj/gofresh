export interface TokenPayload {
    sub: string;
    user_id: string;
    role: string;
    exp?: number;
    iat?: number;
}
export interface UserCreateDto {
    email: string;
    full_name: string;
    password: string;
}
export interface UserLoginDto {
    email: string;
    password: string;
}
export interface UserUpdateDto {
    full_name?: string;
    email?: string;
    current_password?: string;
    new_password?: string;
}
/** Shape returned to the client (hashed_password is always excluded). */
export type UserResponse = Record<string, unknown>;
export interface AuthResponse {
    user: UserResponse;
    access_token: string;
    token_type: 'bearer';
}
//# sourceMappingURL=auth.types.d.ts.map