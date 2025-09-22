import type { Request, Response } from 'express';
import { Router as ExpressRouter } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { createSuccessResponse } from '../../../../shared/api';
import { BadRequestError } from '../../../../shared/errors';
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

export class ProductController {
  public readonly basePath: string = '/products';
  private readonly _router: ExpressRouter;

  constructor(private readonly dependencies: ProductControllerDependencies) {
    this._router = ExpressRouter();
    this.initializeRoutes();
  }

  get router(): ExpressRouter {
    return this._router;
  }

  private initializeRoutes(): void {
    this._router.get('/', expressAsyncHandler(this.listProducts.bind(this)));
    this._router.get('/:id', expressAsyncHandler(this.getProduct.bind(this)));
    this._router.post('/', expressAsyncHandler(this.createProduct.bind(this)));
    this._router.put('/:id/price', expressAsyncHandler(this.updatePrice.bind(this)));
  }

  private async listProducts(_req: Request, res: Response): Promise<void> {
    const products = await this.dependencies.listProductsUseCase.execute();
    res.json(createSuccessResponse('PRODUCTS_FETCHED', 'products retrieved', products));
  }

  private async getProduct(req: Request, res: Response): Promise<void> {
    const productId = this.getRequiredString(req.params?.id, 'product id');
    const product = await this.dependencies.getProductByIdUseCase.execute(productId);
    res.json(createSuccessResponse('PRODUCT_FETCHED', 'product retrieved', product));
  }

  private async createProduct(req: Request, res: Response): Promise<void> {
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
  }

  private async updatePrice(req: Request, res: Response): Promise<void> {
    const payload = req.body ?? {};
    const priceCents = typeof payload.priceCents === 'number' ? payload.priceCents : Number(payload.priceCents);
    const dto = new UpdateProductPriceDTO(
      this.getRequiredString(req.params?.id, 'product id'),
      priceCents,
      this.getRequiredString(payload.currency, 'currency'),
    );

    const product = await this.dependencies.updateProductPriceUseCase.execute(dto);

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
