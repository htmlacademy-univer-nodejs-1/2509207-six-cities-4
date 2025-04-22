import { City, HousingType, Amenity, Coordinates } from '../../../types/index.js';
import { Types } from 'mongoose';

export class PutOfferDto {
  public id!: Types.ObjectId;
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
  public commentCount!: number;
  public coordinates!: Coordinates;
}
