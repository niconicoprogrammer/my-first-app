'use client';

import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/${coin.id}`);
  };

  return (
    <tr
      onClick={handleClick} // ✅ 行クリックでページ遷移
      className="hover:bg-gray-50 cursor-pointer border-b"
    >
      <td className="py-3 px-4">{index + 1}</td>
      <td className="py-3 px-4 flex items-center gap-2">
        <img src={coin.image} alt={coin.name} className="w-6 h-6" />
        <span className="font-medium">{coin.name}</span>
        <span className="uppercase text-xs text-gray-500 ml-1">{coin.symbol}</span>
      </td>
      <td className="py-3 px-4">${coin.current_price.toLocaleString()}</td>
    </tr>
  );
}
