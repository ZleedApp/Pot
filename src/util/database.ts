import { User } from '../models';

class Database {
  static async getUser(
    id: string | number | bigint | boolean
  ): Promise<any | undefined> {
    const user = await User.findOne({ id: BigInt(id) });

    if (!user) return undefined;

    return user;
  }
}

export default Database;
