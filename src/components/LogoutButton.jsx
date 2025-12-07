import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/features/SignIn/SigninSlice";
import toast from "react-hot-toast";

const LogoutButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());

    toast.success("Logged out successfully", {
      position: "bottom-center",
      duration: 1500,
      style: {
        backgroundColor: "black",
        color: "white",
        width: "fit-content",
      },
    });

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <button
      onClick={handleLogout}
      className="
        flex items-center justify-center gap-2
        md:w-[298px] md:h-[63px]
        w-full h-[50px]
        rounded-lg bg-[#454A554D] p-4 
        text-[var(--error)] font-medium text-[18px] 
        transition-all duration-300 hover:opacity-80
      "
    >
      <LogOut size={22} className="sm:w-5 sm:h-5" />
      <span className="text-lg">Logout</span>
    </button>
  );
};

export default LogoutButton;
