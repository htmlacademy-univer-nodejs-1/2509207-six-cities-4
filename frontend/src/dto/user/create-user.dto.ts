import { UserType } from './user.dto';

export default class CreateUserDto {
  public name!: string;

  public email!: string;

  public avatarPath!: string;

  public password!: string;

  public type!: UserType;
}
