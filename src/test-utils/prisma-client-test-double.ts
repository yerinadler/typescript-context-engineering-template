class PrismaUserDelegate {
  upsert = async () => ({}) as unknown;
  findUnique = async () => null;
  findMany = async () => [] as unknown[];
  deleteMany = async () => ({ count: 0 });
}

class PrismaProductDelegate {
  findUnique = async () => null;
  findMany = async () => [] as unknown[];
  create = async () => ({}) as unknown;
  update = async () => ({}) as unknown;
}

class PrismaClient {
  user = new PrismaUserDelegate();
  product = new PrismaProductDelegate();

  async $disconnect(): Promise<void> {
    return;
  }
}

export { PrismaClient };
