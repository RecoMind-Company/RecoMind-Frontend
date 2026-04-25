import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

interface LogoutButtonProps {
  onClick?: () => void;
}

const LogoutButton = ({ onClick }: LogoutButtonProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (onClick) onClick();

    toast.success("Logged out successfully!", {
      position: "bottom-center",
      duration: 1500,
      style: {
        backgroundColor: "black",
        color: "white",
        width: "fit-content",
      },
    });

    // Redirect to sign in
    navigate("/signin");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-6 py-3 bg-[#1C2435] text-red-500 rounded-xl hover:bg-[#252d3d] transition-all border border-red-500/20"
    >
      <LogOut size={20} />
      <span className="text-[16px] font-semibold">Logout</span>
    </button>
  );
};

export default LogoutButton;
