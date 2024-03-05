import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <Link href={'/contactus'}>Go to Contact Us Page</Link>
    </main>
  );
}
