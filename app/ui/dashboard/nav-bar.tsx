'use client';

import { useEffect, useState } from 'react';
import NavLinks from '@/app/ui/dashboard/nav-links'; 
import { logout } from '@/app/lib/actions'; 
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/client';

export default function NavBar() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setEmail(data.user.email ?? null);
      }
    };
    fetchUser();
  }, [router]);

  return (
    <header className="w-full bg-[#0f172a] text-white shadow-md border-b border-gray-700">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* 左：ロゴ */}
        <div className="flex items-center gap-2">
          {/* ロゴ画像を入れる場合はここ */}
          <span className="text-xl font-bold text-yellow-400">CoinGecko</span>
        </div>

        {/* 中央：ナビゲーションリンク */}
        <nav className="hidden md:flex gap-6 text-sm text-gray-200 font-medium">
          <NavLinks />
        </nav>

        {/* 右：ログアウト & ユーザー */}
        <div className="flex items-center gap-4">
          {email && (
            <span className="text-sm text-gray-300 hidden sm:inline">
              {email}
            </span>
          )}
          <form action={logout}>
            <button
              className="bg-yellow-400 text-[#0f172a] text-sm px-4 py-2 rounded-md font-semibold hover:bg-yellow-300 transition"
            >
              ログアウト
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}