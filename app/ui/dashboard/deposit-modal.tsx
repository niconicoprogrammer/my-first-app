'use client'

import { useActionState, useEffect } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { depositAction } from '@/app/lib/actions'
import { useNotification } from '@/app/ui/dashboard/notification-context';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

type State = {
    success: boolean;
    errorMessage: string | null;
}

const initialState: State = {
    success: false,
    errorMessage: null,
}

export default function DepositModal({ open, onClose, onSuccess }: Props) {
  const { notify } = useNotification()
  const [state, formAction, isPending] = useActionState(
    depositAction,
    initialState
  )

  // useEffect(() => {
  //   if (state.success) {
  //     state.success = false // 成功フラグをリセット
  //     onSuccess()
  //   }
  // }, [state.success])

  useEffect(() => {
    if (state.success) {
      notify() // ✅ 入金成功時に通知

      state.success = false // 成功フラグをリセット
      onSuccess()
    }
  }, [state.success])

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* 背景のオーバーレイ */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      {/* モーダル本体 */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-[#1e293b] text-white shadow-xl rounded-2xl p-6 w-full max-w-md border border-gray-700">
          <DialogTitle className="text-lg font-bold mb-4 text-yellow-400">
            入金フォーム
          </DialogTitle>

          <form action={formAction} className="space-y-4">
            <label className="block text-sm text-gray-300 mb-1">金額 (USD)</label>
            <input
              type="number"
              step="1"
              name="amount"
              className="w-full bg-[#0f172a] text-white border border-gray-600 p-2 rounded mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="例: 100"
            />
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
                disabled={isPending}
                className={`px-4 py-2 rounded font-semibold transition ${
                    isPending
                    ? 'bg-yellow-300 text-[#0f172a] cursor-wait'
                    : 'bg-yellow-400 text-[#0f172a] hover:bg-yellow-300'
                }`}
                >
                {isPending ? '入金中...' : '入金する'}
              </button>
            </div>
          </form>

            {/* 結果表示 */}
            {state?.success && (<p className="text-red-500 mt-4">入金が完了しました。</p>)}
            {state?.errorMessage && (<p className="text-red-500 mt-4">{state.errorMessage}</p>)}
        </DialogPanel>
      </div>
    </Dialog>
  )
}
