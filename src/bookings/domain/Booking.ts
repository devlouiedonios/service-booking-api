export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export type Service = 'HOUSE_CLEANING' | 'DEEP_CLEANING' | 'END_OF_LEASE_CLEANING';

export interface Booking {
  id: string;
  customerId: string;
  propertyId: string;
  service: Service;
  preferredDate: string;
  preferredTime: string;
  status: BookingStatus;
  createdAt: Date;
}
