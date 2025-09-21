import { UserRepository } from '../../application/ports/user-repository.port';
import { User, UserSnapshot } from '../../domain/entities/user';
import { BirthDate } from '../../domain/value-objects/birth-date';
import { Email } from '../../domain/value-objects/email';
import { FullName } from '../../domain/value-objects/full-name';
import { Gender } from '../../domain/value-objects/gender';

export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, UserSnapshot> = new Map();

  async save(user: User): Promise<void> {
    this.users.set(user.id, user.toSnapshot());
  }

  async findById(id: string): Promise<User | null> {
    const snapshot = this.users.get(id);
    if (!snapshot) {
      return null;
    }

    return this.fromSnapshot(snapshot);
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase();
    for (const snapshot of this.users.values()) {
      if (snapshot.email.toLowerCase() === normalizedEmail) {
        return this.fromSnapshot(snapshot);
      }
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    const users: User[] = [];
    for (const snapshot of this.users.values()) {
      users.push(this.fromSnapshot(snapshot));
    }
    return users;
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  private fromSnapshot(snapshot: UserSnapshot): User {
    return User.create({
      id: snapshot.id,
      fullName: FullName.create(snapshot.fullName),
      email: Email.create(snapshot.email),
      gender: Gender.create(snapshot.gender),
      birthDate: BirthDate.create(snapshot.birthDate),
      status: snapshot.status,
      createdAt: snapshot.createdAt,
      updatedAt: snapshot.updatedAt,
    });
  }
}
