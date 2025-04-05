'use client';

import Link from 'next/link';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Dashboard', href: '/dashboard'},
  { name: 'Backtest', href: '/dashboard/backtest'},
  { name: 'Monitor', href: '/dashboard/monitor'},
  { name: 'Signals', href: '/dashboard/signals'},
  { name: 'Trade', href: '/dashboard/trade'},
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
