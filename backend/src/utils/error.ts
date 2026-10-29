export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class InsufficientStockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InsufficientStockError';
  }
}

export class InvalidFileTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidFileTypeError';
  }
}