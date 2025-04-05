'use client';

import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';    

export default function NavBar() {
  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 左：ロゴと名前 */}
        <div className="flex-1 flex items-center gap-2">
          {/* <img src="/coingecko-logo.png" alt="Logo" className="w-6 h-6" /> */}
          <span className="text-lg font-semibold text-gray-800">CoinGecko</span>
        </div>

        {/* 中央：ナビゲーションリンク */}
        <nav className="flex-1 hidden md:flex gap-6 text-sm text-gray-700">
            <NavLinks />
        </nav>

        <div className="flex-1">

        </div>

        {/* 右：検索とログインボタン */}
        {/* <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="検索"
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button className="text-sm text-gray-700 hover:underline">ログイン</button>
          <button className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
            アカウント登録
          </button>
        </div> */}
      </div>
    </header>
  );
}
