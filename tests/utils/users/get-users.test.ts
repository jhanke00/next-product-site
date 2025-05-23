import { mockLargeUsers, mockSmallUsers } from '@/tests/mocks/users';
import { getUsers } from '@/src/utils/users/get-users';

jest.mock('@/src/mock/large/users.json', () => mockLargeUsers);
jest.mock('@/src/mock/small/users.json', () => mockSmallUsers);

describe('getUsers', () => {
  test('returns a combined array of users', () => {
    const expected = [...mockLargeUsers, ...mockSmallUsers];

    const result = getUsers();
    expect(result).toEqual(expected);
  });
});
