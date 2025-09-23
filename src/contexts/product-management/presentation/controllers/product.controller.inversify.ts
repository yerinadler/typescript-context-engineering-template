import 'reflect-metadata';
import type { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, httpPut, request, response } from 'inversify-express-utils';
import { createSuccessResponse } from '../../../../shared/api';
import { TYPES } from '../../../../shared/di';
import { BadRequestError } from '../../../../shared/errors';
import { CreateProductDTO } from '../../application/dto/create-product.dto';
import { UpdateProductPriceDTO } from '../../application/dto/update-product-price.dto';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { GetProductByIdUseCase } from '../../application/use-cases/get-product-by-id.use-case';
import { ListProductsUseCase } from '../../application/use-cases/list-products.use-case';
import { UpdateProductPriceUseCase } from '../../application/use-cases/update-product-price.use-case';

@controller('/products')
export class ProductController {
  constructor(
    @inject(TYPES.CreateProductUseCase) private readonly createProductUseCase: CreateProductUseCase,
    @inject(TYPES.GetProductByIdUseCase) private readonly getProductByIdUseCase: GetProductByIdUseCase,
    @inject(TYPES.ListProductsUseCase) private readonly listProductsUseCase: ListProductsUseCase,
    @inject(TYPES.UpdateProductPriceUseCase) private readonly updateProductPriceUseCase: UpdateProductPriceUseCase,
  ) {}

  @httpGet('/')
  async listProducts(@request() _req: Request, @response() res: Response): Promise<void> {
    const products = await this.listProductsUseCase.execute();
    res.json(createSuccessResponse('PRODUCTS_FETCHED', 'products retrieved', products));
  }

  @httpGet('/:id')
  async getProduct(@request() req: Request, @response() res: Response): Promise<void> {
    const productId = this.getRequiredString(req.params?.id, 'product id');
    const product = await this.getProductByIdUseCase.execute(productId);
    res.json(createSuccessResponse('PRODUCT_FETCHED', 'product retrieved', product));
  }

  @httpPost('/')
  async createProduct(@request() req: Request, @response() res: Response): Promise<void> {
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

    const product = await this.createProductUseCase.execute(dto);

    res.status(201).json(createSuccessResponse('PRODUCT_CREATED', 'product created', product));
  }

  @httpPut('/:id/price')
  async updatePrice(@request() req: Request, @response() res: Response): Promise<void> {
    const payload = req.body ?? {};
    const priceCents = typeof payload.priceCents === 'number' ? payload.priceCents : Number(payload.priceCents);
    const dto = new UpdateProductPriceDTO(
      this.getRequiredString(req.params?.id, 'product id'),
      priceCents,
      this.getRequiredString(payload.currency, 'currency'),
    );

    const product = await this.updateProductPriceUseCase.execute(dto);

    res.json(createSuccessResponse('PRODUCT_PRICE_UPDATED', 'product price updated', product));
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
