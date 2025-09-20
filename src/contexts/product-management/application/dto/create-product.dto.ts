export class CreateProductDTO {
  constructor(
    public readonly name: string,
    public readonly sku: string,
    public readonly priceCents: number,
    public readonly currency: string,
    public readonly description?: string,
  ) {}
}
