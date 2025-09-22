import type { Request, Response } from 'express';
import { Router as ExpressRouter } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { createSuccessResponse } from '../../../../shared/api/base-response';
import { BadRequestError } from '../../../../shared/errors';
import { CreateUserDto, UpdateUserProfileDto, UpdateUserStatusDto } from '../../application/dto/user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { UpdateUserProfileUseCase } from '../../application/use-cases/update-user-profile.use-case';
import { UpdateUserStatusUseCase } from '../../application/use-cases/update-user-status.use-case';

type UserControllerDependencies = {
  createUserUseCase: CreateUserUseCase;
  listUsersUseCase: ListUsersUseCase;
  getUserByIdUseCase: GetUserByIdUseCase;
  updateUserProfileUseCase: UpdateUserProfileUseCase;
  updateUserStatusUseCase: UpdateUserStatusUseCase;
};

export class UserController {
  public readonly basePath: string = '/users';
  private readonly _router: ExpressRouter;

  constructor(private readonly dependencies: UserControllerDependencies) {
    this._router = ExpressRouter();
    this.initializeRoutes();
  }

  get router(): ExpressRouter {
    return this._router;
  }

  private initializeRoutes(): void {
    this._router.post('/', expressAsyncHandler(this.createUser.bind(this)));
    this._router.get('/', expressAsyncHandler(this.listUsers.bind(this)));
    this._router.get('/:id', expressAsyncHandler(this.getUserById.bind(this)));
    this._router.put('/:id/profile', expressAsyncHandler(this.updateUserProfile.bind(this)));
    this._router.put('/:id/status', expressAsyncHandler(this.updateUserStatus.bind(this)));
  }

  private async createUser(req: Request, res: Response): Promise<void> {
    const payload = req.body ?? {};
    const dto = new CreateUserDto(
      this.getRequiredString(payload.fullName, 'full name'),
      this.getRequiredString(payload.email, 'email'),
      this.getRequiredString(payload.gender, 'gender'),
      this.getRequiredString(payload.birthDate, 'birth date'),
    );

    const user = await this.dependencies.createUserUseCase.execute(dto);
    const response = createSuccessResponse('USER_CREATED', 'User created successfully', user);
    res.status(201).json(response);
  }

  private async listUsers(_req: Request, res: Response): Promise<void> {
    const users = await this.dependencies.listUsersUseCase.execute();
    const response = createSuccessResponse('USERS_RETRIEVED', 'Users retrieved successfully', users);
    res.status(200).json(response);
  }

  private async getUserById(req: Request, res: Response): Promise<void> {
    const userId = this.getRequiredString(req.params?.id, 'user id');
    const user = await this.dependencies.getUserByIdUseCase.execute(userId);
    const response = createSuccessResponse('USER_RETRIEVED', 'User retrieved successfully', user);
    res.status(200).json(response);
  }

  private async updateUserProfile(req: Request, res: Response): Promise<void> {
    const userId = this.getRequiredString(req.params?.id, 'user id');
    const payload = req.body ?? {};

    const fullName = this.getOptionalString(payload.fullName, 'full name');
    const email = this.getOptionalString(payload.email, 'email');
    const gender = this.getOptionalString(payload.gender, 'gender');
    const birthDate = this.getOptionalString(payload.birthDate, 'birth date');

    const dto = new UpdateUserProfileDto(fullName, email, gender, birthDate);

    const user = await this.dependencies.updateUserProfileUseCase.execute(userId, dto);
    const response = createSuccessResponse('USER_PROFILE_UPDATED', 'User profile updated successfully', user);
    res.status(200).json(response);
  }

  private async updateUserStatus(req: Request, res: Response): Promise<void> {
    const userId = this.getRequiredString(req.params?.id, 'user id');
    const payload = req.body ?? {};

    const dto = new UpdateUserStatusDto(this.getRequiredString(payload.status, 'status'));

    const user = await this.dependencies.updateUserStatusUseCase.execute(userId, dto);
    const response = createSuccessResponse('USER_STATUS_UPDATED', 'User status updated successfully', user);
    res.status(200).json(response);
  }

  private getRequiredString(value: unknown, fieldName: string): string {
    if (typeof value !== 'string') {
      throw new BadRequestError(`${fieldName} is required`);
    }

    const trimmed = value.trim();

    if (!trimmed) {
      throw new BadRequestError(`${fieldName} is required`);
    }

    return trimmed;
  }

  private getOptionalString(value: unknown, fieldName: string): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (typeof value !== 'string') {
      throw new BadRequestError(`${fieldName} must be a string when provided`);
    }

    const trimmed = value.trim();
    return trimmed || undefined;
  }
}
