import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to products page
  redirect('/products');
}
