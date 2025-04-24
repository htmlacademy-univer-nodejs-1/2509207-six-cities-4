import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../core/rest/index.js';
import { CreateUserDto } from '../dto/create-user.dto.js';

export type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDto>;