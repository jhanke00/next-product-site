import { IUser } from '@type/users';

export const formUsername = (user: Pick<IUser, 'firstName' | 'lastName'> | null | undefined) => {
  if (!user) {
    return '';
  }

  const { lastName, firstName } = user;

  return [firstName, lastName].filter(Boolean).join(' ').trim();
};
