import SideNav from '@/app/ui/dashboard/sidenav';
import NavLink from '@/app/ui/dashboard/nav-link';
import NavBar from '@/app/ui/dashboard/nav-bar';
import BreadCrumb from '@/app/ui/dashboard/bread-crumb';
 
export const experimental_ppr = true;
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavBar />
      <BreadCrumb />
      <div>{children}</div>
      <NavLink />
    </div>
  );
}