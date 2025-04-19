'use client';

import HistoryList from "@/app/ui/dashboard/history/history-list";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white px-6 py-10">
      { HistoryList() }
    </main>
  );
}
