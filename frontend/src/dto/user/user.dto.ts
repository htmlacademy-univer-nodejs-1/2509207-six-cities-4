export enum UserType {
    обычный = 'обычный',
    pro = 'pro'
}

export default class UserDto {
  public name!: string;

  public email!: string;

  public avatarPath!: string;

  public type!: UserType;
}
