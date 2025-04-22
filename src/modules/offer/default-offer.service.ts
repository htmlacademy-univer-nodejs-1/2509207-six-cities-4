import { inject, injectable } from 'inversify';
import { City } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../core/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { PutOfferDto } from './dto/put-offer.dto.js';
import { Types } from 'mongoose';

 @injectable()
export class DefaultOfferService implements OfferService {
  constructor(
     @inject(Component.Logger) private readonly logger: Logger,
     @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string | Types.ObjectId): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }

  public async change(dto: PutOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel.findByIdAndUpdate(dto.id, dto, { new: true }).exec();
    this.logger.info(`Offer updated: ${result?.title}`);
    return result;
  }

  public async deleteById(id: string | Types.ObjectId): Promise<void> {
    const result = await this.offerModel.findByIdAndDelete(id).exec();
    if (result) {
      this.logger.info(`Offer deleted: ${result.title}`);
    }
  }

  public async findAll(limit: number, skip: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().skip(skip).limit(limit).exec();
  }

  public async findAllPremium(city: City, limit: number, skip: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({ isPremium: true, city: city }).skip(skip).limit(limit).exec();
  }

  public async findAllFavourite(userId: string | Types.ObjectId, limit: number, skip: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({ favouriteUsers: { $in: [userId] } }).skip(skip).limit(limit).exec();
  }

  public async addToFavourite(offerId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<void> {
    await this.offerModel.findByIdAndUpdate(offerId, { $addToSet: { favouriteUsers: userId } }).exec();
  }

  public async removeFromFavourite(offerId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<void> {
    await this.offerModel.findByIdAndUpdate(offerId, { $pull: { favouriteUsers: userId } }).exec();
  }

  public async updateRatingAndCommentCount(offerId: string): Promise<void> {
    const result = await this.offerModel.aggregate([
      { $match: { _id: offerId } },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'offerId',
          as: 'comments'
        }
      },
      {
        $project: {
          rating: { $avg: '$comments.rating' },
          commentsNumber: { $size: '$comments' }
        }
      }
    ]).exec();

    if (result.length > 0) {
      const { rating, commentsNumber } = result[0];
      await this.offerModel.findByIdAndUpdate(offerId, { rating, commentsNumber }).exec();
    }
  }
}
