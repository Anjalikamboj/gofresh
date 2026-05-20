/**
 * Custom API error class that mirrors FastAPI's HTTPException behaviour.
 * The error response body always uses { detail: string } to stay compatible
 * with the existing Python backend's error format.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly detail: string;

  constructor(statusCode: number, detail: string) {
    super(detail);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.detail = detail;
    Error.captureStackTrace(this, this.constructor);
  }

  // Convenience factories matching common HTTP status codes used in Python backend
  static badRequest(detail: string): ApiError {
    return new ApiError(400, detail);
  }

  static unauthorized(detail = 'Could not validate credentials'): ApiError {
    return new ApiError(401, detail);
  }

  static forbidden(detail = 'Not enough permissions'): ApiError {
    return new ApiError(403, detail);
  }

  static notFound(detail: string): ApiError {
    return new ApiError(404, detail);
  }

  static internal(detail = 'Internal server error'): ApiError {
    return new ApiError(500, detail);
  }
}
