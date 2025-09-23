// InversifyJS Service Identifiers

// Base identifiers for common services
export const TYPES = {
  // Repository interfaces
  ProductRepository: Symbol.for('ProductRepository'),
  UserRepository: Symbol.for('UserRepository'),
  
  // Use cases
  CreateProductUseCase: Symbol.for('CreateProductUseCase'),
  GetProductByIdUseCase: Symbol.for('GetProductByIdUseCase'),
  ListProductsUseCase: Symbol.for('ListProductsUseCase'),
  UpdateProductPriceUseCase: Symbol.for('UpdateProductPriceUseCase'),
  
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  GetUserByIdUseCase: Symbol.for('GetUserByIdUseCase'),
  ListUsersUseCase: Symbol.for('ListUsersUseCase'),
  UpdateUserProfileUseCase: Symbol.for('UpdateUserProfileUseCase'),  
  UpdateUserStatusUseCase: Symbol.for('UpdateUserStatusUseCase'),
  
  // Controllers
  ProductController: Symbol.for('ProductController'),
  UserController: Symbol.for('UserController'),
  WelcomeController: Symbol.for('WelcomeController'),
} as const;
