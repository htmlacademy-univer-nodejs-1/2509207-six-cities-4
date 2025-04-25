import { inject, injectable } from 'inversify';
import { Logger } from '../../core/logger/index.js';
import { BaseController, HttpError, HttpMethod, UploadFileMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../core/rest/index.js';
import { Component } from '../../types/index.js';
import { Request, Response } from 'express';
import { UserService } from './user-service.interface.js';
import { RestSchema, Config } from '../../core/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { CreateUserRequest } from './types/create-user-request.type.js';
import { LoginUserRequest } from './types/login-user-request.type.js';
import { StatusCodes } from 'http-status-codes';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { AuthService } from '../auth/index.js';
import { LoggedUserRdo } from './rdo/logged-user.rdo.js';
import { UploadUserAvatarRdo } from './rdo/upload-user-avatar.rdo.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.Config) private config: Config<RestSchema>,
    @inject(Component.UserService) private userService: UserService,
    @inject(Component.AuthService) private readonly authService: AuthService,
  ) {
    super(logger);

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create.bind(this),
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login.bind(this),
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar.bind(this),
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate.bind(this),
    });
  }

  public async create({ body }: CreateUserRequest, res: Response,): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.config.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login({ body }: LoginUserRequest, res: Response,): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, user);
    this.ok(res, Object.assign(responseData, { token }));
  }

  public async checkAuthenticate({ tokenPayload: { email } }: Request, res: Response) {
    const foundedUser = await this.userService.findByEmail(email);

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(UserRdo, foundedUser));
  }

  public async uploadAvatar({ params, file }: Request, res: Response) {
    const { userId } = params;
    const uploadFile = { avatarPath: file?.filename };
    await this.userService.updateById(userId, uploadFile);
    this.created(res, fillDTO(UploadUserAvatarRdo, { filepath: uploadFile.avatarPath }));
  }
}
