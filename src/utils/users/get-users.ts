import { User } from '@/src/type/users';

import largeData from '@/src/mock/large/users.json';
import smallData from '@/src/mock/small/users.json';

export const getUsers = (): User[] => {
  return [...largeData, ...smallData];
};
