import { Outlet } from "react-router-dom";
import Navbar from "../UI/Navbar";

const MasterLayout = () => {
  return (
    <div className="flex bg-[var(--Primary)] min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MasterLayout;
