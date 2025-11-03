'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/src/components/Navigation';
import { ShoppingBagIcon, SparklesIcon, TruckIcon, ShieldCheckIcon, StarIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { AddToCartButton } from '@/src/components/AddToCartButton';
import Image from 'next/image';

interface Category {
  name: string;
  count: number;
  minPrice: number;
  maxPrice: number;
  averageRating: number;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
  rating: number;
  numReviews: number;
  countInStock: number;
}

const categoryImages: Record<string, string> = {
  Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop&crop=center',
  Clothing: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop&crop=center',
  Books: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&crop=center',
  Home: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center',
  Sports: 'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=400&h=300&fit=crop&crop=center',
  Beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&crop=center',
  Toys: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=300&fit=crop&crop=center',
  Automotive: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop&crop=center',
  Garden: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=center',
  Health: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center',
  Jewelery: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&crop=center',
  Movies: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=300&fit=crop&crop=center',
  Music: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center',
  Games: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&crop=center',
  Tools: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop&crop=center',
  Baby: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop&crop=center',
  Kids: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
  Shoes: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&crop=center',
  Grocery: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop&crop=center',
  Outdoors: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop&crop=center',
  Industrial: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&crop=center',
  Computers: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&h=300&fit=crop&crop=center',
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchFeaturedProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=8&sortBy=rating&sortOrder=desc');
      const data = await response.json();
      setFeaturedProducts(data.products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-white'>
      <Navigation />

      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden'>
        <div className='absolute inset-0 bg-black/20'></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop&crop=center')] bg-cover bg-center opacity-20"></div>

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <div>
              <div className='inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8'>
                <SparklesIcon className='w-4 h-4 mr-2' />
                Free shipping on orders over $50
              </div>
              <h1 className='text-4xl lg:text-6xl font-bold mb-6 leading-tight'>
                Discover Premium
                <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                  {' '}
                  Products
                </span>
              </h1>
              <p className='text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed'>
                Shop the latest trends across electronics, fashion, home & garden, and more. Quality products at
                unbeatable prices.
              </p>
              <div className='flex flex-col sm:flex-row gap-4'>
                <Link
                  href='/products'
                  className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                >
                  <ShoppingBagIcon className='w-5 h-5 mr-2' />
                  Shop Now
                </Link>
                <a
                  href='#categories'
                  className='border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200 flex items-center justify-center backdrop-blur-sm'
                >
                  Browse Categories
                  <ChevronRightIcon className='w-5 h-5 ml-2' />
                </a>
              </div>
            </div>

            <div className='hidden lg:block'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-4'>
                  <div className='bg-white/20 backdrop-blur-sm rounded-2xl p-6 transform rotate-3 border border-white/20'>
                    <Image
                      src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop&crop=center'
                      alt='Electronics'
                      width={300}
                      height={200}
                      className='w-full h-32 object-cover rounded-lg mb-4'
                    />
                    <h3 className='font-semibold text-white'>Latest Electronics</h3>
                    <p className='text-sm text-gray-200'>From $29</p>
                  </div>
                  <div className='bg-white/20 backdrop-blur-sm rounded-2xl p-6 transform -rotate-2 border border-white/20'>
                    <Image
                      src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop&crop=center'
                      alt='Fashion'
                      width={300}
                      height={200}
                      className='w-full h-32 object-cover rounded-lg mb-4'
                    />
                    <h3 className='font-semibold text-white'>Fashion Trends</h3>
                    <p className='text-sm text-gray-200'>From $19</p>
                  </div>
                </div>
                <div className='space-y-4 mt-8'>
                  <div className='bg-white/20 backdrop-blur-sm rounded-2xl p-6 transform -rotate-1 border border-white/20'>
                    <Image
                      src='https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop&crop=center'
                      alt='Home'
                      width={300}
                      height={200}
                      className='w-full h-32 object-cover rounded-lg mb-4'
                    />
                    <h3 className='font-semibold text-white'>Home Essentials</h3>
                    <p className='text-sm text-gray-200'>From $15</p>
                  </div>
                  <div className='bg-white/20 backdrop-blur-sm rounded-2xl p-6 transform rotate-2 border border-white/20'>
                    <Image
                      src='https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=300&h=200&fit=crop&crop=center'
                      alt='Sports'
                      width={300}
                      height={200}
                      className='w-full h-32 object-cover rounded-lg mb-4'
                    />
                    <h3 className='font-semibold text-white'>Sports & Fitness</h3>
                    <p className='text-sm text-gray-200'>From $25</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <TruckIcon className='w-12 h-12 mx-auto mb-4 text-blue-600' />
              <h3 className='text-xl font-semibold mb-2 text-gray-900'>Fast Delivery</h3>
              <p className='text-gray-600'>Get your products delivered quickly and safely</p>
            </div>
            <div className='text-center'>
              <ShieldCheckIcon className='w-12 h-12 mx-auto mb-4 text-blue-600' />
              <h3 className='text-xl font-semibold mb-2 text-gray-900'>Quality Assured</h3>
              <p className='text-gray-600'>All products meet our high quality standards</p>
            </div>
            <div className='text-center'>
              <SparklesIcon className='w-12 h-12 mx-auto mb-4 text-blue-600' />
              <h3 className='text-xl font-semibold mb-2 text-gray-900'>Best Prices</h3>
              <p className='text-gray-600'>Competitive prices across all categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id='categories' className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>Shop by Category</h2>
            <p className='text-xl text-gray-600'>
              Find exactly what you&apos;re looking for in our organized categories
            </p>
          </div>

          {loading ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
              {[...Array(20)].map((_, index) => (
                <div key={index} className='animate-pulse'>
                  <div className='bg-gray-300 rounded-2xl h-48'></div>
                </div>
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  className='group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden'
                >
                  <div className='aspect-w-16 aspect-h-12 overflow-hidden'>
                    <Image
                      src={
                        categoryImages[category.name] ||
                        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center'
                      }
                      alt={category.name}
                      width={400}
                      height={300}
                      className='w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300'
                    />
                  </div>
                  <div className='p-4'>
                    <h3 className='font-bold text-gray-900 group-hover:text-blue-600 mb-1 text-lg'>{category.name}</h3>
                    <p className='text-sm text-gray-500 mb-3'>{category.count} products</p>
                    <div className='flex items-center justify-between'>
                      <div className='text-sm'>
                        <div className='text-blue-600 font-bold text-base'>From ${category.minPrice}</div>
                        <div className='flex items-center text-xs text-yellow-500 mt-1'>
                          <StarIcon className='w-3 h-3 mr-1 fill-current' />
                          {category.averageRating.toFixed(1)}
                        </div>
                      </div>
                      <ChevronRightIcon className='w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors' />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>Featured Products</h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Discover our top-rated products loved by thousands of customers
            </p>
          </div>

          {productsLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {[...Array(8)].map((_, index) => (
                <div key={index} className='animate-pulse'>
                  <div className='bg-gray-300 rounded-2xl h-80'></div>
                </div>
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className='group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden'
                >
                  <div className='aspect-w-1 aspect-h-1 overflow-hidden'>
                    <Image
                      src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&sig=${product.id}`}
                      alt={product.name}
                      width={400}
                      height={400}
                      className='w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300'
                    />
                  </div>
                  <div className='p-6'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full'>
                        {product.category}
                      </span>
                      <div className='flex items-center text-yellow-500'>
                        <StarIcon className='w-4 h-4 fill-current' />
                        <span className='text-sm font-medium ml-1'>{product.rating}</span>
                      </div>
                    </div>
                    <h3 className='font-bold text-gray-900 group-hover:text-blue-600 mb-2 line-clamp-2'>
                      {product.name}
                    </h3>
                    <p className='text-gray-600 text-sm mb-3 line-clamp-2'>{product.description}</p>
                    <div className='flex items-center justify-between mb-4'>
                      <div className='text-2xl font-bold text-blue-600'>${product.price}</div>
                      <div className='text-sm text-gray-500'>
                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                    <AddToCartButton product={product} size='sm' className='w-full' />
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className='text-center mt-12'>
            <Link
              href='/products'
              className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            >
              View All Products
              <ChevronRightIcon className='w-5 h-5 ml-2' />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>What Our Customers Say</h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Join thousands of satisfied customers who trust us for their shopping needs
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100'>
              <div className='flex justify-center mb-4'>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className='w-5 h-5 text-yellow-400 fill-current' />
                ))}
              </div>
              <p className='text-gray-700 mb-6 italic'>
                &ldquo;Amazing quality products and super fast delivery! I&apos;ve ordered multiple times and never been
                disappointed.&rdquo;
              </p>
              <div className='flex items-center justify-center'>
                <Image
                  src='https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
                  alt='Sarah Johnson'
                  width={100}
                  height={100}
                  className='w-12 h-12 rounded-full mr-3'
                />
                <div className='text-left'>
                  <div className='font-semibold text-gray-900'>Sarah Johnson</div>
                  <div className='text-sm text-gray-600'>Verified Buyer</div>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100'>
              <div className='flex justify-center mb-4'>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className='w-5 h-5 text-yellow-400 fill-current' />
                ))}
              </div>
              <p className='text-gray-700 mb-6 italic'>
                &ldquo;Great customer service and competitive prices. The search and filter features make shopping so
                easy!&rdquo;
              </p>
              <div className='flex items-center justify-center'>
                <Image
                  src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
                  alt='Mike Chen'
                  width={100}
                  height={100}
                  className='w-12 h-12 rounded-full mr-3'
                />
                <div className='text-left'>
                  <div className='font-semibold text-gray-900'>Mike Chen</div>
                  <div className='text-sm text-gray-600'>Verified Buyer</div>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100'>
              <div className='flex justify-center mb-4'>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className='w-5 h-5 text-yellow-400 fill-current' />
                ))}
              </div>
              <p className='text-gray-700 mb-6 italic'>
                &ldquo;Love the variety of products available. From electronics to home goods, they have everything I
                need.&rdquo;
              </p>
              <div className='flex items-center justify-center'>
                <Image
                  src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
                  alt='Emma Davis'
                  width={100}
                  height={100}
                  className='w-12 h-12 rounded-full mr-3'
                />
                <div className='text-left'>
                  <div className='font-semibold text-gray-900'>Emma Davis</div>
                  <div className='text-sm text-gray-600'>Verified Buyer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className='py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>Stay Updated with Latest Deals</h2>
          <p className='text-xl mb-8 opacity-90'>
            Subscribe to our newsletter and be the first to know about new products, exclusive offers, and special
            discounts.
          </p>
          <form className='flex flex-col sm:flex-row gap-4 max-w-md mx-auto'>
            <input
              type='email'
              placeholder='Enter your email address'
              className='flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30'
            />
            <button
              type='submit'
              className='bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap'
            >
              Subscribe Now
            </button>
          </form>
          <p className='text-sm opacity-75 mt-4'>No spam, unsubscribe at any time. We respect your privacy.</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-gray-900 text-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>Ready to Start Shopping?</h2>
          <p className='text-xl mb-8 opacity-90'>Browse our complete catalog or search for specific items</p>
          <Link
            href='/products'
            className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center'
          >
            <ShoppingBagIcon className='w-5 h-5 mr-2' />
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
