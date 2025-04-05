import Image from "next/image";
import NavLink from '@/app/ui/nav-link';

export default function Home() {
  return (
    <div>
      <div>
        スタートページ
      </div>
      <div className="p-4 bg-gray-100 rounded shadow">
        <h1 className="text-xl font-bold text-blue-600">Tailwind 使えてるよ！</h1>
      </div>
      <NavLink />
    </div>
  );
}
