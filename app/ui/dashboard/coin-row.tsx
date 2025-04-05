'use client';

import Link from 'next/link';

type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
};

type Props = {
  coin: Coin;
  index: number;
};

export default function CoinRow({ coin, index }: Props) {
  return (
    <tr className="hover:bg-gray-50 border-b">
      <td className="py-3 px-4">{index + 1}</td>
      <td className="py-3 px-4 flex items-center gap-2">
        <img src={coin.image} alt={coin.name} className="w-6 h-6" />
        <span className="font-medium">{coin.name}</span>
        <span className="uppercase text-xs text-gray-500 ml-1">{coin.symbol}</span>
      </td>
      <td className="py-3 px-4">${coin.current_price.toLocaleString()}</td>
      <td className="py-3 px-4">
        <Link href={`/dashboard/${coin.id}`} className="text-blue-500 hover:underline text-sm">
          詳細を見る
        </Link>
      </td>
    </tr>
  );
}
