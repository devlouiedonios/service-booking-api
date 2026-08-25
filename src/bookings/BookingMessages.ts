export const BOOKING_MESSAGES = {
  NOT_FOUND: "Booking not found.",

  PAGE_MINIMUM: "page must be greater than or equal to 1",
  PAGE_SIZE_MINIMUM: "pageSize must be greater than or equal to 1",
  PAGE_SIZE_MAXIMUM: "pageSize must not exceed 100",

  invalidStatus: (statuses: string[]) =>
    `status must be one of [${statuses.join(", ")}]`,

  invalidSort: (fields: string[]) =>
    `sort must be one of [${fields.join(", ")}]`,

  invalidDirection: (directions: string[]) =>
    `direction must be one of [${directions.join(", ")}]`,
} as const;
