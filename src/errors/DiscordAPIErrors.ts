class CustomError extends Error {
  constructor(name: string, ...message: any[]) {
    super(message.join(" "));
    this.name = name;
  }
}

export class UnauthorizedError extends CustomError {
  constructor(...message: any[]) {
    super("UnauthorizedError", message);
  }
}

export class RateLimitedError extends CustomError {
  constructor(...message: any[]) {
    super("RateLimitedError", message);
  }
}

export class BadRequestError extends CustomError {
  constructor(...message: any[]) {
    super("BadRequestError", message);
  }
}

export class DiscordAPIError extends CustomError {
  constructor(...message: any) {
    super("DiscordAPIError", message);
  }
}

export class InvalidAccessTokenError extends CustomError {
  constructor(...message: any[]) {
    super("InvalidAccessTokenError", message);
  }
}

export class NotFoundError extends CustomError {
  constructor(...message: any) {
    super("NotFoundError", message);
  }
}
