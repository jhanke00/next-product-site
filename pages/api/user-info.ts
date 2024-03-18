// User API Endpoint for Small Dataset #14
// Endpoint that returns the user information

import { NextApiRequest, NextApiResponse } from 'next';
import usersData from '../../src/mock/small/users.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!Array.isArray(usersData) || usersData.length === 0) {
    console.error('User data not found');
    return res.status(500).json({ message: 'Internal Server Error' });
  }

  const userId = req.headers['user-id']; // Assuming the header is named 'user-id'

  if (!userId) {
    return res.status(400).json({ message: 'User ID not provided in the header' });
  }

  // Find the user with the provided ID
  const user = usersData.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Assuming there's only one user in the mock data
  // const userInfo = usersData[0];
  res.status(200).json(user);
}
