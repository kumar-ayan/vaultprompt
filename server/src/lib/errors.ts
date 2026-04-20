export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500,
    public readonly code = 'internal_error'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request.', code = 'bad_request') {
    super(message, 400, code);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized.', code = 'unauthorized') {
    super(message, 401, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found.', code = 'not_found') {
    super(message, 404, code);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service unavailable.', code = 'service_unavailable') {
    super(message, 503, code);
  }
}
