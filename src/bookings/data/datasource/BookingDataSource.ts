import { string } from "zod";

export interface CustomerRecord {
  id: string;
  name: string;
  mobileNumber: string;
}

export interface PropertyRecord {
  id: string;
  customerId: string;
  type: string;
  addressLine1: string;
  addressLine2: string;
  suburb: string;
  state: string;
  postalCode: string;
}

export interface BookingRecord {
  id: string;
  propertyId: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  createdAt: Date;
}

export interface BookingWithRelationsRecord {
  booking: BookingRecord;
  property: PropertyRecord;
  customer: CustomerRecord;
}

export interface QueryOptions {
  skip: number;
  take: number;
  orderBy: {
    [key: string]: "asc" | "desc";
  };
  where?: Record<string, any>;
}

export interface BookingDataSource {
  find(options: QueryOptions): Promise<BookingWithRelationsRecord[]>;
  count(where?: Record<string, any>): Promise<number>;
  findById(id: string): Promise<BookingWithRelationsRecord | null>;
  updateBookingStatus(id: string, status: string): Promise<BookingWithRelationsRecord | null>;
}
