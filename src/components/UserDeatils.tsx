/**
 * TODO: Implement UserDetails component
 * * This component will display user details such as name, email, and profile picture.
 *
 *
 */

import React from 'react';
// import styles from './UserDetails.module.css';
import { User } from '../type/users';
// import profilePic from '../assets/profile-pic.png';
interface UserDetailsProps {
  user: User;
}
const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  return (
    <div className='border p-4 rounded shadow-md max-w-sm'>
      <h2>{`${user.firstName} ${user.lastName}`}</h2>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phoneNumber}</p>
    </div>
  );
};
export default UserDetails;
