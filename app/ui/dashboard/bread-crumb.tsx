'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
  const pathname = usePathname(); // 例: "/dashboard/detail/bitcoin"
  const segments = pathname.split('/').filter(Boolean); // ["dashboard", "detail", "bitcoin"]

  return (
    <nav className="text-sm text-gray-400 mb-4">
      <ol className="flex items-center flex-wrap gap-1">
      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const label = decodeURIComponent(segment);

        return (
          <li key={href} className="flex items-center gap-1">
            {index !== 0 && <span className="text-gray-500">›</span>}
            <Link href={href} className="hover:text-yellow-400 transition">
              {label}
            </Link>
          </li>
        );
      })}
      </ol>
    </nav>
  );
}
