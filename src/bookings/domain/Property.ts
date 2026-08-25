export type PropertyType = "House";

export interface Property {
  id: string;
  customerId: string;
  type: PropertyType;
  address: string;
}
