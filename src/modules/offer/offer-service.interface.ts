import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { City } from '../../types/index.js';
import { Types } from 'mongoose';
import { DocumentExists } from '../../types/index.js';

export interface OfferService extends DocumentExists{
   create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
   findById(offerId: string | Types.ObjectId): Promise<DocumentType<OfferEntity> | null>;
   updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
   deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
   findAll(limit: number, skip: number): Promise<DocumentType<OfferEntity>[]>;
   findTopPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]>;
   findAllFavourite(userId: string, limit: number, skip: number): Promise<DocumentType<OfferEntity>[]>;
   addToFavourite(offerId: string, userId: string): Promise<void>;
   removeFromFavourite(offerId: string, userId: string): Promise<void>;
   incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
   exists(documentId: string): Promise<boolean>;
}
