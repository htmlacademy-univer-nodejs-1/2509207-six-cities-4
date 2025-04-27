import { TYPES } from '../../const';
import CommentDto from '../../dto/comment/comment.dto';
import { ListItemOfferDto } from '../../dto/offer/list-offer.dto';
import OfferDto, { HousingType } from '../../dto/offer/offer.dto';
import UserWithTokenDto from '../../dto/user/user-with-token.dto';
import UserDto from '../../dto/user/user.dto';
import { Comment, ListOffer, Offer, Type, User } from '../../types/types';

export type AuthData = {
    user: User;
    token: string;
};
export const adaptLoginToClient = (dto: UserWithTokenDto): AuthData => ({
  user: {
    name: dto.name,
    avatarUrl: dto.avatarPath,
    email: dto.email,
    isPro: dto.type === 'pro',
  },
  token: dto.token,
});

export const adaptUserToClient =
    (user: UserDto): User => ({
      name: user.name,
      avatarUrl: user.avatarPath,
      email: user.email,
      isPro: user.type === 'pro',
    });


export const adaptOfferToClient =
    (offer: OfferDto): Offer => ({
      id: offer.id,
      title: offer.title,
      description: offer.description,
      city: { name: offer.city, location: offer.coordinates },
      location: offer.coordinates,
      previewImage: offer.previewImage,
      isPremium: offer.isPremium,
      type: adaptHousingType(offer.type),
      bedrooms: offer.roomCount,
      maxAdults: offer.guestCount,
      price: offer.price,
      goods: offer.amenities,
      images: offer.photos,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      host: adaptUserToClient(offer.userId),
    });

export const adaptHousingType = (type: HousingType): Type => {
  switch (type) {
    case HousingType.Apartment:
      return TYPES[0];
    case HousingType.Room:
      return TYPES[1];
    case HousingType.House:
      return TYPES[2];
    case HousingType.Hotel:
      return TYPES[3];
  }
};
export const adaptOffersToClient = (offers: OfferDto[]): Offer[] =>
  offers.map(adaptOfferToClient);


export const adaptListOfferToClient = (offer: ListItemOfferDto): ListOffer => ({
  id: offer.id,
  price: offer.price,
  rating: offer.rating,
  title: offer.title,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  city: {
    name: offer.city,
    location: offer.coordinates
  },
  location: offer.coordinates,
  previewImage: offer.previewImage,
  type: adaptHousingType(offer.type),
});

export const adaptListOffersToClient = (offers: ListItemOfferDto[]): ListOffer[] =>
  offers.map((offer) => adaptListOfferToClient(offer));

export const adaptCommentToClient = (comment: CommentDto): Comment => ({
  id: comment.id,
  comment: comment.text,
  date: comment.postDate,
  rating: comment.rating,
  user: adaptUserToClient(comment.user),
});

export const adaptCommentsToClient = (comments: CommentDto[]): Comment[] =>
  comments.map(adaptCommentToClient);
