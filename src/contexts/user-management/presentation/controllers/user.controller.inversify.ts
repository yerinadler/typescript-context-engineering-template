import 'reflect-metadata';
import type { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, httpPut, request, response } from 'inversify-express-utils';
import { createSuccessResponse } from '../../../../shared/api';
import { TYPES } from '../../../../shared/di';
import { validateRequest } from '../../../../shared/validation';
import { CreateUserDto, UpdateUserProfileDto, UpdateUserStatusDto } from '../../application/dto/user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { UpdateUserProfileUseCase } from '../../application/use-cases/update-user-profile.use-case';
import { UpdateUserStatusUseCase } from '../../application/use-cases/update-user-status.use-case';
import {
  createUserBodySchema,
  updateUserProfileBodySchema,
  updateUserStatusBodySchema,
  userIdParamsSchema,
} from './schema/user.controller.schema';

@controller('/users')
export class UserController {
  constructor(
    @inject(TYPES.CreateUserUseCase) private readonly createUserUseCase: CreateUserUseCase,
    @inject(TYPES.ListUsersUseCase) private readonly listUsersUseCase: ListUsersUseCase,
    @inject(TYPES.GetUserByIdUseCase) private readonly getUserByIdUseCase: GetUserByIdUseCase,
    @inject(TYPES.UpdateUserProfileUseCase) private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    @inject(TYPES.UpdateUserStatusUseCase) private readonly updateUserStatusUseCase: UpdateUserStatusUseCase,
  ) {}

  @httpGet('/')
  async listUsers(@request() _req: Request, @response() res: Response): Promise<void> {
    const users = await this.listUsersUseCase.execute();
    res.json(createSuccessResponse('USERS_FETCHED', 'users retrieved', users));
  }

  @httpGet('/:id')
  async getUser(@request() req: Request, @response() res: Response): Promise<void> {
    const {
      params: { id: userId },
    } = validateRequest(req, { params: userIdParamsSchema });

    const user = await this.getUserByIdUseCase.execute(userId);
    res.json(createSuccessResponse('USER_FETCHED', 'user retrieved', user));
  }

  @httpPost('/')
  async createUser(@request() req: Request, @response() res: Response): Promise<void> {
    const {
      body: { fullName, email, gender, birthDate },
    } = validateRequest(req, { body: createUserBodySchema });

    const dto = new CreateUserDto(fullName, email, gender, birthDate);
    const user = await this.createUserUseCase.execute(dto);

    res.status(201).json(createSuccessResponse('USER_CREATED', 'user created', user));
  }

  @httpPut('/:id/profile')
  async updateProfile(@request() req: Request, @response() res: Response): Promise<void> {
    const {
      params: { id: userId },
      body: { fullName, email, gender, birthDate },
    } = validateRequest(req, { params: userIdParamsSchema, body: updateUserProfileBodySchema });

    const dto = new UpdateUserProfileDto(fullName, email, gender, birthDate);
    const user = await this.updateUserProfileUseCase.execute(userId, dto);

    res.json(createSuccessResponse('USER_PROFILE_UPDATED', 'user profile updated', user));
  }

  @httpPut('/:id/status')
  async updateStatus(@request() req: Request, @response() res: Response): Promise<void> {
    const {
      params: { id: userId },
      body: { status },
    } = validateRequest(req, { params: userIdParamsSchema, body: updateUserStatusBodySchema });

    const dto = new UpdateUserStatusDto(status);
    const user = await this.updateUserStatusUseCase.execute(userId, dto);

    res.json(createSuccessResponse('USER_STATUS_UPDATED', 'user status updated', user));
  }
}
