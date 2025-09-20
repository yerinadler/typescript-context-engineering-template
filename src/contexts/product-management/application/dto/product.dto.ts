import { Product } from '../../domain/entities/product';

export type ProductDto = {
  id: string;
  name: string;
  sku: string;
  description?: string;
  status: string;
  price: {
    amountCents: number;
    currency: string;
  };
  createdAt: string;
  updatedAt: string;
};

export const toProductDto = (product: Product): ProductDto => {
  const dto: ProductDto = {
    id: product.id,
    name: product.name,
    sku: product.sku,
    status: product.status,
    price: {
      amountCents: product.price.amountCents,
      currency: product.price.currency,
    },
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };

  if (product.description) {
    dto.description = product.description;
  }

  return dto;
};
