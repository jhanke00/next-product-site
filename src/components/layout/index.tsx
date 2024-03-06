'use client';

import Main from '../modules/main/index';

export default function Layout({ children = null }) {
  return (
    <div className='layout'>
      <Main>{children}</Main>
    </div>
  );
}
