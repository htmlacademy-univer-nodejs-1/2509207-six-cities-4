import { UserType, HousingType, City, Amenity, Coordinates } from './index.js';

export interface ServerUser {
    id: string;
    name: string;
    email: string;
    avatarPath?: string;
    password: string;
    type: UserType;
}
export interface ServerOffer {
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
    userId: string;
    coordinates: Coordinates;
}
