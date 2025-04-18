'use client';

import CoinList from '@/app/ui/dashboard/coin-list';
import DepositModal from '@/app/ui/dashboard/deposit-modal';
import { useState, useEffect } from 'react';
import {fetchUsdBalance} from '@/app/lib/actions';

export default function Page() {
  const [page, setPage] = useState(1)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [usdTotal, setUsdTotal] = useState<number | null>(null)

  useEffect(() => {
    refreshUsdTotal()
  }, []) // ← 初回マウント時のみ実行

  function getPagination(current: number): number[] {
    if (current <= 3) return [1, 2, 3, 4, 5];
    return [current - 2, current - 1, current, current + 1, current + 2];
  }

  const pagination = getPagination(page);

  async function refreshUsdTotal() {
    const total = await fetchUsdBalance()
    setUsdTotal(total)
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white px-4 py-8">
      <div className="max-w-screen-xl mx-auto space-y-8">
        {/* ✅ 中央寄せ＆整列調整 */}
        <div className="flex flex-wrap justify-center items-end gap-x-12 gap-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-400">総資産</p>
            <p className="text-2xl font-semibold text-white">${usdTotal}</p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">米ドル資産</p>
            <p className="text-2xl font-semibold text-white">${usdTotal}</p>
          </div>

          <button
            onClick={() => setShowDepositModal(true)}
            className="px-5 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 font-semibold"
          >
            入金
          </button>
        </div>
        {/* タイトル */}
        <h1 className="text-3xl font-extrabold text-yellow-400">通貨一覧</h1>

        {/* Coin一覧 */}
        <CoinList page={page} onUsdRefresh={refreshUsdTotal} usdTotal={usdTotal}/>

        <div className="flex justify-center items-center gap-4 mt-8">
          {/* ← Prev */}
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-40 text-sm font-medium transition"
          >
            ← Prev
          </button>
          {/* ページ番号ボタン */}
          {pagination.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                page === p
                  ? 'bg-yellow-400 text-[#0f172a] font-bold'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {p}
            </button>
          ))}

          {/* → Next */}
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-[#0f172a] rounded-md text-sm font-semibold transition"
          >
            Next →
          </button>
        </div>
      </div>
      <DepositModal
        open={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onSuccess={() => {
          refreshUsdTotal()       // ✅ ← 再取得
          setShowDepositModal(false) // ✅ モーダルを閉じる
        }}
      />
    </main>
  );
}
