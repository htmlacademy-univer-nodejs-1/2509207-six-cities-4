import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';
import { Amenity, City, HousingType, Coordinates } from '../../types/index.js';


export interface OfferEntity extends defaultClasses.Base { }

@modelOptions({
    schemaOptions: {
        collection: 'offers',
        timestamps: true,
    }
})

export class OfferEntity extends defaultClasses.TimeStamps {
    @prop({ required: true, minlength: 10, maxlength: 100 })
    public title!: string;

    @prop({ required: true, minlength: 20, maxlength: 1024 })
    public description!: string;

    @prop({ required: true })
    public publicationDate!: Date;

    @prop({ required: true, enum: City })
    public city!: City;

    @prop({ required: true })
    public previewImage!: string;

    @prop({ required: true, validate: (v: string[]) => v.length == 6 })
    public photos!: string[];

    @prop({ required: true })
    public isPremium!: boolean;

    @prop({ required: true })
    public isFavorite!: boolean;

    @prop({ required: true, min: 1, max: 5 })
    public rating!: number;

    @prop({ required: true, enum: HousingType })
    public type!: HousingType;

    @prop({ required: true, min: 1, max: 8 })
    public roomCount!: number;

    @prop({ required: true, min: 1, max: 10 })
    public guestCount!: number;

    @prop({ required: true, min: 100, max: 100000 })
    public price!: number;

    @prop({ required: true, type: () => [String], enum: Amenity })
    public amenities!: Amenity[];

    @prop({
        ref: UserEntity,
        required: true
    })
    public user!: Ref<UserEntity>;

    @prop()
    public commentCount!: number;

    @prop({ required: true })
    public coordinates!: Coordinates;
}
export const OfferModel = getModelForClass(OfferEntity);