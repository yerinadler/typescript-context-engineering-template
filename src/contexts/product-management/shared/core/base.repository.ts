export interface Repository<TEntity, TId = string> {
  findById(id: TId): Promise<TEntity | null>;
  list(): Promise<TEntity[]>;
  save(entity: TEntity): Promise<void>;
  update(entity: TEntity): Promise<void>;
}

export abstract class BaseRepository<TEntity, TId = string> implements Repository<TEntity, TId> {
  abstract findById(id: TId): Promise<TEntity | null>;
  abstract list(): Promise<TEntity[]>;
  abstract save(entity: TEntity): Promise<void>;
  abstract update(entity: TEntity): Promise<void>;
}
