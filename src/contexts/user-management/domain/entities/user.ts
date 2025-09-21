import { DomainError } from '../errors/domain-error';
import { BirthDate } from '../value-objects/birth-date';
import { Email } from '../value-objects/email';
import { FullName } from '../value-objects/full-name';
import { Gender, GenderType } from '../value-objects/gender';

export type UserStatus = 'active' | 'suspended';

export type UserSnapshot = {
  id: string;
  fullName: string;
  email: string;
  gender: GenderType;
  birthDate: Date;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
};

type UserProps = {
  id: string;
  fullName: FullName;
  email: Email;
  gender: Gender;
  birthDate: BirthDate;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
};

export class User {
  private constructor(private props: UserProps) {}

  static create(params: {
    id: string;
    fullName: FullName;
    email: Email;
    gender: Gender;
    birthDate: BirthDate;
    status?: UserStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }): User {
    const trimmedId = params.id?.trim();

    if (!trimmedId) {
      throw new DomainError('user id is required');
    }

    const createdAt = params.createdAt ?? new Date();
    const updatedAt = params.updatedAt ?? createdAt;
    const status = params.status ?? 'active';

    const props: UserProps = {
      id: trimmedId,
      fullName: params.fullName,
      email: params.email,
      gender: params.gender,
      birthDate: params.birthDate,
      status,
      createdAt,
      updatedAt,
    };

    return new User(props);
  }

  updateProfile(params: { fullName?: FullName; email?: Email; gender?: Gender; birthDate?: BirthDate }): void {
    if (params.fullName) {
      this.props.fullName = params.fullName;
    }
    if (params.email) {
      this.props.email = params.email;
    }
    if (params.gender) {
      this.props.gender = params.gender;
    }
    if (params.birthDate) {
      this.props.birthDate = params.birthDate;
    }

    this.touch();
  }

  suspend(): void {
    if (this.props.status === 'suspended') {
      throw new DomainError('user is already suspended');
    }
    this.props.status = 'suspended';
    this.touch();
  }

  activate(): void {
    if (this.props.status === 'active') {
      throw new DomainError('user is already active');
    }
    this.props.status = 'active';
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get fullName(): string {
    return this.props.fullName.value;
  }

  get email(): string {
    return this.props.email.value;
  }

  get gender(): GenderType {
    return this.props.gender.value;
  }

  get birthDate(): Date {
    return this.props.birthDate.value;
  }

  get age(): number {
    return this.props.birthDate.age;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toSnapshot(): UserSnapshot {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      gender: this.gender,
      birthDate: this.birthDate,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
