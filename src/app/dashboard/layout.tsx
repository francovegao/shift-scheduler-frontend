import NavBar from "../ui/dashboard/nav-bar";
import SideNav from "../ui/dashboard/sidenav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      {/* LEFT */}
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      {/* RIGHT */}
      <div className="flex flex-col flex-grow md:overflow-y-auto bg-[#F7F8FA]">
       <NavBar /> 
        {children}
      </div>
    </div>
  );
}