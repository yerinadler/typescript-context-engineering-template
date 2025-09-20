import { DomainError } from '../errors/domain-error';
import { Money } from '../value-objects/money';
import { ProductName } from '../value-objects/product-name';
import { ProductSku } from '../value-objects/product-sku';

export type ProductStatus = 'draft' | 'active' | 'archived';

export type ProductSnapshot = {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: { amountCents: number; currency: string };
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
};

type ProductProps = {
  id: string;
  name: ProductName;
  sku: ProductSku;
  description?: string;
  price: Money;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
};

export class Product {
  private constructor(private props: ProductProps) {}

  static create(params: {
    id: string;
    name: ProductName;
    sku: ProductSku;
    description?: string;
    price: Money;
    status?: ProductStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }): Product {
    const trimmedId = params.id?.trim();

    if (!trimmedId) {
      throw new DomainError('product id is required');
    }

    const createdAt = params.createdAt ?? new Date();
    const updatedAt = params.updatedAt ?? createdAt;
    const status = params.status ?? 'draft';
    const description = params.description?.trim();

    const props: ProductProps = {
      id: trimmedId,
      name: params.name,
      sku: params.sku,
      price: params.price,
      status,
      createdAt,
      updatedAt,
    };

    if (description) {
      props.description = description;
    }

    return new Product(props);
  }

  rename(name: ProductName): void {
    this.props.name = name;
    this.touch();
  }

  updatePrice(price: Money): void {
    this.props.price = price;
    this.touch();
  }

  markAsActive(): void {
    this.props.status = 'active';
    this.touch();
  }

  archive(): void {
    this.props.status = 'archived';
    this.touch();
  }

  toSnapshot(): ProductSnapshot {
    const snapshot: ProductSnapshot = {
      id: this.props.id,
      name: this.props.name.value,
      sku: this.props.sku.value,
      price: {
        amountCents: this.props.price.amountCents,
        currency: this.props.price.currency,
      },
      status: this.props.status,
      createdAt: new Date(this.props.createdAt.getTime()),
      updatedAt: new Date(this.props.updatedAt.getTime()),
    };

    if (this.props.description) {
      snapshot.description = this.props.description;
    }

    return snapshot;
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name.value;
  }

  get sku(): string {
    return this.props.sku.value;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get status(): ProductStatus {
    return this.props.status;
  }

  get price(): Money {
    return this.props.price;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
