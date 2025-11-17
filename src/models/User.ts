import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
