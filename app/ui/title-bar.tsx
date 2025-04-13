'use client';

export default function TitleBar() {

  return (
    <>
      <header className="w-full bg-[#0f172a] text-white shadow-md border-b border-gray-700">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* 左：ロゴ */}
          <div className="flex items-center gap-2">
            {/* ロゴ画像を入れる場合はここ */}
            <span className="text-xl font-bold text-yellow-400">仮想通貨デモ</span>
          </div>

          {/* 中央：ナビゲーションリンク */}
          <nav className="hidden md:flex gap-6 text-sm text-gray-200 font-medium">
          </nav>

          {/* 右：ログアウト & ユーザー */}
          <div className="flex items-center gap-4">
          </div>
        </div>
      </header>
    </>
  );
}