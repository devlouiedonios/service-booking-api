import { BookingStatus, Service } from '../../domain/Booking';

export interface BookingResponse {
  id: string;
  customerName: string;
  mobileNumber: string;
  propertyType: string;
  propertyAddress: string;
  service: Service;
  preferredDate: string;
  preferredTime: string;
  status: BookingStatus;
}

export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface GetBookingsResponse {
  bookings: BookingResponse[];
  pagination: PaginationMetadata;
}
