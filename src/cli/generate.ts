import axios from 'axios';
import { createWriteStream } from 'node:fs';
import { ServerOffer, ServerUser } from '../types/server-data.js';
import { Offer } from '../types/index.js';
import { getRandomItem, getRandomBoolean, getRandomNumber, getRandomRating, getRandomSubset } from '../utils/random.js';

function formatToTSV(offer: Offer): string {
  return [
    offer.title,
    offer.description,
    offer.publicationDate,
    offer.city,
    offer.previewImage,
    offer.photos.join(','),
    offer.isPremium,
    offer.isFavorite,
    offer.rating,
    offer.type,
    offer.roomCount,
    offer.guestCount,
    offer.price,
    offer.amenities.join(','),
    offer.user.name,
    offer.user.email,
    offer.user.avatarUrl,
    offer.user.password,
    offer.user.type,
    offer.coordinates.latitude,
    offer.coordinates.longitude
  ].join('\t');
}
export { generateOffers };

async function generateOffers(count: number, filepath: string, url: string) {
  const [offersRes, usersRes] = await Promise.all([
    axios.get<ServerOffer[]>(`${url}/offers`),
    axios.get<ServerUser[]>(`${url}/users`)
  ]);

  const offers = offersRes.data;
  const users = usersRes.data;

  const stream = createWriteStream(filepath, { flags: 'w', encoding: 'utf-8' });

  for (let i = 0; i < count; i++) {
    const base = getRandomItem(offers);
    const user = getRandomItem(users);

    const generated: Offer = {
      title: base.title,
      description: base.description,
      publicationDate: new Date().toISOString(),
      city: base.city,
      previewImage: base.previewImage,
      photos: [...base.photos],
      isPremium: getRandomBoolean(),
      isFavorite: getRandomBoolean(),
      rating: getRandomRating(),
      type: base.type,
      roomCount: getRandomNumber(1, 8),
      guestCount: getRandomNumber(1, 10),
      price: getRandomNumber(100, 100000),
      amenities: getRandomSubset(base.amenities),
      user: {
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl ?? '',
        password: user.password,
      type: user.type
    },
    commentCount: 0,
    coordinates: {
      latitude: base.coordinates.latitude,
      longitude: base.coordinates.longitude
    }
    };

    stream.write(formatToTSV(generated) + '\n');
  }

  stream.end();
  console.log(`Сгенерировано ${count} предложений в файл ${filepath}`);
}

const args = process.argv.slice(2);
const count = Number(args[1]);
const filepath = args[2];
const url = args[3];

if (args[0] === '--generate' && count && filepath && url) {
  generateOffers(count, filepath, url).catch(console.error);
}
