import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { User } from '../../../models/User';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({});
    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
