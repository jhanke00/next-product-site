import SearchBox from '@components/product-search/SearchBox';

export default function ProductSearchPage() {
  return (
    <main className='p-6 max-w-6xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>Product Search</h1>
      <SearchBox />
    </main>
  );
}
