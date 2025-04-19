'use client';

import { useState, useEffect } from 'react';
import { fetchUnifiedHistory } from '@/app/lib/actions';

// 🔸 CoinGecko APIのレスポンス型を追加（★追加①）
type CoinGeckoCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
};

type UnifiedHistory = {
  id: string;
  type: 'deposit' | 'buy' | 'sell';
  date: string;
  symbol: string | null;
  amount: number | null;
  price: number | null;
  usdTotal: number;
  image?: string | null;
};

export default function HistoryList() {
  const [history, setHistory] = useState<UnifiedHistory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // 1. 履歴データを取得
      const rawHistory = await fetchUnifiedHistory();

      // 2. CoinGecko API に渡す symbol（通貨記号）をユニークな形で抽出する
      const uniqueSymbols = [
        // ③-1: JavaScriptの Set を使って重複した symbol を取り除く
        // ③-2: Set は配列じゃないので、スプレッド構文 `...` で配列に戻している
        ...new Set(
          rawHistory
            // ①: item.symbol が null の場合（入金など）を除外
            .filter((item) => item.symbol)
            // ②-1: 各履歴の symbol だけを取り出す（map で item → symbol に変換）
            // ②-2: 大文字・小文字の違いを統一するため、すべて小文字に変換している
            .map((item) => item.symbol!.toLowerCase())
        ),
      ];

      // 3. CoinGecko APIを叩いてimage付きのデータ取得
      const query = uniqueSymbols.join('%2C'); // URLエンコード
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=&symbols=${query}`
      );

      // 🔸 CoinGeckoCoin型を適用（★変更②）
      const coins: CoinGeckoCoin[] = await res.json();

      const symbolToImage: { [symbol: string]: string } = {};

      // 🔸 型付きでforEach（★変更③）
      coins.forEach((coin: CoinGeckoCoin) => {
        symbolToImage[coin.symbol.toLowerCase()] = coin.image;
      });

      // 5. imageをhistoryにマージ
      const enriched = rawHistory.map((item) => ({
        ...item,
        image: item.symbol
          ? symbolToImage[item.symbol.toLowerCase()] ?? null
          : null,
      }));

      setHistory(enriched);
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto space-y-6">
      {/* タイトル */}
      <h1 className="text-2xl font-bold text-yellow-400">取引履歴</h1>

      {/* テーブルヘッダー */}
      <div className="grid grid-cols-6 gap-4 text-sm text-gray-400 border-b border-gray-700 pb-2">
        <div>日付</div>
        <div>種別</div>
        <div>通貨</div>
        <div className="text-right">数量</div>
        <div className="text-right">単価（USD）</div>
        <div className="text-right">USD合計</div>
      </div>

      {/* 履歴リスト */}
      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-6 gap-4 text-sm items-center border-b border-gray-800 py-2 hover:bg-[#1e293b] rounded-md transition"
          >
            <div>{new Date(item.date).toLocaleString()}</div>

            <div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  item.type === 'deposit'
                    ? 'text-yellow-400 bg-yellow-800/20'
                    : item.type === 'buy'
                    ? 'text-blue-400 bg-blue-800/20'
                    : 'text-red-400 bg-red-800/20'
                }`}
              >
                {item.type === 'deposit'
                  ? '入金'
                  : item.type === 'buy'
                  ? '購入'
                  : '売却'}
              </span>
            </div>
            <div className="flex items-center gap-2">
                {item.symbol ? (
                    <>
                    {item.image ? (
                        <img src={item.image} alt={item.symbol} className="w-5 h-5" />
                    ) : (
                        <div className="w-5 h-5 bg-gray-600 rounded-full" />
                    )}
                    <span className="text-white font-semibold">
                        {item.symbol.toUpperCase()}
                    </span>
                    </>
                ) : (
                    <>
                    <div className="w-5 h-5 bg-yellow-500 rounded-full text-xs flex items-center justify-center font-bold text-black">
                        $
                    </div>
                    <span className="text-white font-semibold">USD</span>
                    </>
                )}
            </div>
            <div className="text-right text-white">
              {item.amount !== null ? item.amount.toFixed(8) : '–'}
            </div>

            <div className="text-right text-white">
              {item.price !== null ? `$${item.price.toLocaleString()}` : '–'}
            </div>

            <div className="text-right text-white">
              ${item.usdTotal.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
