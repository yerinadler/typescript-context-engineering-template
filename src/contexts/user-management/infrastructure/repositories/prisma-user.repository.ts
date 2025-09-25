import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { PrismaClient } from '../../../../generated/prisma';
import { TYPES } from '../../../../shared/di';
import { UserRepository } from '../../application/ports/user-repository.port';
import { User, UserSnapshot, UserStatus } from '../../domain/entities/user';
import { BirthDate } from '../../domain/value-objects/birth-date';
import { Email } from '../../domain/value-objects/email';
import { FullName } from '../../domain/value-objects/full-name';
import { Gender } from '../../domain/value-objects/gender';

type PrismaUserRecord = {
  id: string;
  fullName: string;
  email: string;
  gender: string;
  birthDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

@injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(@inject(TYPES.PrismaClient) private readonly prisma: PrismaClient) {}

  async save(user: User): Promise<void> {
    const snapshot = this.toPersistence(user.toSnapshot());

    await this.prisma.user.upsert({
      where: { id: snapshot.id },
      create: snapshot,
      update: {
        fullName: snapshot.fullName,
        email: snapshot.email,
        gender: snapshot.gender,
        birthDate: snapshot.birthDate,
        status: snapshot.status,
        updatedAt: snapshot.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase();
    const record = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
    return record ? this.toDomain(record) : null;
  }

  async findAll(): Promise<User[]> {
    const records = (await this.prisma.user.findMany({ orderBy: { createdAt: 'asc' } })) as PrismaUserRecord[];
    return records.map((record) => this.toDomain(record));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.deleteMany({ where: { id } });
  }

  private toPersistence(snapshot: UserSnapshot): PrismaUserRecord {
    return {
      id: snapshot.id,
      fullName: snapshot.fullName,
      email: snapshot.email,
      gender: snapshot.gender,
      birthDate: snapshot.birthDate,
      status: snapshot.status,
      createdAt: snapshot.createdAt,
      updatedAt: snapshot.updatedAt,
    };
  }

  private toDomain(record: PrismaUserRecord): User {
    return User.create({
      id: record.id,
      fullName: FullName.create(record.fullName),
      email: Email.create(record.email),
      gender: Gender.create(record.gender),
      birthDate: BirthDate.create(record.birthDate),
      status: record.status as UserStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
