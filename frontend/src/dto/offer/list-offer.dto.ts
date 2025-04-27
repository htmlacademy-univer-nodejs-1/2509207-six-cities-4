
import UserDto, { } from '../user/user.dto.js';
import { Coordinates, HousingType } from './offer.dto.js';


export class ListItemOfferDto {
  public id!: string;

  public title!: string;

  public publicationDate!: string;

  public city!: string;

  public previewImage!: string;

  public isPremium!: boolean;

  public isFavorite!: boolean;

  public rating!: number;

  public type!: HousingType;

  public price!: number;

  public userId!: UserDto;

  public commentCount!: number;

  public coordinates!: Coordinates;
}
