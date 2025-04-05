'use client';

import Link from 'next/link';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const link = { name: 'start', href: '/'};

export default function NavLink() {
  return (
    <div>
        <Link
            key={link.name}
            href={link.href}
        >
            {link.name}
        </Link>
    </div>
  );
}