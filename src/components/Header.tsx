import Link from 'next/link';

export default function Header() {
  return (
    <header className='bg-slate-700 text-green-100 w-full'>
      <Link href='/'>
        <div>
          <h1 className='text-3xl'>Bayer</h1>
          <p className='text-2xl mt-2 sm:mt-0 sm:ml-4'>Next-Product-Site</p>
        </div>
      </Link>
    </header>
  );
}
