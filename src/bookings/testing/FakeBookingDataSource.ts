import {
  BookingDataSource,
  CustomerRecord,
  PropertyRecord,
  BookingRecord,
  BookingWithRelationsRecord,
  QueryOptions,
} from "../data/datasource/BookingDataSource";

export class FakeBookingDataSource implements BookingDataSource {
  private customers: CustomerRecord[] = [
    {
      id: "customer-001",
      name: "John Doe",
      mobileNumber: "+61234567890",
    },
    {
      id: "customer-002",
      name: "Jane Smith",
      mobileNumber: "+61412345678",
    },
  ];

  private properties: PropertyRecord[] = [
    {
      id: "property-001",
      customerId: "customer-001",
      type: "House",
      addressLine1: "123 Main St",
      addressLine2: "",
      suburb: "Richmond",
      state: "VIC",
      postalCode: "3121",
    },
    {
      id: "property-002",
      customerId: "customer-002",
      type: "House",
      addressLine1: "456 High St",
      addressLine2: "",
      suburb: "Melbourne",
      state: "VIC",
      postalCode: "3000",
    },
  ];

  private bookings: BookingRecord[] = [
    {
      id: "booking-001",
      propertyId: "property-001",
      service: "HOUSE_CLEANING",
      preferredDate: "2026-08-25",
      preferredTime: "09:00",
      status: "PENDING",
      createdAt: new Date("2026-08-20T10:00:00Z"),
    },
    {
      id: "booking-002",
      propertyId: "property-002",
      service: "DEEP_CLEANING",
      preferredDate: "2026-08-26",
      preferredTime: "14:00",
      status: "APPROVED",
      createdAt: new Date("2026-08-19T10:00:00Z"),
    },
  ];

  async find(options: QueryOptions): Promise<BookingWithRelationsRecord[]> {
    let filtered = this.bookings;

    if (options.where) {
      filtered = filtered.filter((booking) => {
        const record = this.getBookingWithRelations(booking);
        if (!record) return false;

        return Object.entries(options.where!).every(([key, value]) => {
          if (key === "search") {
            return this.matchesSearch(record, value as string);
          }
          return (booking as any)[key] === value;
        });
      });
    }

    const sorted = this.sortBookings(filtered, options.orderBy);

    const paginated = sorted.slice(options.skip, options.skip + options.take);

    return paginated
      .map((booking) => this.getBookingWithRelations(booking))
      .filter(
        (record): record is BookingWithRelationsRecord => record !== undefined,
      );
  }

  async count(where?: Record<string, any>): Promise<number> {
    if (!where) {
      return this.bookings.length;
    }

    return this.bookings.filter((booking) => {
      const record = this.getBookingWithRelations(booking);
      if (!record) return false;

      return Object.entries(where).every(([key, value]) => {
        if (key === "search") {
          return this.matchesSearch(record, value as string);
        }
        return (booking as any)[key] === value;
      });
    }).length;
  }

  async findById(id: string): Promise<BookingWithRelationsRecord | null> {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) {
      return null;
    }
    return this.getBookingWithRelations(booking) ?? null;
  }

  async updateBookingStatus(
    id: string,
    status: string,
  ): Promise<BookingWithRelationsRecord | null> {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) {
      return null;
    }
    booking.status = status;
    return this.getBookingWithRelations(booking) ?? null;
  }

  private matchesSearch(
    record: BookingWithRelationsRecord,
    search: string,
  ): boolean {
    const normalizedSearch = search.toLowerCase();

    return (
      record.customer.name.toLowerCase().includes(normalizedSearch) ||
      record.customer.mobileNumber.includes(search) ||
      this.formatPropertyAddress(record.property)
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }

  private getBookingWithRelations(
    booking: BookingRecord,
  ): BookingWithRelationsRecord | undefined {
    const property = this.properties.find(
      (property) => property.id === booking.propertyId,
    );

    if (!property) {
      return undefined;
    }

    const customer = this.customers.find(
      (customer) => customer.id === property.customerId,
    );

    if (!customer) {
      return undefined;
    }

    return {
      booking,
      property,
      customer,
    };
  }

  private sortBookings(
    bookings: BookingRecord[],
    orderBy: { [key: string]: "asc" | "desc" },
  ): BookingRecord[] {
    const sorted = [...bookings];

    Object.entries(orderBy).forEach(([field, direction]) => {
      sorted.sort((a, b) => {
        const aVal = (a as any)[field];
        const bVal = (b as any)[field];

        if (aVal < bVal) {
          return direction === "asc" ? -1 : 1;
        }

        if (aVal > bVal) {
          return direction === "asc" ? 1 : -1;
        }

        return 0;
      });
    });

    return sorted;
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
