import NavBar from '@/app/ui/dashboard/nav-bar';
import BreadCrumb from '@/app/ui/dashboard/bread-crumb';

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* ナビゲーションバー */}
      <NavBar />

      {/* コンテンツ全体を中央に揃える */}
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* パンくずリスト */}
        <BreadCrumb />

        {/* ページごとの内容 */}
        <div>{children}</div>
      </div>
    </div>
  );
}
