'use client';

import CoinList from '@/app/ui/dashboard/coin-list';
import { useState } from 'react';

export default function Page() {
  // ✅ ページ番号を useState で管理
  const [page, setPage] = useState(1);

  return (
    <main>
      <div className="text-lg font-bold mb-4">一覧</div>

      {/* ✅ CoinList に page を渡す */}
      <CoinList page={page} />

      {/* ✅ ページネーションボタン */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">{page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </main>
  );
}