import { inject, injectable } from 'inversify';
import { Logger } from '../../core/logger/index.js';
import { BaseController, HttpError, HttpMethod, ValidateDtoMiddleware } from '../../core/rest/index.js';
import { Component } from '../../types/index.js';
import { Response } from 'express';
import { UserService } from './user-service.interface.js';
import { RestSchema, Config } from '../../core/config/index.js';
import { fillDTO } from '../../heplers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { CreateUserRequest } from './types/create-user-request.type.js';
import { LoginUserRequest } from './types/login-user-request.type.js';
import { StatusCodes } from 'http-status-codes';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';


@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.Config) private config: Config<RestSchema>,
    @inject(Component.UserService) private userService: UserService
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
  }

  public async create({ body }: CreateUserRequest, res: Response, ): Promise<void> {
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

  public async login({ body }: LoginUserRequest, _res: Response,): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);
    if (! existsUser) {
      throw new HttpError(


        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }
}
