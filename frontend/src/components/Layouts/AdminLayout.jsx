import { Outlet } from "react-router-dom";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-muted/10">
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-6 pr-24 md:pr-6 lg:pr-6 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
