'use client';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />

      <main className='flex-grow'>
        {/* Hero Section */}
        <section className='relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600'>
          <div className='absolute inset-0 bg-black opacity-50'></div>
          <div className='relative z-10 text-center text-white px-4'>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='text-5xl md:text-6xl font-bold mb-6'
            >
              Welcome to ShopNext
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='text-xl md:text-2xl mb-8'
            >
              Discover amazing products at unbeatable prices
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                href='/products'
                className='bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors'
              >
                Shop Now
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className='py-20 bg-gray-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl font-bold text-gray-900'>Why Choose Us?</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className='bg-white p-6 rounded-lg shadow-lg'
                >
                  <div className='text-3xl text-blue-600 mb-4'>{feature.icon}</div>
                  <h3 className='text-xl font-semibold mb-2'>{feature.title}</h3>
                  <p className='text-gray-600'>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='py-20 bg-blue-600'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
            <h2 className='text-3xl font-bold text-white mb-8'>Ready to start shopping?</h2>
            <Link
              href='/products'
              className='inline-block bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors'
            >
              View All Products
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const features = [
  {
    icon: '🚚',
    title: 'Free Shipping',
    description: 'Enjoy free shipping on all orders over $50. Fast and reliable delivery to your doorstep.',
  },
  {
    icon: '⭐',
    title: 'Quality Products',
    description: 'We carefully curate our product selection to ensure the highest quality for our customers.',
  },
  {
    icon: '🔒',
    title: 'Secure Payments',
    description: 'Shop with confidence using our secure payment gateway and protected checkout process.',
  },
];
