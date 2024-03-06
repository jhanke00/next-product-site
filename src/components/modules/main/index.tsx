'use client';

import './main.scss';

export default function Main({ children = null }) {
  return (
    <main className='main' id='main' aria-labelledby='mainContent'>
      {children}
    </main>
  );
}
