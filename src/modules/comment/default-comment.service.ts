import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Logger } from '../../core/logger/index.js';
import { Component, SortType } from '../../types/index.js';
import { OfferEntity } from '../offer/offer.entity.js';
import { CommentService } from './comment-service.interface.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';


 @injectable()
export class DefaultCommentService implements CommentService {
  constructor(
     @inject(Component.Logger) private readonly logger: Logger,
     @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
     @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    await comment.populate('userId');

    const aggregation = await this.commentModel.aggregate([
      { $match: { offerId: dto.offerId } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          average: { $avg: '$rating' }
        }
      }
    ]);

    if (aggregation.length > 0) {
      await this.offerModel.findByIdAndUpdate(dto.offerId, {
        commentCount: aggregation[0].count,
        rating: aggregation[0].average
      });
    }

    this.logger.info(`New comment created: ${comment._id}`);
    return comment;
  }

  public async findAllForOffer(offerId: string, limit = 50, skip = 0): Promise<DocumentType<CommentEntity>[]> {
    return await this.commentModel
      .find({ offerId })
      .sort({ createdAt: SortType.Down })
      .skip(skip)
      .limit(limit)
      .populate('userId')
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }
}
