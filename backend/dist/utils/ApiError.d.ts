/**
 * Custom API error class that mirrors FastAPI's HTTPException behaviour.
 * The error response body always uses { detail: string } to stay compatible
 * with the existing Python backend's error format.
 */
export declare class ApiError extends Error {
    readonly statusCode: number;
    readonly detail: string;
    constructor(statusCode: number, detail: string);
    static badRequest(detail: string): ApiError;
    static unauthorized(detail?: string): ApiError;
    static forbidden(detail?: string): ApiError;
    static notFound(detail: string): ApiError;
    static internal(detail?: string): ApiError;
}
//# sourceMappingURL=ApiError.d.ts.map