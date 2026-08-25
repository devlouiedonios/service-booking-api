export class PaginationValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaginationValidationError";
  }
}
