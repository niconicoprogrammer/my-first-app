'use client'

import Link from 'next/link';
import { signup } from '@/app/lib/actions'
import { useActionState } from 'react';
import { useState } from 'react';

export default function Page() {
  const [email, setEmail] = useState('');

  const [errorMessage, formAction, isPending] = useActionState(
    signup,
    undefined
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
      <form
        action={formAction}
        className="bg-[#1e293b] text-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 border border-gray-700"
      >
        <h1 className="text-3xl font-extrabold text-center text-yellow-400">
          新規登録
        </h1>

        {errorMessage && (
          <div className="bg-red-500/10 text-red-400 border border-red-400 rounded p-3 text-sm text-center">
            {errorMessage}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2 bg-[#0f172a] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 block w-full px-4 py-2 bg-[#0f172a] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-yellow-400 text-[#0f172a] font-semibold py-2 px-4 rounded-md hover:bg-yellow-300 transition disabled:opacity-50"
        >
          {isPending ? '登録中...' : '新規登録'}
        </button>

        <div className="text-center text-sm text-gray-400">
          アカウントをお持ちでない場合は{' '}
          <Link href="/login" className="text-yellow-400 hover:underline font-medium">
            ログイン
          </Link>
        </div>
      </form>
    </div>
  );
}
