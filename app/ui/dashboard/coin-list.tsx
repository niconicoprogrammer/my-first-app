'use client';

import { useEffect, useState } from 'react';
import CoinRow from '@/app/ui/dashboard/coin-row';

type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
};

export default function CoinList({ page }: { page: number }) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    // ✅ ページ番号をURLに反映してAPI呼び出し
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=${ITEMS_PER_PAGE}&page=${page}&sparkline=false`
    )
      .then((res) => res.json())
      .then((data) => setCoins(data))
      .catch((error) => console.error('APIエラー:', error));
  }, [page]); // ✅ page が変わるたびに再取得！

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="text-left text-sm text-gray-500 border-b">
            <th className="py-2 px-4">#</th>
            <th className="py-2 px-4">通貨</th>
            <th className="py-2 px-4">価格</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, index) => (
            <CoinRow key={coin.id} index={index} coin={coin} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
