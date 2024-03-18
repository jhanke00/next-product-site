// User API Endpoint for Small Dataset #14
// Endpoint that returns the user information

import { NextApiRequest, NextApiResponse } from 'next';
import usersData from '../../src/mock/small/users.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  // Assuming there's only one user in the mock data
  const userInfo = usersData[0];
  res.status(200).json(userInfo);
}
