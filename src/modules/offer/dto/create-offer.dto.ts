import { City, HousingType, Amenity, Coordinates } from '../../../types/index.js';
import { CreateOfferValidationMessage } from './create-offer.messages.js';
import { IsBoolean, IsEnum, IsNumber, IsString, MaxLength, MinLength, ValidateNested, ArrayMinSize, ArrayMaxSize, IsArray, IsDateString, IsInt, Max, Min, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOfferDto {
  @IsString()
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  public title!: string;

  @IsString()
  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
  public description!: string;

  @IsDateString({}, { message: CreateOfferValidationMessage.postDate.invalidFormat })
  public publicationDate!: Date; 

  @IsString({ message: CreateOfferValidationMessage.previewImage.invalidFormat })
  public previewImage?: string;

  @IsEnum(City, { message: CreateOfferValidationMessage.city.invalid })
  public city!: City;

  @IsArray({ message: CreateOfferValidationMessage.photos.invalidFormat })
  @ArrayMinSize(6, { message: CreateOfferValidationMessage.photos.minItems })
  @ArrayMaxSize(6, { message: CreateOfferValidationMessage.photos.maxItems })
  @IsString({ each: true, message: CreateOfferValidationMessage.photos.itemType })
  public photos!: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium!: boolean;

  @IsBoolean({ message: CreateOfferValidationMessage.isFavorite.invalidFormat })
  public isFavorite!: boolean;

  @IsNumber({ maxDecimalPlaces: 1 }, { message: CreateOfferValidationMessage.rating.invalidFormat })
  public rating!: number;

  @IsEnum(HousingType, { message: CreateOfferValidationMessage.type.invalid })
  public type!: HousingType;

  @IsInt()
  @Min(1, { message: CreateOfferValidationMessage.roomCount.minValue })
  @Max(8, { message: CreateOfferValidationMessage.roomCount.maxValue })
  public roomCount!: number;

  @IsInt()
  @Min(1, { message: CreateOfferValidationMessage.guestCount.minValue })
  @Max(10, { message: CreateOfferValidationMessage.guestCount.maxValue })
  public guestCount!: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  public price!: number;

  @IsArray({ message: CreateOfferValidationMessage.amenities.invalidFormat })
  @IsEnum(Amenity, { each: true, message: CreateOfferValidationMessage.amenities.invalidValue })
  public amenities!: Amenity[];


  public userId!: string;

  public commentCount!: number;

  @ValidateNested()
  @Type(() => Object)
  @IsObject({ message: CreateOfferValidationMessage.coordinates.invalidFormat })
  public coordinates!: Coordinates;
}
