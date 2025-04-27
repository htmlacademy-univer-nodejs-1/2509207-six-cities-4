import { UserType } from './user.dto';

export default class UserWithTokenDto {
  public name!: string;

  public email!: string;

  public avatarPath!: string;

  public type!: UserType;

  public token!: string;
}
