// app/ui/dashboard/coin-detail.tsx

type Props = {
    id: string;
  };
  
  export default async function CoinDetail({ id }: Props) {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`, {
      next: { revalidate: 60 }, // optional: キャッシュ対策（毎分更新）
    });
  
    if (!res.ok) {
      return <div>データの取得に失敗しました</div>;
    }
  
    const coin = await res.json();
  
    return (
      <div>
        <h1>
          {coin.name}（{coin.symbol.toUpperCase()}）
        </h1>
        <img src={coin.image.large} alt={coin.name} width={64} />
        <ul>
          <li>現在価格: ${coin.market_data.current_price.usd.toLocaleString()}</li>
          <li>時価総額: ${coin.market_data.market_cap.usd.toLocaleString()}</li>
          <li>24h変動率: {coin.market_data.price_change_percentage_24h?.toFixed(2)}%</li>
          <li>過去最高値: ${coin.market_data.ath.usd.toLocaleString()}</li>
          <li>循環供給量: {coin.market_data.circulating_supply?.toLocaleString()}</li>
        </ul>
        <div style={{ marginTop: '1rem' }}>
          <h2>概要</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: coin.description.ja || coin.description.en || '説明がありません。',
            }}
          />
        </div>
      </div>
    );
  }
  