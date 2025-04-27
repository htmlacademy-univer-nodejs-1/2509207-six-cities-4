import { Coordinates } from './offer.dto';

export enum City {
  Paris = 'Paris',
  Cologne = 'Colonge',
  Brussels = 'Brussels',
  Amsterdam = 'Amsterdam',
  Hamburg = 'Hamburg',
  Dusseldorf = 'Dusseldorf'
}

export enum HousingType {
  Apartment = 'apartment',
  House = 'house',
  Room = 'room',
  Hotel = 'hotel'
}
export enum Amenity {
  Breakfast = 'Breakfast',
  AirConditioning = 'Air conditioning',
  LaptopFriendlyWorkspace = 'Laptop friendly workspace',
  BabySeat = 'Baby seat',
  Washer = 'Washer',
  Towels = 'Towels',
  Fridge = 'Fridge'
}

export default class CreateOfferDto {

  public title!: string;

  public description!: string;

  public publicationDate!: Date;

  public previewImage!: string;

  public city!: City;

  public photos!: string[];

  public isFavorite!: boolean;

  public isPremium!: boolean;

  public type!: HousingType;

  public rating?: number;

  public roomCount!: number;

  public guestCount!: number;

  public price!: number;

  public amenities!: Amenity[];

  public coordinates!: Coordinates;

}
