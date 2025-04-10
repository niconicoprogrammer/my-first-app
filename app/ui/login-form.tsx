'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';

export default function LoginForm() {

  // useActionState
  // useActionStateを呼び出すと、3つの戻り値が返ってくる
  // 1.サーバーアクションの結果
  // 2.サーバーアクションを呼び出すための関数
  // 3.サーバーアクションが実行中かどうかのフラグ
  // formのactionに2を指定すると、第一引数に指定されたserver actionが動く
  const [errorMessage, formAction, isPending] = useActionState(
    // 第一引数　動かしたい関数　server action
    authenticate,
    // 第二引数　初期状態（＝画面表示用のstateの初期値)
    undefined, // errorMessageの初期値
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        action={formAction}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6 border border-gray-200"
      >
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          続けるにはログインしてください
        </h1>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email address"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter password"
            required
            minLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'ログイン処理中...' : 'ログイン'}
        </button>

        <div>
          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}
        </div>
      </form>
    </div>
  );
}
