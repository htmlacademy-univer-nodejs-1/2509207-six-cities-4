export const CreateUpdateOfferMessage = {
  title: {
    minLength: 'Minimum title length must be 10 characters.',
    maxLength: 'Maximum title length must be 100 characters.',
  },
  description: {
    minLength: 'Minimum description length must be 20 characters.',
    maxLength: 'Maximum description length must be 1024 characters.',
  },
  postDate: {
    invalidFormat: 'Publication date must be a valid ISO date.',
  },
  city: {
    invalid: 'City must be one of the predefined options.',
  },
  previewImage: {
    invalidFormat: 'Preview image must be a valid string path to the image.',
  },
  photos: {
    invalidFormat: 'Photos must be an array of strings.',
    minItems: 'Exactly 6 photos must be provided.',
    maxItems: 'Exactly 6 photos must be provided.',
    itemType: 'Each photo must be a string.',
  },
  isPremium: {
    invalidFormat: 'isPremium must be a boolean.',
  },
  isFavorite: {
    invalidFormat: 'isFavorite must be a boolean.',
  },
  rating: {
    invalidFormat: 'Rating must be a number between 1.0 and 5.0',
    invalidValue: 'Rating must be between 1.0 and 5.0',
  },
  type: {
    invalid: 'Type must be one of: apartment, house, room, hotel.',
  },
  roomCount: {
    minValue: 'Minimum room count is 1.',
    maxValue: 'Maximum room count is 8.',
  },
  guestCount: {
    minValue: 'Minimum guest count is 1.',
    maxValue: 'Maximum guest count is 10.',
  },
  price: {
    invalidFormat: 'Price must be an integer.',
    minValue: 'Minimum price is 100.',
    maxValue: 'Maximum price is 100000.',
  },
  amenities: {
    invalidFormat: 'Amenities must be an array.',
    invalidValue: 'Each amenity must be a valid enum value.',
  },
  coordinates: {
    invalidFormat: 'Coordinates must include valid latitude and longitude.',
  }
};
