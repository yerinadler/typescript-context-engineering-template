import type { Request, Response } from 'express';
import { createErrorResponse, createSuccessResponse } from '../../../../shared/api';
import { BaseController } from '../../../../shared/controller/base';
import { ApplicationError, BadRequestError, errorCodes, resolveHttpStatus } from '../../../../shared/errors';
import { CreateProductDTO } from '../../application/dto/create-product.dto';
import { UpdateProductPriceDTO } from '../../application/dto/update-product-price.dto';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { GetProductByIdUseCase } from '../../application/use-cases/get-product-by-id.use-case';
import { ListProductsUseCase } from '../../application/use-cases/list-products.use-case';
import { UpdateProductPriceUseCase } from '../../application/use-cases/update-product-price.use-case';

type ProductControllerDependencies = {
  createProductUseCase: CreateProductUseCase;
  getProductByIdUseCase: GetProductByIdUseCase;
  listProductsUseCase: ListProductsUseCase;
  updateProductPriceUseCase: UpdateProductPriceUseCase;
};

export class ProductController extends BaseController {
  constructor(private readonly dependencies: ProductControllerDependencies) {
    super('/products');
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.addRoute('get', '/', this.listProducts);
    this.addRoute('get', '/:id', this.getProduct);
    this.addRoute('post', '/', this.createProduct);
    this.addRoute('put', '/:id/price', this.updatePrice);
  }

  private async listProducts(_req: Request, res: Response) {
    try {
      const products = await this.dependencies.listProductsUseCase.execute();
      res.json(createSuccessResponse('PRODUCTS_FETCHED', 'products retrieved', products));
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private async getProduct(req: Request, res: Response) {
    try {
      const productId = this.getRequiredString(req.params?.id, 'product id');
      const product = await this.dependencies.getProductByIdUseCase.execute(productId);
      res.json(createSuccessResponse('PRODUCT_FETCHED', 'product retrieved', product));
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private async createProduct(req: Request, res: Response) {
    try {
      const payload = req.body ?? {};
      const priceCents = typeof payload.priceCents === 'number' ? payload.priceCents : Number(payload.priceCents);
      const description = this.getOptionalString(payload.description, 'description');
      const dto = new CreateProductDTO(
        this.getRequiredString(payload.name, 'name'),
        this.getRequiredString(payload.sku, 'sku'),
        priceCents,
        this.getRequiredString(payload.currency, 'currency'),
        description,
      );

      const product = await this.dependencies.createProductUseCase.execute(dto);

      res.status(201).json(createSuccessResponse('PRODUCT_CREATED', 'product created', product));
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private async updatePrice(req: Request, res: Response) {
    try {
      const payload = req.body ?? {};
      const priceCents = typeof payload.priceCents === 'number' ? payload.priceCents : Number(payload.priceCents);
      const dto = new UpdateProductPriceDTO(
        this.getRequiredString(req.params?.id, 'product id'),
        priceCents,
        this.getRequiredString(payload.currency, 'currency'),
      );

      const product = await this.dependencies.updateProductPriceUseCase.execute(dto);

      res.json(createSuccessResponse('PRODUCT_PRICE_UPDATED', 'product price updated', product));
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
      throw new BadRequestError(`${fieldName} must be a string`);
    }

    const trimmed = value.trim();

    return trimmed ? trimmed : undefined;
  }
}
