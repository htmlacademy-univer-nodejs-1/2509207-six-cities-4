import { Command } from './command.interface.js';
import { createReadStream } from 'node:fs';
import readline from 'node:readline';
import chalk from 'chalk';
import { Container } from 'inversify';
import { City, HousingType, Amenity, UserType } from '../../types/index.js';
import { UserService } from '../../modules/user/user-service.interface.js';
import { OfferService } from '../../modules/offer/offer-service.interface.js';
import { CreateUserDto } from '../../modules/user/dto/create-user.dto.js';
import { CreateOfferDto } from '../../modules/offer/dto/create-offer.dto.js';
import { Config, RestConfig, RestSchema } from '../../core/config/index.js';
import { Logger, PinoLogger } from '../../core/logger/index.js';
import { DatabaseClient } from '../../core/database-client/database-client.interface.js';
import { MongoDatabaseClient } from '../../core/database-client/mongo.database-client.js';
import { getMongoURI } from '../../helpers/database.js';
import { DefaultUserService } from '../../modules/user/default-user.service.js';
import { DefaultOfferService } from '../../modules/offer/default-offer.service.js';
import { Component } from '../../types/index.js';
import { types } from '@typegoose/typegoose';
import { UserEntity, UserModel } from '../../modules/user/user.entity.js';
import { OfferEntity, OfferModel } from '../../modules/offer/offer.entity.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  private createContainer(): Container {
    const container = new Container();

    container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
    container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
    container.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();

    container.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
    container.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);

    container.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
    container.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);

    return container;
  }

  public async execute(filePath?: string): Promise<void> {
    if (!filePath) {
      console.log(chalk.red('Ошибка: путь к TSV-файлу не указан.'));
      return;
    }

    const container = this.createContainer();
    const config = container.get<Config<RestSchema>>(Component.Config);
    const logger = container.get<Logger>(Component.Logger);
    const dbClient = container.get<DatabaseClient>(Component.DatabaseClient);
    const userService = container.get<UserService>(Component.UserService);
    const offerService = container.get<OfferService>(Component.OfferService);

    const mongoUri = getMongoURI(
      config.get('DB_USER'),
      config.get('DB_PASSWORD'),
      config.get('DB_HOST'),
      config.get('DB_PORT'),
      config.get('DB_NAME')
    );

    await dbClient.connect(mongoUri);
    logger.info(chalk.cyan(` Импорт данных из файла: ${filePath}`));

    const stream = createReadStream(filePath, { encoding: 'utf-8' });
    const rl = readline.createInterface({ input: stream });

    for await (const line of rl) {
      if (!line.trim()) {
        continue;
      }

      const [
        title, description, publicationDate, city, previewImage,
        photosStr, isPremiumStr, isFavoriteStr, ratingStr, type,
        roomCountStr, guestCountStr, priceStr, amenitiesStr,
        userName, userEmail, userAvatar, userPassword, userType,
        latitudeStr, longitudeStr
      ] = line.split('\t');

      const userDto: CreateUserDto = {
        name: userName,
        email: userEmail,
        avatarPath: userAvatar,
        password: userPassword,
        type: userType as UserType
      };

      const user = await userService.findOrCreate(userDto, config.get('SALT'));

      const offerDto: CreateOfferDto = {
        title,
        description,
        publicationDate: new Date(publicationDate),
        city: city as City,
        previewImage,
        photos: photosStr.split(','),
        isPremium: isPremiumStr === 'true',
        isFavorite: isFavoriteStr === 'true',
        rating: parseFloat(ratingStr),
        type: type as HousingType,
        roomCount: Number(roomCountStr),
        guestCount: Number(guestCountStr),
        price: Number(priceStr),
        amenities: amenitiesStr.split(',') as Amenity[],
        userId: user.id,
        commentCount: 0,
        coordinates: {
          latitude: parseFloat(latitudeStr),
          longitude: parseFloat(longitudeStr)
        }
      };

      await offerService.create(offerDto);
      logger.info(chalk.green(` Импортировано: ${title} (${city})`));
    }

    await dbClient.disconnect();
  }
}
