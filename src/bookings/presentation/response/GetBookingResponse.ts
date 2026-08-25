import { BookingStatus, Service } from '../../domain/Booking';

export interface PropertyResponse {
  id: string;
  type: string;
  address: string;
}

export interface CustomerResponse {
  id: string;
  name: string;
  mobileNumber: string;
}

export interface BookingDetailResponse {
  id: string;
  service: Service;
  preferredDate: string;
  preferredTime: string;
  status: BookingStatus;
}

export interface GetBookingResponse {
  booking: BookingDetailResponse;
  customer: CustomerResponse;
  property: PropertyResponse;
}
