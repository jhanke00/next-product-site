import { User } from '@/src/type/users';
import React from 'react';

type PropsType = {
  userDetails: User;
};

const UserInfo = ({ userDetails }: PropsType) => {
  const { firstName, lastName, phoneNumber, email } = userDetails;
  return (
    <div className='flex flex-1 flex-row justify-around'>
      <div className='flex flex-1 flex-col '>
        <p>First Name: {firstName}</p>
        <p>Last Name: {lastName}</p>
      </div>
      <div className='flex flex-1 flex-col'>
        <p>Phone Number: {phoneNumber}</p>
        <p>Email: {email}</p>
      </div>
    </div>
  );
};

export default UserInfo;
