import { City, HousingType, Amenity, Coordinates } from '../../../types/index.js';
import { CreateUpdateOfferMessage } from './update-offer.messages.js';
import {
  IsString,
  MinLength,
  MaxLength,
  IsDateString,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsArray,
  ValidateNested,
  IsObject,
  IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOfferDto {
  @IsOptional()
  @IsString()
  @MinLength(10, { message: CreateUpdateOfferMessage.title.minLength })
  @MaxLength(100, { message: CreateUpdateOfferMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @IsString()
  @MinLength(20, { message: CreateUpdateOfferMessage.description.minLength })
  @MaxLength(1024, { message: CreateUpdateOfferMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsDateString({}, { message: CreateUpdateOfferMessage.postDate.invalidFormat })
  public publicationDate?: Date;

  @IsOptional()
  @IsEnum(City, { message: CreateUpdateOfferMessage.city.invalid })
  public city?: City;

  @IsOptional()
  @IsString({ message: CreateUpdateOfferMessage.previewImage.invalidFormat })
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: CreateUpdateOfferMessage.photos.invalidFormat })
  public photos?: string[];

  @IsOptional()
  @IsBoolean({ message: CreateUpdateOfferMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsBoolean({ message: CreateUpdateOfferMessage.isFavorite.invalidFormat })
  public isFavorite?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 }, { message: CreateUpdateOfferMessage.rating.invalidFormat })
  public rating?: number;

  @IsOptional()
  @IsEnum(HousingType, { message: CreateUpdateOfferMessage.type.invalid })
  public type?: HousingType;

  @IsOptional()
  @IsInt()
  @Min(1, { message: CreateUpdateOfferMessage.roomCount.minValue })
  @Max(8, { message: CreateUpdateOfferMessage.roomCount.maxValue })
  public roomCount?: number;

  @IsOptional()
  @IsInt()
  @Min(1, { message: CreateUpdateOfferMessage.guestCount.minValue })
  @Max(10, { message: CreateUpdateOfferMessage.guestCount.maxValue })
  public guestCount?: number;

  @IsOptional()
  @IsInt({ message: CreateUpdateOfferMessage.price.invalidFormat })
  @Min(100, { message: CreateUpdateOfferMessage.price.minValue })
  @Max(100000, { message: CreateUpdateOfferMessage.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray({ message: CreateUpdateOfferMessage.amenities.invalidFormat })
  public amenities?: Amenity[];

  @IsOptional()
  public commentCount?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  @IsObject({ message: CreateUpdateOfferMessage.coordinates.invalidFormat })
  public coordinates?: Coordinates;
}
