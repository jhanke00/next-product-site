import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import userData from '@mock/small/users.json';
import { User } from '@/src/type/users';

const useUserInfo = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [userInfo, setUserInfo] = useState<User>();

  useEffect(() => {
    const userInfoDetails: any = userData?.filter((user) => user.id === userId);
    setUserInfo(userInfoDetails[0]);
  }, [userId]);

  return { userInfo };
};

export default useUserInfo;
