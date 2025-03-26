import { createReadStream } from 'node:fs';
import readline from 'node:readline';
import chalk from 'chalk';

export async function importOffers(filePath: string) {
  const stream = createReadStream(filePath, { encoding: 'utf-8' });
  const rl = readline.createInterface({ input: stream });

  console.log(chalk.blue(` Импорт данных из файла: ${filePath}`));

  for await (const line of rl) {
    if (!line.trim()) continue;
    const [
      title, description, publicationDate, city, previewImage,
      photosStr, isPremiumStr, isFavoriteStr, ratingStr, type,
      roomCountStr, guestCountStr, priceStr, amenitiesStr,
      userName, userEmail, userAvatar, userPassword, userType,
      latitudeStr, longitudeStr
    ] = line.split('\t');

    const offer = {
      title,
      description,
      publicationDate,
      city,
      previewImage,
      photos: photosStr.split(','),
      isPremium: isPremiumStr === 'true',
      isFavorite: isFavoriteStr === 'true',
      rating: parseFloat(ratingStr),
      type,
      roomCount: Number(roomCountStr),
      guestCount: Number(guestCountStr),
      price: Number(priceStr),
      amenities: amenitiesStr.split(','),
      user: {
        name: userName,
        email: userEmail,
        avatarUrl: userAvatar,
        password: userPassword,
        type: userType
      },
      commentCount: 0,
      coordinates: {
        latitude: parseFloat(latitudeStr),
        longitude: parseFloat(longitudeStr)
      }
    };

    console.log(chalk.green(` Импортировано: ${offer.title} (${city})`));
  }
}
