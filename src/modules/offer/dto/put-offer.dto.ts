import { UUID } from 'node:crypto';
import { City, HousingType, Amenity, Coordinates } from '../../../types/index.js';

export class PutOfferDto {
  public id!: UUID;
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
