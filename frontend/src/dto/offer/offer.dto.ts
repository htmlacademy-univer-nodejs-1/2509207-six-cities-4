import UserDto from '../user/user.dto';

export interface Coordinates {
    latitude: number;
    longitude: number;
}

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

export default class OfferDto {
  public id!: string;

  public title!: string;

  public description!: string;

  public publicationDate!: Date;

  public city!: City;

  public previewImage!: string;

  public photos!: string[];

  public isPremium!: boolean;

  public isFavorite!: boolean;

  public rating!: number;

  public type!: HousingType;

  public roomCount!: number;

  public guestCount!: number;

  public price!: number;

  public amenities!: Amenity[];

  public userId!: UserDto;

  public commentCount!: number;

  public coordinates!: Coordinates;
}
