'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const handleSubmit = () => {
    router.push('/products');
  };
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24 bg-back text-black'>
      <button
        onClick={() => handleSubmit()}
        className='bg-black text-white py-2 px-4 rounded hover:bg-gray-800 '
        style={{ border: '1px solid white', padding: '5px' }}
      >
        Go to Product page....
      </button>
    </main>
  );
}
