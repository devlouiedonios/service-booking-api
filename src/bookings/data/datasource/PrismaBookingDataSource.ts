import { Prisma, PrismaClient } from "@prisma/client";
import {
  BookingDataSource,
  BookingWithRelationsRecord,
  QueryOptions,
} from "./BookingDataSource";

export class PrismaBookingDataSource implements BookingDataSource {
  constructor(private db: PrismaClient) {}

  async find(options: QueryOptions): Promise<BookingWithRelationsRecord[]> {
    const bookings = await this.db.booking.findMany({
      skip: options.skip,
      take: options.take,
      orderBy: options.orderBy,
      where: this.buildWhereClause(options.where),
      include: {
        property: {
          include: {
            customer: true,
          },
        },
      },
    });

    return bookings.map((booking) => ({
      booking: {
        id: booking.id,
        propertyId: booking.propertyId,
        service: booking.service,
        preferredDate: booking.preferredDate,
        preferredTime: booking.preferredTime,
        status: booking.status,
        createdAt: booking.createdAt,
      },
      property: {
        id: booking.property.id,
        customerId: booking.property.customerId,
        type: booking.property.type,
        addressLine1: booking.property.addressLine1,
        addressLine2: booking.property.addressLine2 || "",
        suburb: booking.property.suburb,
        state: booking.property.state,
        postalCode: booking.property.postalCode,
      },
      customer: {
        id: booking.property.customer.id,
        name: booking.property.customer.name,
        mobileNumber: booking.property.customer.mobileNumber,
      },
    }));
  }

  async count(where?: Record<string, any>): Promise<number> {
    return await this.db.booking.count({
      where: this.buildWhereClause(where),
    });
  }

  async findById(id: string): Promise<BookingWithRelationsRecord | null> {
    const booking = await this.db.booking.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            customer: true,
          },
        },
      },
    });

    if (!booking) {
      return null;
    }

    return {
      booking: {
        id: booking.id,
        propertyId: booking.propertyId,
        service: booking.service,
        preferredDate: booking.preferredDate,
        preferredTime: booking.preferredTime,
        status: booking.status,
        createdAt: booking.createdAt,
      },
      property: {
        id: booking.property.id,
        customerId: booking.property.customerId,
        type: booking.property.type,
        addressLine1: booking.property.addressLine1,
        addressLine2: booking.property.addressLine2 || "",
        suburb: booking.property.suburb,
        state: booking.property.state,
        postalCode: booking.property.postalCode,
      },
      customer: {
        id: booking.property.customer.id,
        name: booking.property.customer.name,
        mobileNumber: booking.property.customer.mobileNumber,
      },
    };
  }

  async updateBookingStatus(
    id: string,
    status: string,
  ): Promise<BookingWithRelationsRecord | null> {
    try {
      const booking = await this.db.booking.update({
        where: { id },
        data: { status },
        include: {
          property: {
            include: {
              customer: true,
            },
          },
        },
      });

      return {
        booking: {
          id: booking.id,
          propertyId: booking.propertyId,
          service: booking.service,
          preferredDate: booking.preferredDate,
          preferredTime: booking.preferredTime,
          status: booking.status,
          createdAt: booking.createdAt,
        },
        property: {
          id: booking.property.id,
          customerId: booking.property.customerId,
          type: booking.property.type,
          addressLine1: booking.property.addressLine1,
          addressLine2: booking.property.addressLine2 || "",
          suburb: booking.property.suburb,
          state: booking.property.state,
          postalCode: booking.property.postalCode,
        },
        customer: {
          id: booking.property.customer.id,
          name: booking.property.customer.name,
          mobileNumber: booking.property.customer.mobileNumber,
        },
      };
    } catch (error) {
      // Only translate Prisma's "record not found" error to null.
      // Re-throw every other persistence failure.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      }

      throw error;
    }
  }

  private buildWhereClause(
    where?: Record<string, any>,
  ): Record<string, any> | undefined {
    if (!where) {
      return undefined;
    }

    const { search, ...otherConditions } = where;

    if (!search) {
      return Object.keys(otherConditions).length > 0
        ? otherConditions
        : undefined;
    }

    return {
      OR: [
        {
          property: {
            customer: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          property: {
            customer: {
              mobileNumber: {
                contains: search,
              },
            },
          },
        },
        {
          property: {
            OR: [
              {
                addressLine1: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                addressLine2: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                suburb: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                state: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                postalCode: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      ],
      ...otherConditions,
    };
  }
}
