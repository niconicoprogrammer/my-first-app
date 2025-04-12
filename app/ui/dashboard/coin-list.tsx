'use client';

import { useEffect, useState } from 'react';
import CoinRow from '@/app/ui/dashboard/coin-row';

type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  sparkline_in_7d: {
    price: number[];
  };
};

export default function CoinList({ page }: { page: number }) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=${ITEMS_PER_PAGE}&page=${page}&sparkline=true`
    )
      .then((res) => res.json())
      .then((data) => setCoins(data))
      .catch((error) => console.error('APIエラー:', error));
  }, [page]);

  return (
    <div className="w-full overflow-x-auto bg-[#0f172a] px-4 py-6 rounded-xl shadow-lg">
      <table className="min-w-full table-auto border-collapse text-sm text-white">
        <thead>
          <tr className="text-left border-b border-gray-700 text-gray-400 uppercase text-xs tracking-wider">
            <th className="py-3 px-4 w-[40px]">#</th>
            <th className="py-3 px-4 w-[200px]">通貨</th>
            <th className="py-3 px-4 w-[120px]">価格</th>
            <th className="py-3 px-4 w-[120px]">7日間</th>
            <th className="py-3 px-4 w-[120px]">保有量</th>
            <th className="py-3 px-4 w-[180px]">操作</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, index) => (
            <CoinRow key={coin.id} index={index + (10 * page) - 10} coin={coin} />
          ))}
        </tbody>
      </table>
    </div>
  );
}