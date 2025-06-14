
export interface VenueFormData {
  name: string;
  description: string;
  capacity: number;
  city: string;
  address: string;
  category: string;
  eventTypes: string[];
  pricePerHour?: number;
  pricePerDay?: number;
  pricePerEvent?: number;
  latitude?: number;
  longitude?: number;
}
