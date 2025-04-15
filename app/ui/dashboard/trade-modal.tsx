'use client';

import { useActionState, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { tradeAction } from '@/app/lib/actions'

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
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  coin: Coin;
  initialMode?: 'buy' | 'sell'; // ← 追加
};

type State = {
    success: boolean;
    errorMessage: string | null;
}

const initialState: State = {
    success: false,
    errorMessage: null,
}

export default function TradeModal({ open, onClose, onSuccess,  coin, initialMode = 'buy' }: Props) {
  const [mode, setMode] = useState<'buy' | 'sell'>(initialMode); // ← 初期値
  const [state, formAction, isPending] = useActionState(tradeAction, initialState);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* オーバーレイ */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      
      {/* モーダル */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-[#1e293b] text-white shadow-xl rounded-2xl p-6 w-full max-w-md border border-gray-700">
          
          {/* タイトル */}
          <DialogTitle className="text-lg font-bold mb-4 text-yellow-400">
          {coin.name}（{coin.symbol.toUpperCase()}）の{mode === 'buy' ? '購入' : '売却'}
          </DialogTitle>

          {/* モード切替 */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode('buy')}
              className={`px-4 py-1 rounded font-semibold transition ${
                mode === 'buy'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              買う
            </button>
            <button
              onClick={() => setMode('sell')}
              className={`px-4 py-1 rounded font-semibold transition ${
                mode === 'sell'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              売る
            </button>
          </div>

          {/* 入力フォーム */}
          <form action={formAction} className="space-y-4">

            <label className="block text-sm text-gray-300 mb-1">
              金額 (USD)
            </label>
            <input
              type="number"
              step="1"
              name="amount"
              className="w-full bg-[#0f172a] text-white border border-gray-600 p-2 rounded mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="例: 100"
            />

            <input type="hidden" name="symbol" value={coin.symbol} />
            <input type="hidden" name="price" value={coin.current_price} />
            <input type="hidden" name="mode" value={mode} />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded font-semibold transition ${
                  mode === 'buy'
                    ? 'bg-blue-500 hover:bg-blue-400 text-white'
                    : 'bg-red-500 hover:bg-red-400 text-white'
                }`}
              >
                {mode === 'buy' ? '購入する' : '売却する'}
              </button>
            </div>
          </form>

          {/* ✅ エラーメッセージの表示 */}
          {state.errorMessage && (
            <p className="mt-4 text-sm text-red-500">{state.errorMessage}</p>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
