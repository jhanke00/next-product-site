import { connectDB } from '../lib/db';
import { User } from '../models/User';
import { sampleUsers } from '../src/mock/users';

(async function () {
  await connectDB();
  await User.deleteMany(); // Clean existing
  await User.insertMany(sampleUsers);
  console.log('Users inserted');
  process.exit(0);
})();
