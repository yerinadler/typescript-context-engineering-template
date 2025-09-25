import { z } from 'zod';
import { optionalString, requiredNumber, requiredString } from '../../../../../shared/validation';

export const productIdParamsSchema = z.object({
  id: requiredString('product id'),
});

export const createProductBodySchema = z.object({
  name: requiredString('name'),
  sku: requiredString('sku'),
  priceCents: requiredNumber('priceCents'),
  currency: requiredString('currency'),
  description: optionalString('description'),
});

export const updateProductPriceBodySchema = z.object({
  priceCents: requiredNumber('priceCents'),
  currency: requiredString('currency'),
});
