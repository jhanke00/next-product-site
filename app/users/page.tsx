import Link from 'next/link';

import { getUsers } from '@/src/utils/users/get-users';
import { User } from '@/src/type/users';
import UserCard from '@/src/components/users/UserCard';

const PAGE_SIZE = 40;

interface PaginatedData {
  paginatedData: User[];
  totalPages: number;
}

interface Props {
  searchParams: { page?: string };
}

const getPaginatedData = (currentPage: number, pageSize: number): PaginatedData => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = getUsers();
  const paginatedData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / pageSize);

  return {
    paginatedData,
    totalPages,
  };
};

const Users = ({ searchParams }: Props) => {
  const currentPage = parseInt(searchParams?.page ?? '1', 10);
  const { paginatedData: usersData, totalPages } = getPaginatedData(currentPage, PAGE_SIZE);

  return (
    <>
      <div className='max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
        <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:text-left'>
          {usersData.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>

      <div className='flex justify-around w-full border-t-2 pt-4'>
        <Link href={`?page=${currentPage - 1}`}>
          <button disabled={currentPage === 1} aria-disabled={currentPage === 1}>
            Previous
          </button>
        </Link>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Link href={`?page=${currentPage + 1}`}>
          <button disabled={currentPage === totalPages} aria-disabled={currentPage === totalPages}>
            Next
          </button>
        </Link>
      </div>
    </>
  );
};

export default Users;
