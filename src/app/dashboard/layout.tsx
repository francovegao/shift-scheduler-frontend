import { AuthWrapper } from "../ui/authentication/auth-wrapper";
import { ContextProvider } from "../ui/context/auth-context";
import NavBar from "../ui/dashboard/nav-bar";
import SideNav from "../ui/dashboard/sidenav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContextProvider>
    <AuthWrapper allowedRoles={["admin", "pharmacy_manager", "location_manager", "relief_pharmacist"]}>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        {/* LEFT */}
        <div className="w-full flex-none md:w-64 bg-stone-200">
          <SideNav />
        </div>
        {/* RIGHT */}
        <div className="flex flex-col flex-grow md:overflow-y-auto bg-stone-100">
        <NavBar /> 
          {children}
        </div>
      </div>
    </AuthWrapper>
    </ContextProvider>
  );
}