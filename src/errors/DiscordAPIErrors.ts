export class CustomError extends Error {
  constructor(name: string, message: string, public responseData?: any) {
    super(`${message}`);
    this.name = name;
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string, responseData?: any) {
    super("UnauthorizedError", message, responseData);
  }
}

export class RateLimitedError extends CustomError {
  constructor(message: string, responseData?: any) {
    super("RateLimitedError", message, responseData);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string, responseData?: any) {
    super("BadRequestError", message, responseData);
  }
}

export class DiscordAPIError extends CustomError {
  constructor(message: string, responseData?: any) {
    super("DiscordAPIError", message, responseData);
  }
}

export class InvalidAccessTokenError extends CustomError {
  constructor(message: string, responseData?: any) {
    super("InvalidAccessTokenError", message, responseData);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string, responseData?: any) {
    super("NotFoundError", message, responseData);
  }
}
