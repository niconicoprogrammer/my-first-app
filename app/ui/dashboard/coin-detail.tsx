type Props = {
  id: string;
};

export default async function CoinDetail({ id }: Props) {
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return (
      <div className="text-red-400 text-center mt-6">
        データの取得に失敗しました
      </div>
    );
  }

  const coin = await res.json();

  const price = coin.market_data.current_price.usd;
  const change24h = coin.market_data.price_change_percentage_24h;
  const changeColor = change24h >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-[#1e293b] text-white p-6 rounded-xl shadow-lg space-y-6">
      {/* タイトルとロゴ */}
      <div className="flex items-center gap-4">
        <img src={coin.image.large} alt={coin.name} className="w-16 h-16 rounded" />
        <h1 className="text-3xl font-extrabold text-yellow-400">
          {coin.name}（{coin.symbol.toUpperCase()}）
        </h1>
      </div>

      {/* 情報リスト */}
      <ul className="space-y-1 text-sm text-gray-300">
        <li>
          <span className="text-white font-medium">現在価格:</span>{' '}
          ${price.toLocaleString()}
        </li>
        <li>
          <span className="text-white font-medium">時価総額:</span>{' '}
          ${coin.market_data.market_cap.usd.toLocaleString()}
        </li>
        <li>
          <span className="text-white font-medium">24h変動率:</span>{' '}
          <span className={changeColor}>{change24h?.toFixed(2)}%</span>
        </li>
        <li>
          <span className="text-white font-medium">過去最高値:</span>{' '}
          ${coin.market_data.ath.usd.toLocaleString()}
        </li>
        <li>
          <span className="text-white font-medium">循環供給量:</span>{' '}
          {coin.market_data.circulating_supply?.toLocaleString()}
        </li>
      </ul>

      {/* 概要 */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-yellow-400 mb-2">概要</h2>
        <div
          className="prose prose-sm prose-invert text-gray-300 max-w-none"
          dangerouslySetInnerHTML={{
            __html: coin.description.ja || coin.description.en || '説明がありません。',
          }}
        />
      </div>
    </div>
  );
}
