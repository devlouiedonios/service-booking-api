import { Booking, BookingStatus, Service } from './Booking';
import { Customer } from './Customer';
import { Property } from './Property';

export interface GetBookingsRequest {
  page: number;
  pageSize: number;
  search?: string;
  sort: string;
  direction: 'asc' | 'desc';
}

export interface BookingListItem {
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

export interface PaginatedBookingsResult {
  items: BookingListItem[];
  totalItems: number;
}

export interface GetBookingResult {
  booking: {
    id: string;
    service: Service;
    preferredDate: string;
    preferredTime: string;
    status: BookingStatus;
  };
  customer: Customer;
  property: Property;
}

export interface BookingRepository {
  find(request: GetBookingsRequest): Promise<PaginatedBookingsResult>;
  findById(id: string): Promise<GetBookingResult | null>;
  updateBookingStatus(id: string, status: string): Promise<GetBookingResult | null>;
}
