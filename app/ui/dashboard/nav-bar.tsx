'use client';

import { useEffect, useState, useActionState } from 'react';
import NavLinks from '@/app/ui/dashboard/nav-links'; 
import { logout } from '@/app/lib/actions'; 
import { useRouter,  useSearchParams } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/client';

export default function NavBar() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  
  const [, formAction, isPending] = useActionState(
    logout,
    undefined
  );

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

  // 新規登録完了処理
  const searchParams = useSearchParams()
  const [Message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const signup = searchParams.get('signup')
    const login = searchParams.get('login')
  
    if (signup === 'success') {
      setMessage('登録が完了しました！')
    } else if (login === 'success') {
      setMessage('ログインしました！')
    }

    // ✅ 表示したらクエリパラメータを削除する
    if (signup || login) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('signup');
      newParams.delete('login');
      const newUrl = `${window.location.pathname}?${newParams.toString()}`;
      router.replace(newUrl, { scroll: false }); // 履歴は残さない
    }
  }, [searchParams])

  // 🔁 一定時間で非表示にする処理を追加
  useEffect(() => {
    if (Message) {
      const timeout = setTimeout(() => {
        setMessage(null)
      }, 8000) // 8秒後に非表示
  
      // クリーンアップ（ページ切り替え時などにタイマー消す）
      return () => clearTimeout(timeout)
    }
  }, [Message])

  return (
    <>
      {Message && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg flex items-center gap-4 z-50">
          <span>{Message}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-white text-xl font-bold hover:text-gray-300"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>
      )}
      <header className="w-full bg-[#0f172a] text-white shadow-md border-b border-gray-700">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* 左：ロゴ */}
          <div className="flex items-center gap-2">
            {/* ロゴ画像を入れる場合はここ */}
            <span className="text-xl font-bold text-yellow-400">仮想通貨デモ</span>
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
            <form action={formAction}>
              <button
                className="bg-yellow-400 text-[#0f172a] text-sm px-4 py-2 rounded-md font-semibold hover:bg-yellow-300 transition"
              >
              {isPending ? 'ログアウト中...' : 'ログアウト'}
              </button>
            </form>
          </div>
        </div>
      </header>
    </>
  );
}