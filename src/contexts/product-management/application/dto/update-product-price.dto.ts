export class UpdateProductPriceDTO {
  constructor(
    public readonly productId: string,
    public readonly priceCents: number,
    public readonly currency: string,
  ) {}
}
