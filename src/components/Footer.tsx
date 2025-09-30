import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-gray-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8'>
          <div className='space-y-3 sm:space-y-4'>
            <h3 className='text-base sm:text-lg font-semibold'>About Us</h3>
            <p className='text-gray-400 text-sm sm:text-base'>
              Discover amazing products at great prices. Your one-stop shop for all your needs.
            </p>
          </div>

          <div className='space-y-3 sm:space-y-4'>
            <h3 className='text-base sm:text-lg font-semibold'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/products'
                  className='text-gray-400 hover:text-white text-sm sm:text-base transition-colors'
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href='/checkout/cart'
                  className='text-gray-400 hover:text-white text-sm sm:text-base transition-colors'
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div className='space-y-3 sm:space-y-4'>
            <h3 className='text-base sm:text-lg font-semibold'>Customer Service</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='#' className='text-gray-400 hover:text-white text-sm sm:text-base transition-colors'>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href='#' className='text-gray-400 hover:text-white text-sm sm:text-base transition-colors'>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href='#' className='text-gray-400 hover:text-white text-sm sm:text-base transition-colors'>
                  Shipping
                </Link>
              </li>
              <li>
                <Link href='#' className='text-gray-400 hover:text-white text-sm sm:text-base transition-colors'>
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Newsletter</h3>
            <p className='text-gray-400'>Subscribe to get special offers and updates.</p>
            <div className='flex'>
              <input
                type='email'
                placeholder='Enter your email'
                className='bg-gray-800 text-white px-4 py-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <button className='bg-blue-600 px-4 py-2 rounded-r hover:bg-blue-700'>Subscribe</button>
            </div>
          </div>
        </div>

        <div className='mt-8 pt-8 border-t border-gray-800 text-center text-gray-400'>
          <p>&copy; {new Date().getFullYear()} ShopNext. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
