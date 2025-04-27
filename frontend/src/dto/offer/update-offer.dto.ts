import { Amenity, City, HousingType } from './create-offer.dto';
import { Coordinates } from './offer.dto';

export default class UpdateOfferDto {

  public title?: string;

  public description?: string;

  public publicationDate?: Date;

  public previewImage?: string;

  public city?: City;

  public photos?: string[];

  public isPremium?: boolean;

  public isFavorite?: boolean;

  public rating?: number;

  public type?: HousingType;

  public roomCount?: number;

  public guestCount?: number;

  public price?: number;

  public amenities?: Amenity[];

  public userId?: string;

  public commentCount?: number;

  public coordinates?: Coordinates;
}
