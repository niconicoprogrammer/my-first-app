import TitleBar from '@/app/ui/title-bar';

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
        <TitleBar />
        <div>{children}</div>
    </div>
  );
}