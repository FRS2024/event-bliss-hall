
export interface Venue {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  capacity: number;
  category: string;
  images: string[];
  amenities: string[];
  rating: number;
  reviewCount: number;
  availability: string;
  reviews?: Review[];
  hostId: string;
}

export interface Review {
  id: string;
  venueId: string;
  userId: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'guest' | 'host' | 'admin';
  createdAt: string;
}

export interface Booking {
  id: string;
  venueId: string;
  userId: string;
  date: string;
  guestCount: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}
