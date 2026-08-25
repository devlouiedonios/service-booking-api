import { IBookingService, GetBookingsResult } from "./BookingService";
import { GetBookingsRequest } from "./GetBookingsRequest";
import {
  BookingRepository,
  GetBookingResult,
} from "../domain/BookingRepository";
import { PaginationValidationError } from "../../common/errors/PaginationValidationError";
import { SortValidationError } from "../../common/errors/SortValidationError";
import { NotFoundError } from "../../common/errors/NotFoundError";
import { BookingStatusValidationError } from "../../common/errors/BookingStatusValidationError";
import { BOOKING_MESSAGES } from "../BookingMessages";

const VALID_SORT_FIELDS = ["preferredDate", "createdAt", "status"];
const VALID_DIRECTIONS = ["asc", "desc"];
const VALID_BOOKING_STATUSES = ["PENDING", "APPROVED", "REJECTED", "COMPLETED"];

export class BookingServiceImpl implements IBookingService {
  constructor(private repository: BookingRepository) {}

  async getBookings(request: GetBookingsRequest): Promise<GetBookingsResult> {
    const page = request.page ?? 1;
    const pageSize = request.pageSize ?? 20;
    const sort = request.sort || "createdAt";
    const direction = (request.direction as "asc" | "desc") || "desc";

    this.validatePaginationParameters(page, pageSize);
    this.validateSortParameters(sort, direction);

    const result = await this.repository.find({
      page,
      pageSize,
      search: request.search,
      sort,
      direction,
    });

    return result;
  }

  async getBookingById(id: string): Promise<GetBookingResult> {
    const result = await this.repository.findById(id);

    if (result === null) {
      throw new NotFoundError(BOOKING_MESSAGES.NOT_FOUND);
    }

    return result;
  }

  async updateBookingStatus(
    id: string,
    status: string,
  ): Promise<GetBookingResult> {
    this.validateBookingStatus(status);

    const result = await this.repository.updateBookingStatus(id, status);

    if (result === null) {
      throw new NotFoundError(BOOKING_MESSAGES.NOT_FOUND);
    }

    return result;
  }

  private validateBookingStatus(status: string): void {
    if (!VALID_BOOKING_STATUSES.includes(status)) {
      throw new BookingStatusValidationError(
        BOOKING_MESSAGES.invalidStatus(VALID_BOOKING_STATUSES),
      );
    }
  }

  private validatePaginationParameters(page: number, pageSize: number): void {
    if (page < 1) {
      throw new PaginationValidationError(BOOKING_MESSAGES.PAGE_MINIMUM);
    }

    if (pageSize < 1) {
      throw new PaginationValidationError(BOOKING_MESSAGES.PAGE_SIZE_MINIMUM);
    }

    if (pageSize > 100) {
      throw new PaginationValidationError(BOOKING_MESSAGES.PAGE_SIZE_MAXIMUM);
    }
  }

  private validateSortParameters(sort: string, direction: string): void {
    if (!VALID_SORT_FIELDS.includes(sort)) {
      throw new SortValidationError(
        BOOKING_MESSAGES.invalidSort(VALID_SORT_FIELDS),
      );
    }

    if (!VALID_DIRECTIONS.includes(direction)) {
      throw new SortValidationError(
        BOOKING_MESSAGES.invalidDirection(VALID_DIRECTIONS),
      );
    }
  }
}
