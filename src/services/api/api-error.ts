import { ApiErrorPayload } from '@/types/api';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: string[];
  public readonly success: false;

  constructor(message: string, statusCode: number = 500, errors?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;

    // Maintain proper prototype chain in V8 engines
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  public static fromPayload(payload: ApiErrorPayload, defaultStatus: number = 500): ApiError {
    const rawMessage = payload.message;
    let message = 'An unexpected API error occurred';
    let errors: string[] | undefined;

    if (typeof rawMessage === 'string') {
      message = rawMessage;
    } else if (Array.isArray(rawMessage)) {
      message = rawMessage[0] || message;
      errors = rawMessage;
    }

    return new ApiError(message, payload.statusCode || defaultStatus, errors);
  }
}
