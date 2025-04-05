// app/components/Breadcrumb.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
  const pathname = usePathname(); // 例: "/dashboard/detail/bitcoin"
  const segments = pathname.split('/').filter(Boolean); // ["dashboard", "detail", "bitcoin"]

  // パスを順に組み立てて表示する
  return (
    <nav style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
      <span>
        <Link href="/">Home</Link>
      </span>
      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const label = decodeURIComponent(segment);

        return (
          <span key={href}>
            {' > '}
            <Link href={href}>{label}</Link>
          </span>
        );
      })}
    </nav>
  );
}
