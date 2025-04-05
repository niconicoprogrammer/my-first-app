// app/dashboard/coin-link.tsx
'use client';

import Link from 'next/link';

type Props = {
  id: string;
  name: string;
  image: string;
  current_price: number;
};

export default function CoinLink({ id, name, image, current_price }: Props) {
  return (
    <li>
      <Link href={`/dashboard/${id}`}>
        <img
          src={image}
          width={20}
          alt={name}
          style={{ verticalAlign: 'middle', marginRight: '8px' }}
        />
        {name} - ${current_price}
      </Link>
    </li>
  );
}
