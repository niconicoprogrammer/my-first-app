'use client';

import { LineChart, Line, YAxis } from 'recharts';

export default function SparklineChart({ data }: { data: number[] }) {
  // 全データをそのまま使う
  const formatted = data.map((value, index) => ({ index, value }));

  // 値動きの判定（終値 - 始値）
  const isUp = data.at(-1)! > data[0];
  const strokeColor = isUp ? '#22c55e' : '#ef4444'; // 緑 or 赤

  // Y軸スケール調整用
  const min = Math.min(...data);
  const max = Math.max(...data);
  const yPadding = (max - min) * 0.2; // 上下に20%余白

  return (
    <LineChart width={100} height={30} data={formatted}>
      <YAxis
        domain={[min - yPadding, max + yPadding]} // ✅ 値動きを大きく見せる
        hide
      />
      <Line
        type="monotone"
        dataKey="value"
        stroke={strokeColor}         // ✅ 色分け
        strokeWidth={2}
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  );
}
