import { Request, Response } from 'express';
import { createErrorResponse, createSuccessResponse } from '../../../../shared/api/base-response';
import { BaseController } from '../../../../shared/controller/base';
import { ApplicationError, BadRequestError, errorCodes, resolveHttpStatus } from '../../../../shared/errors';
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

export class UserController extends BaseController {
  constructor(private readonly dependencies: UserControllerDependencies) {
    super('/users');
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.addRoute('post', '/', this.createUser);
    this.addRoute('get', '/', this.listUsers);
    this.addRoute('get', '/:id', this.getUserById);
    this.addRoute('put', '/:id/profile', this.updateUserProfile);
    this.addRoute('put', '/:id/status', this.updateUserStatus);
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
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
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.dependencies.listUsersUseCase.execute();
      const response = createSuccessResponse('USERS_RETRIEVED', 'Users retrieved successfully', users);
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getRequiredString(req.params?.id, 'user id');
      const user = await this.dependencies.getUserByIdUseCase.execute(userId);
      const response = createSuccessResponse('USER_RETRIEVED', 'User retrieved successfully', user);
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
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
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getRequiredString(req.params?.id, 'user id');
      const payload = req.body ?? {};

      const dto = new UpdateUserStatusDto(this.getRequiredString(payload.status, 'status'));

      const user = await this.dependencies.updateUserStatusUseCase.execute(userId, dto);
      const response = createSuccessResponse('USER_STATUS_UPDATED', 'User status updated successfully', user);
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: Response): void {
    if (error instanceof ApplicationError) {
      const httpStatus = resolveHttpStatus(error.errorCode);
      res.status(httpStatus).json(createErrorResponse(error.errorCode, error.message));
      return;
    }

    const message = error instanceof Error ? error.message : 'unexpected error';
    res
      .status(resolveHttpStatus(errorCodes.INTERNAL_ERROR))
      .json(createErrorResponse(errorCodes.INTERNAL_ERROR, message));
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
