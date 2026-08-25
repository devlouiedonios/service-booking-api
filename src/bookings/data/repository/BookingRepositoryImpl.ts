import {
  BookingRepository,
  GetBookingsRequest,
  PaginatedBookingsResult,
  BookingListItem,
  GetBookingResult,
} from "../../domain/BookingRepository";
import {
  BookingDataSource,
  PropertyRecord,
} from "../datasource/BookingDataSource";

export class BookingRepositoryImpl implements BookingRepository {
  constructor(private dataSource: BookingDataSource) {}

  async find(request: GetBookingsRequest): Promise<PaginatedBookingsResult> {
    const skip = (request.page - 1) * request.pageSize;

    const searchWhere = request.search
      ? this.buildSearchFilter(request.search)
      : undefined;

    const bookingRecords = await this.dataSource.find({
      skip,
      take: request.pageSize,
      orderBy: {
        [request.sort]: request.direction,
      },
      where: searchWhere,
    });

    const totalItems = await this.dataSource.count(searchWhere);

    const items: BookingListItem[] = bookingRecords.map(
      ({ booking, customer, property }) => ({
        id: booking.id,
        customerName: customer.name,
        mobileNumber: customer.mobileNumber,
        propertyType: property.type,
        propertyAddress: this.formatPropertyAddress(property),
        service: booking.service as any,
        preferredDate: booking.preferredDate,
        preferredTime: booking.preferredTime,
        status: booking.status as any,
      }),
    );

    return {
      items,
      totalItems,
    };
  }

  private buildSearchFilter(search: string): Record<string, any> {
    return { search };
  }

  async findById(id: string): Promise<GetBookingResult | null> {
    const record = await this.dataSource.findById(id);
    if (!record) {
      return null;
    }

    return {
      booking: {
        id: record.booking.id,
        service: record.booking.service as any,
        preferredDate: record.booking.preferredDate,
        preferredTime: record.booking.preferredTime,
        status: record.booking.status as any,
      },
      customer: {
        id: record.customer.id,
        name: record.customer.name,
        mobileNumber: record.customer.mobileNumber,
      },
      property: {
        id: record.property.id,
        customerId: record.property.customerId,
        type: record.property.type as any,
        address: this.formatPropertyAddress(record.property),
      },
    };
  }

  async updateBookingStatus(id: string, status: string): Promise<GetBookingResult | null> {
    const record = await this.dataSource.updateBookingStatus(id, status);
    if (!record) {
      return null;
    }

    return {
      booking: {
        id: record.booking.id,
        service: record.booking.service as any,
        preferredDate: record.booking.preferredDate,
        preferredTime: record.booking.preferredTime,
        status: record.booking.status as any,
      },
      customer: {
        id: record.customer.id,
        name: record.customer.name,
        mobileNumber: record.customer.mobileNumber,
      },
      property: {
        id: record.property.id,
        customerId: record.property.customerId,
        type: record.property.type as any,
        address: this.formatPropertyAddress(record.property),
      },
    };
  }

  private formatPropertyAddress(property: PropertyRecord): string {
    return [
      property.addressLine1,
      property.addressLine2,
      property.suburb,
      property.state,
      property.postalCode,
    ]
      .filter(Boolean)
      .join(", ");
  }
}
