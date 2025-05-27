import { db } from '@/src/server/config/db';
import { pick } from '@utils/pick';
import { eq } from 'drizzle-orm';
import { UserSelect } from '@/src/server/repositories/user/types';
import { usersTable } from '@/src/server/repositories/user/user.schema';

class UserRepository {
  private readonly user = {
    id: usersTable.id,
    firstName: usersTable.firstName,
    lastName: usersTable.lastName,
    phoneNumber: usersTable.phoneNumber,
    email: usersTable.email,
  };

  async findById(params: Pick<UserSelect, 'id'> & { select?: Array<keyof UserSelect> }) {
    const { select = [], id } = params;

    const user = await db.select(pick(this.user, select)).from(usersTable).where(eq(this.user.id, id));

    return user[0] ?? null;
  }
}

export const userRepository = new UserRepository();
