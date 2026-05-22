import { Outlet } from "react-router-dom";
import Navbar from "../UI/Navbar";

const MasterLayout = () => {
  return (
    <div className="flex bg-(--Primary) min-h-dvh">
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
