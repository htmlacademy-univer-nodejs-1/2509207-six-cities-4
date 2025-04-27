import CreateUserDto from '../../dto/user/create-user.dto';
import UpdateOfferDto from '../../dto/offer/update-offer.dto';
import CreateOfferDto from '../../dto/offer/create-offer.dto';
import CreateCommentDto from '../../dto/comment/create-comment.dto';
import { UserRegister, NewOffer, CommentAuth, Offer } from '../../types/types';
import { UserType } from '../../dto/user/user.dto';
import { City as CityEnum, HousingType, Amenity } from '../../dto/offer/offer.dto';


export const adaptSignupToServer = (user: UserRegister): CreateUserDto => ({
  name: user.name,
  email: user.email,
  avatarPath: ' ',
  password: user.password,
  type: user.isPro ? UserType.pro : UserType.обычный,
});

export const adaptCreateOfferToServer = (offer: NewOffer): CreateOfferDto => ({
  title: offer.title,
  description: offer.description,
  publicationDate: new Date(),
  city: offer.city.name as CityEnum,
  previewImage: offer.previewImage,
  photos: ['','', '', '', '', ''],
  isFavorite: false,
  isPremium: offer.isPremium,
  rating: 5.0,
  type: offer.type as HousingType,
  roomCount: offer.bedrooms,
  guestCount: offer.maxAdults,
  price: offer.price,
  amenities: offer.goods.map((g) => g as Amenity),
  coordinates: offer.city.location
});

export const adaptEditOfferToServer = (offer: Offer): UpdateOfferDto => ({
  title: offer.title,
  description: offer.description,
  city: offer.city.name as CityEnum,
  previewImage: offer.previewImage,
  isFavorite: offer.isFavorite,
  isPremium: offer.isPremium,
  type: offer.type as HousingType,
  roomCount: offer.bedrooms,
  guestCount: offer.maxAdults,
  price: offer.price,
  amenities: offer.goods.map((g) => g as Amenity),
  coordinates: offer.location,
});

export const adaptCreateCommentToServer = (comment: CommentAuth): CreateCommentDto => ({
  text: comment.comment,
  rating: comment.rating,
  offerId: comment.id,
});

export const adaptAvatarToServer = (file: File): FormData => {
  const formData = new FormData();
  formData.append('avatar', file);
  return formData;
};

export const adaptImageToServer = (file: File): FormData => {
  const formData = new FormData();
  formData.append('image', file);
  return formData;
};
