import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';

export default function SideNav() {
  return (
    <div>
      <Link
        href="/"
      >
      </Link>
      <div>
        <NavLinks />
        <div></div>
        <form>
          <button>
            <div>Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}