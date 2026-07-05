import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="bg-(--BG_gradient)">
      <Outlet />
    </div>
  );
};

export default Layout;
