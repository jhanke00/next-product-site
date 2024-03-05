import Link from 'next/link';
import React from 'react';

export default function PrimaryHeader() {
  return (
    <nav className='navbar navbar-expand-md bg-body-tertiary p-3 label-m'>
      <div className='container-fluid '>
        <Link className='navbar-brand' href='#'>
          Navbar
        </Link>
        <Link className='mx-2' aria-current='page' href='/contactus'>
          Contact Us
        </Link>
        <Link className='nav-link' href='/products'>
          Products
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNav'></div>
      </div>
    </nav>
  );
}
