
import { Venue } from '@/types';

// Mock data for development until Prisma is connected
const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'The Grand Ballroom',
    description: 'An elegant ballroom with crystal chandeliers, marble floors, and a panoramic view of the city skyline. Perfect for weddings, galas, and corporate events.',
    location: 'Downtown, New York',
    price: 3500,
    capacity: 300,
    category: 'Wedding',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2968&q=80',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    ],
    amenities: ['Catering', 'Parking', 'WiFi', 'Audio/Visual', 'Bar', 'Dance Floor', 'Lighting'],
    rating: 4.9,
    reviewCount: 128,
    availability: 'Weekends',
    reviews: [
      {
        id: '101',
        venueId: '1',
        userId: 'u1',
        name: 'Emily Johnson',
        rating: 5,
        comment: 'Absolutely stunning venue! Our wedding was magical.',
        date: '2023-09-15'
      },
      {
        id: '102',
        venueId: '1',
        userId: 'u2',
        name: 'Michael Smith',
        rating: 5,
        comment: 'Excellent staff and beautiful venue. Highly recommend!',
        date: '2023-08-22'
      }
    ],
    hostId: 'h1'
  },
  {
    id: '2',
    name: 'Riverside Gardens',
    description: 'A beautiful outdoor venue with lush gardens, a flowing river, and picturesque views. Ideal for spring and summer weddings, parties, and corporate retreats.',
    location: 'Riverdale, Boston',
    price: 2800,
    capacity: 150,
    category: 'Wedding',
    images: [
      'https://images.unsplash.com/photo-1464366400600-7168b5ac399c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80',
      'https://images.unsplash.com/photo-1507504031003-b417219a0fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    ],
    amenities: ['Outdoor Space', 'Parking', 'Tent', 'Catering', 'Lighting'],
    rating: 4.7,
    reviewCount: 92,
    availability: 'Apr-Oct',
    reviews: [
      {
        id: '201',
        venueId: '2',
        userId: 'u3',
        name: 'Sophia Williams',
        rating: 4,
        comment: 'Beautiful garden setting, but it did rain on our day so have a backup plan!',
        date: '2023-07-18'
      }
    ],
    hostId: 'h2'
  },
  {
    id: '3',
    name: 'The Vintage Loft',
    description: 'A rustic-chic loft with exposed brick walls, wood beams, and industrial elements. Perfect for trendy weddings, birthday celebrations, and photoshoots.',
    location: 'Brooklyn, New York',
    price: 2200,
    capacity: 120,
    category: 'Birthday',
    images: [
      'https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2968&q=80',
    ],
    amenities: ['WiFi', 'Kitchen', 'Sound System', 'Rooftop Access', 'Furniture'],
    rating: 4.6,
    reviewCount: 75,
    availability: 'All Year',
    hostId: 'h3'
  },
  {
    id: '4',
    name: 'Mountain View Resort',
    description: 'A luxury resort nestled in the mountains with panoramic views, upscale amenities, and multiple event spaces. Ideal for destination weddings and retreats.',
    location: 'Aspen, Colorado',
    price: 4800,
    capacity: 200,
    category: 'Wedding',
    images: [
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2062&q=80',
    ],
    amenities: ['Spa', 'Pool', 'Restaurant', 'Accommodations', 'Parking', 'Outdoor Ceremony Space', 'Bar'],
    rating: 4.8,
    reviewCount: 112,
    availability: 'All Year',
    hostId: 'h4'
  },
  {
    id: '5',
    name: 'The Corporate Center',
    description: 'A modern conference center with state-of-the-art technology, flexible meeting spaces, and professional amenities. Perfect for conferences, seminars, and corporate events.',
    location: 'Chicago, Illinois',
    price: 1800,
    capacity: 350,
    category: 'Corporate',
    images: [
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    ],
    amenities: ['WiFi', 'Projector', 'Whiteboards', 'Catering', 'Parking', 'Coffee Service', 'Breakout Rooms'],
    rating: 4.5,
    reviewCount: 68,
    availability: 'Weekdays',
    hostId: 'h5'
  },
  {
    id: '6',
    name: 'Beachfront Villa',
    description: 'A luxurious villa on a private beach with stunning ocean views, a pool, and tropical gardens. Perfect for intimate weddings, parties, and retreats.',
    location: 'Miami, Florida',
    price: 5500,
    capacity: 80,
    category: 'Wedding',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      'https://images.unsplash.com/photo-1542665952-11fbe6fa80b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    ],
    amenities: ['Pool', 'Beach Access', 'Kitchen', 'Outdoor Space', 'Parking', 'BBQ', 'Sound System'],
    rating: 4.9,
    reviewCount: 45,
    availability: 'All Year',
    hostId: 'h6'
  }
];

// API functions to simulate backend calls
// These will be replaced with actual API calls to Prisma/database

export const getFeaturedVenues = async (): Promise<Venue[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockVenues.slice(0, 3);
};

export const getAllVenues = async (): Promise<Venue[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockVenues;
};

export const getVenueById = async (id: string): Promise<Venue | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockVenues.find(venue => venue.id === id) || null;
};

export const getVenuesByCategory = async (category: string): Promise<Venue[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockVenues.filter(venue => venue.category.toLowerCase() === category.toLowerCase());
};

// This is a placeholder function that would be replaced with actual authentication code
export const getCurrentUser = async () => {
  return null; // Will integrate with Clerk
};

// This is a placeholder function for booking that would connect to Stripe
export const createBooking = async (venueId: string, date: string, guestCount: number) => {
  // Will integrate with Stripe
  return { success: true };
};
