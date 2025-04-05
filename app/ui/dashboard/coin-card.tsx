'use client';

import Link from 'next/link';

type Props = {
  id: string;
  name: string;
  image: string;
  current_price: number;
};

export default function CoinCard({ id, name, image, current_price }: Props) {
  return (
    <Link href={`/dashboard/${id}`}>
      <div className="border rounded p-4 shadow hover:shadow-md transition cursor-pointer">
        <div className="flex items-center gap-3">
          <img src={image} alt={name} className="w-8 h-8" />
          <div>
            <h2 className="text-base font-semibold">{name}</h2>
            <p className="text-sm text-gray-600">${current_price.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
