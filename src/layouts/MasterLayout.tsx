import { Outlet } from "react-router-dom";
import Navbar from "../UI/Navbar";

const MasterLayout = () => {
  return (
    <div className="flex bg-[var(--Primary)] min-h-[100dvh] p-4">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className=" flex-1 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MasterLayout;
