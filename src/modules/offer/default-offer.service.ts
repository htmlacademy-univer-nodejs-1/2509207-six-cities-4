import { inject, injectable } from 'inversify';
import { City } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../core/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
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
    await result.populate('userId');
    return result;
  }

  public async findById(offerId: string | Types.ObjectId): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate('userId').exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel.findByIdAndUpdate(offerId, dto, {new: true}).populate('userId').exec();
    this.logger.info(`Offer updated: ${result?.title}`);
    return result;
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async findAll(limit: number, skip: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().skip(skip).limit(limit).populate('userId').exec();
  }

  public async findAllPremium(city: City, limit: number, skip: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({ isPremium: true, city: city }).skip(skip).limit(limit).populate('userId').exec();
  }

  public async findAllFavourite(userId: string | Types.ObjectId, limit: number, skip: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({ favouriteUsers: { $in: [userId] } }).skip(skip).limit(limit).populate('userId').exec();
  }

  public async addToFavourite(offerId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<void> {
    await this.offerModel.findByIdAndUpdate(offerId, { $addToSet: { favouriteUsers: userId } }).exec();
  }

  public async removeFromFavourite(offerId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<void> {
    await this.offerModel.findByIdAndUpdate(offerId, { $pull: { favouriteUsers: userId } }).exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {
        commentCount: 1,
      }}).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }
}
