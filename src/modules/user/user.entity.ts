import { User, UserType } from '../../types/index.js';
import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { createSHA256 } from '../../heplers/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
    @prop({ required: true, minlength: 1, maxlength: 15, default: '' })
  public name!: string;

    @prop({ unique: true, required: true, default: '' })
    public email!: string;

    @prop({ required: false, default: '' })
    public avatarPath?: string;

    @prop({ required: true, default: '' })
    public password!: string;

    @prop({ required: true, enum: UserType, default: UserType.обычный })
    public type!: UserType;

    constructor(userData: User) {
      super();

      this.email = userData.email;
      this.avatarPath = userData.avatarPath;
      this.name = userData.name;
      this.type = userData.type;

    }


    public setPassword(password: string, salt: string) {
      this.password = createSHA256(password, salt);
    }

    public getPassword() {
      return this.password;
    }

    public verifyPassword(password: string, salt: string) {
      const hashPassword = createSHA256(password, salt);
      return hashPassword === this.password;
    }
}

export const UserModel = getModelForClass(UserEntity);
