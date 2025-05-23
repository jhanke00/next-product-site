import Link from 'next/link';
import { User } from '@/src/type/users';

interface Props {
  user: User;
}

const UserCard = ({ user }: Props) => {
  return (
    <div className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'>
      <Link href={`/users/${user.id}`}>
        <h3 className='mb-3 text-2xl font-semibold'>
          {user.firstName} {user.lastName}
        </h3>
        <p className='m-0 max-w-[50ch] text-sm opacity-50'>Phone: {user.phoneNumber}</p>
        <p className='m-0 max-w-[50ch] text-sm opacity-50'>Email: {user.email}</p>
      </Link>
    </div>
  );
};

export default UserCard;
