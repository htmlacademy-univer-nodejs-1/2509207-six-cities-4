import { User, UserType } from '../../types/index.js';
import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { createSHA256 } from '../../heplers/index.js';


export interface UserEntity extends defaultClasses.Base { }

@modelOptions({
    schemaOptions: {
        collection: 'users',
        timestamps: true,
    }
})

export class UserEntity extends defaultClasses.TimeStamps implements User {
    @prop({ required: true, minlength: 1, maxlength: 15, default: '' })
    public name!: string;

    @prop({ unique: true, required: true, default: '' })
    public email!: string;

    @prop({ required: false, default: '' })
    public avatarUrl?: string;

    @prop({ required: true, select: false })
    public password!: string;

    @prop({ required: true, enum: UserType, default: UserType.обычный })
    public type!: UserType;


    public setPassword(password: string, salt: string) {
        this.password = createSHA256(password, salt);
    }

    public getPassword() {
        return this.password;
    }
}

export const UserModel = getModelForClass(UserEntity);