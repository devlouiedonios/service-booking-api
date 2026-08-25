import { GetBookingsRequest } from "../service/GetBookingsRequest";
import { BookingListItem, GetBookingResult } from "../domain/BookingRepository";
import { IBookingService, GetBookingsResult } from "../service/BookingService";

export class FakeBookingService implements IBookingService {
  async getBookings(request: GetBookingsRequest): Promise<GetBookingsResult> {
    return {
      items: [
        {
          id: "booking-001",
          customerName: "John Doe",
          mobileNumber: "+61234567890",
          propertyType: "House",
          propertyAddress: "123 Main St, Suburb, VIC 3000",
          service: "HOUSE_CLEANING",
          preferredDate: "2026-08-25",
          preferredTime: "09:00",
          status: "PENDING",
        },
      ],
      totalItems: 1,
    };
  }

  async getBookingById(id: string): Promise<GetBookingResult> {
    return {
      booking: {
        id: "booking-001",
        service: "HOUSE_CLEANING",
        preferredDate: "2026-08-25",
        preferredTime: "09:00",
        status: "PENDING",
      },
      customer: {
        id: "customer-001",
        name: "John Doe",
        mobileNumber: "+61234567890",
      },
      property: {
        id: "property-001",
        customerId: "customer-001",
        type: "House",
        address: "123 Main St, Suburb, VIC 3000",
      },
    };
  }

  async updateBookingStatus(
    id: string,
    status: string,
  ): Promise<GetBookingResult> {
    return {
      booking: {
        id: "booking-001",
        service: "HOUSE_CLEANING",
        preferredDate: "2026-08-25",
        preferredTime: "09:00",
        status: status as any,
      },
      customer: {
        id: "customer-001",
        name: "John Doe",
        mobileNumber: "+61234567890",
      },
      property: {
        id: "property-001",
        customerId: "customer-001",
        type: "House",
        address: "123 Main St, Suburb, VIC 3000",
      },
    };
  }
}
