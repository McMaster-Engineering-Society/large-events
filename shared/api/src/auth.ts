import { eq } from 'drizzle-orm';
import { db, users } from '@large-event/database';

export async function findUserByEmail(email: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user.length > 0 ? user[0] : null;
}

export async function userExists(email: string): Promise<boolean> {
  const user = await findUserByEmail(email);
  return user !== null;
}