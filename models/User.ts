import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: String,
  email: String,
  age: Number,
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
