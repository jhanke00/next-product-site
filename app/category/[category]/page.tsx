import { redirect } from 'next/navigation';

export default function CategoryPage({ params }: { params: { category: string } }) {
  redirect(`/products/category/${params.category}`);
}
