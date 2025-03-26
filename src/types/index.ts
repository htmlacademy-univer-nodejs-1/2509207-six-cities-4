export type UserType = 'обычный' | 'pro';

export interface User {
  name: string; // 1-15 символов
  email: string; // уникальный валидный email
  avatarUrl?: string; // .jpg или .png (опционально)
  password: string; // 6-12 символов
  type: UserType;
}

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
  publicationDate: string; // ISO формат
  city: City;
  previewImage: string;
  photos: string[]; // ровно 6 ссылок
  isPremium: boolean;
  isFavorite: boolean;
  rating: number; // 1–5, одно значение после запятой
  type: HousingType;
  roomCount: number; // 1–8
  guestCount: number; // 1–10
  price: number; // 100–100000
  amenities: Amenity[];
  user: User;
  commentCount: number; // вычисляется отдельно
  coordinates: Coordinates;
}
