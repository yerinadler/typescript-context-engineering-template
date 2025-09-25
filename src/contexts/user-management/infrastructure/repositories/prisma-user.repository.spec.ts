import { PrismaUserRepository } from './prisma-user.repository';
import { User } from '../../domain/entities/user';
import { BirthDate } from '../../domain/value-objects/birth-date';
import { Email } from '../../domain/value-objects/email';
import { FullName } from '../../domain/value-objects/full-name';
import { Gender } from '../../domain/value-objects/gender';

const buildUser = (): User => {
  const createdAt = new Date('2024-01-01T12:00:00.000Z');
  const updatedAt = new Date(createdAt.getTime());

  return User.create({
    id: 'user-123',
    fullName: FullName.create('Jane Doe'),
    email: Email.create('jane.doe@example.com'),
    gender: Gender.create('female'),
    birthDate: BirthDate.create('1990-06-15'),
    status: 'active',
    createdAt,
    updatedAt,
  });
};

type PrismaClientUserMock = {
  upsert: jest.Mock;
  findUnique: jest.Mock;
  findMany: jest.Mock;
  deleteMany: jest.Mock;
};

type PrismaClientMock = {
  user: PrismaClientUserMock;
};

const createPrismaMock = (): PrismaClientMock => ({
  user: {
    upsert: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
});

describe('PrismaUserRepository', () => {
  it('persists user snapshots via upsert', async () => {
    const prisma = createPrismaMock();
    const repository = new PrismaUserRepository(prisma as unknown as any);
    const user = buildUser();
    const snapshot = user.toSnapshot();

    prisma.user.upsert.mockResolvedValue(snapshot);

    await repository.save(user);

    expect(prisma.user.upsert).toHaveBeenCalledWith({
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
  });

  it('maps found records back to domain entities by id', async () => {
    const prisma = createPrismaMock();
    const repository = new PrismaUserRepository(prisma as unknown as any);
    const user = buildUser();
    const snapshot = user.toSnapshot();

    prisma.user.findUnique.mockResolvedValue({ ...snapshot });

    const found = await repository.findById(user.id);

    expect(found).not.toBeNull();
    expect(found?.id).toBe(user.id);
    expect(found?.email).toBe(user.email);
  });

  it('normalises email lookups to lowercase', async () => {
    const prisma = createPrismaMock();
    const repository = new PrismaUserRepository(prisma as unknown as any);
    const user = buildUser();
    const snapshot = user.toSnapshot();

    prisma.user.findUnique.mockResolvedValue({ ...snapshot });

    const found = await repository.findByEmail('JANE.DOE@EXAMPLE.COM');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'jane.doe@example.com' } });
    expect(found?.email).toBe('jane.doe@example.com');
  });

  it('lists users ordered by creation time', async () => {
    const prisma = createPrismaMock();
    const repository = new PrismaUserRepository(prisma as unknown as any);
    const first = buildUser();
    const second = User.create({
      id: 'user-456',
      fullName: FullName.create('John Smith'),
      email: Email.create('john.smith@example.com'),
      gender: Gender.create('male'),
      birthDate: BirthDate.create('1988-03-22'),
      status: 'suspended',
      createdAt: new Date('2024-01-02T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    });

    prisma.user.findMany.mockResolvedValue([first.toSnapshot(), second.toSnapshot()]);

    const users = await repository.findAll();

    expect(prisma.user.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'asc' } });
    expect(users).toHaveLength(2);
    const [firstUser, secondUser] = users as [User, User];
    expect(firstUser.id).toBe(first.id);
    expect(secondUser.status).toBe('suspended');
  });

  it('delegates deletions to deleteMany', async () => {
    const prisma = createPrismaMock();
    const repository = new PrismaUserRepository(prisma as unknown as any);

    prisma.user.deleteMany.mockResolvedValue({ count: 1 });

    await repository.delete('user-123');

    expect(prisma.user.deleteMany).toHaveBeenCalledWith({ where: { id: 'user-123' } });
  });
});
