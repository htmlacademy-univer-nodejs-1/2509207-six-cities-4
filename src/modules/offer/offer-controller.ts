import { inject, injectable } from 'inversify';
import { Logger } from '../../core/logger/index.js';
import { City, Component } from '../../types/index.js';
import { Request, Response } from 'express';
import { OfferService } from './offer-service.interface.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CreateOfferRequest } from './type/create-offer-request.type.js';
import { isValidObjectId, Types } from 'mongoose';
import { BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, ValidateObjectIdMiddleware, ValidateDtoMiddleware, PrivateRouteMiddleware } from '../../core/rest/index.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../heplers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { ParamOfferId } from './type/param-offerid.type.js';
import { CommentRdo, CommentService } from '../comment/index.js';
import { DEFAULT_OFFER_COUNT, DEFAULT_SKIP_COUNT, DEFAULT_COMMENT_COUNT } from './offer.constant.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected logger: Logger,
    @inject(Component.OfferService) private offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService
  ) {
    super(logger);
    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.indexPremiumOffers.bind(this),
    });

    this.addRoute({
      path: '/favourite',
      method: HttpMethod.Get,
      handler: this.indexFavouriteOffers.bind(this),
      middlewares: [
        new PrivateRouteMiddleware()
      ]
    });
    this.addRoute({
      path: '/favourite/:offerId',
      method: HttpMethod.Post,
      handler: this.createFavourite.bind(this),
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]
    });
    this.addRoute({
      path: '/favourite/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteFavourite.bind(this),
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler:
      this.index.bind(this)
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create.bind(this),
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show.bind(this),
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete.bind(this),
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update.bind(this),
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments.bind(this),
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
  }

  private async index(req: Request, res: Response): Promise<void> {
    const { limit, skip } = req.query;

    const limitValue = limit ? parseInt(limit as string, 10) : DEFAULT_OFFER_COUNT;

    const skipValue = skip ? parseInt(skip as string, 10) : DEFAULT_SKIP_COUNT;

    const offers = await this.offerService.findAll(limitValue, skipValue);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create({ ...body, userId: tokenPayload.id });
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }


  private async show({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;

    if (!isValidObjectId(offerId)) {
      this.sendBadRequest('offerId', offerId);
    }

    const offer = await this.offerService.findById(new Types.ObjectId(offerId));

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update(
    { body, params, tokenPayload }: Request<ParamOfferId, unknown, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;

    const existingOffer = await this.offerService.findById(offerId);
    if (!existingOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    if (existingOffer.userId.id !== tokenPayload.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'You can update only your own offers',
        'OfferController'
      );
    }

    const updatedOffer = await this.offerService.updateById(offerId, body);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  private async delete({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const existingOffer = await this.offerService.findById(offerId);
    if (existingOffer?.userId.id !== tokenPayload.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'You can delete only your own offers',
        'OfferController'
      );
    }
    await this.offerService.deleteById(offerId);
    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, {});
  }

  private async indexPremiumOffers(req: Request, res: Response): Promise<void> {
    const { city } = req.params;
    const cityValue = city as City;
    if (!Object.values(City).includes(cityValue)) {
      this.sendBadRequest('city', city);
    }

    const offers = await this.offerService.findTopPremiumByCity(cityValue);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  private async indexFavouriteOffers(req: Request, res: Response): Promise<void> {
    const limit = DEFAULT_OFFER_COUNT;
    const skip = DEFAULT_SKIP_COUNT;
    const offers = await this.offerService.findAllFavourite(req.tokenPayload.id, limit, skip);
    offers.forEach((offer: DocumentType<OfferEntity> & { currentUserId?: string }) => {
      offer.currentUserId = req.tokenPayload.id;
    });
    this.ok(res, fillDTO(OfferRdo, offers));
  }


  private async createFavourite({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    await this.offerService.addToFavourite(offerId, tokenPayload.id);
    this.noContent(res, {});
  }

  private async deleteFavourite({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    await this.offerService.removeFromFavourite(offerId, tokenPayload.id);
    this.noContent(res, {});
  }

  public async getComments({ params }: Request<ParamOfferId>, res: Response): Promise<void> {

    const comments = await this.commentService.findAllForOffer(params.offerId, DEFAULT_COMMENT_COUNT, DEFAULT_SKIP_COUNT);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  private sendBadRequest<T>(paramName: string, value: T): void {
    const error = `Wrong value for ${paramName}: ${value}`;
    this.logger.warn(error);
    throw new HttpError(StatusCodes.BAD_REQUEST, error);
  }
}
