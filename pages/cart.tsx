import Cart from '../components/Cart';
import Link from 'next/link';

export default function CartPage() {
  return (
    <div>
      <Link href='/' style={{ display: 'block', marginBottom: 16 }}>
        ← Back
      </Link>
      <Cart />
    </div>
  );
}
