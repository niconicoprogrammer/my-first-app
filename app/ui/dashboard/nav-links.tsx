'use client';

import Link from 'next/link';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: '資産管理', href: '/dashboard'},
  { name: '取引履歴', href: '/dashboard/backtest'},
];

export default function NavLinks() {
  return (
    <>
      {links.map((link) => (
        <div key={link.name}>
          <Link href={link.href}>{link.name}</Link>
        </div>
      ))}
    </>
  );
}
