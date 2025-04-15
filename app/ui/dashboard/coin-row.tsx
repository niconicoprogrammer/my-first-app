'use client';

import { useRouter } from 'next/navigation';
import SparklineChart from '@/app/ui/dashboard/sparkline-chart';
import { useState } from 'react';
import TradeModal from '@/app/ui/dashboard/trade-modal'; // ← 追加

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

type Props = {
  coin: Coin;
  index: number;
};

export default function CoinRow({ coin, index }: Props) {
  const router = useRouter();
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [initialMode, setInitialMode] = useState<'buy' | 'sell'>('buy');

  const handleClick = () => {
    router.push(`/dashboard/${coin.id}`);
  };

  return (
    <>
      <tr   
        // onClick={handleClick} 
        className="hover:bg-gray-800 cursor-pointer transition"
      >
        <td className="py-3 px-4 w-[40px] text-gray-400">{index + 1}</td>

        <td className="py-3 px-4 w-[200px] flex items-center gap-3">
          <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
          <div className="flex flex-col">
            <span className="font-semibold text-white truncate">{coin.name}</span>
            <span className="uppercase text-xs text-gray-500">{coin.symbol}</span>
          </div>
        </td>

        <td className="py-3 px-4 w-[120px] font-medium text-green-400">
          ${coin.current_price.toLocaleString()}
        </td>

        <td className="py-3 px-4 w-[120px]">
          <SparklineChart data={coin.sparkline_in_7d.price} />
        </td>
        <td className="py-3 px-4 w-[120px] text-left text-sm text-white">
          0.00
        </td>

        <td className="py-3 px-4 w-[180px]">
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-blue-500 hover:bg-blue-400 rounded text-white text-xs"
              onClick={(e) => {
                e.stopPropagation();
                setInitialMode('buy');
                setShowTradeModal(true);
              }}
            >
              買う
            </button>
            <button
              className="px-3 py-1 bg-red-500 hover:bg-red-400 rounded text-white text-xs"
              onClick={(e) => {
                e.stopPropagation();
                setInitialMode('sell');
                setShowTradeModal(true);
              }}
            >
              売る
            </button>
          </div>
        </td>
      </tr>

    {showTradeModal && (
      <TradeModal
        open={showTradeModal}
        onClose={() => setShowTradeModal(false)}
        onSuccess={() => setShowTradeModal(false)}
        coin={coin}
        initialMode={initialMode} // ✅ ← 初期モードを明示
      />
    )}
    </>
  );
}
