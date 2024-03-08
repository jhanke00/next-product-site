import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'User able to contact us and share the feedback',
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
