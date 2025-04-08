import { City, HousingType, Amenity, Coordinates, User } from '../../../types/index.js';

export class CreateOfferDto {
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
  public user!: User;
  public commentCount!: number;
  public coordinates!: Coordinates;
}
