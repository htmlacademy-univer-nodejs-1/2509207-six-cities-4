import type { User } from './user.type.js';

export type City =
  | 'Paris'
  | 'Cologne'
  | 'Brussels'
  | 'Amsterdam'
  | 'Hamburg'
  | 'Dusseldorf';

export type HousingType = 'apartment' | 'house' | 'room' | 'hotel';

export type Amenity =
  | 'Breakfast'
  | 'Air conditioning'
  | 'Laptop friendly workspace'
  | 'Baby seat'
  | 'Washer'
  | 'Towels'
  | 'Fridge';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Offer {
  title: string;
  description: string;
  publicationDate: string;
  city: City;
  previewImage: string;
  photos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  roomCount: number;
  guestCount: number;
  price: number;
  amenities: Amenity[];
  user: User;
  commentCount: number;
  coordinates: Coordinates;
}
