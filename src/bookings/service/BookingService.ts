import { GetBookingsRequest } from "./GetBookingsRequest";
import { BookingListItem, GetBookingResult } from "../domain/BookingRepository";

export interface GetBookingsResult {
  items: BookingListItem[];
  totalItems: number;
}

export interface IBookingService {
  getBookings(request: GetBookingsRequest): Promise<GetBookingsResult>;
  getBookingById(id: string): Promise<GetBookingResult>;
  updateBookingStatus(id: string, status: string): Promise<GetBookingResult>;
}
