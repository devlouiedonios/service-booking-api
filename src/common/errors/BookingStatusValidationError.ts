export class BookingStatusValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookingStatusValidationError";
  }
}
