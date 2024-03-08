import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Message',
  description: 'List all user messages for admin review',
};

export default function MessageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
