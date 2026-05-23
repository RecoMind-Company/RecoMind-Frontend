import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { DeleteAccountFunction } from "../redux/features/DeleteAccount/DeleteAccountSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const DeleteAccountButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.deleteAccount.isloading);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") ?? "{}");
  const token = localStorage.getItem("token");

  const getUserIdFromToken = () => {
    if (!token) return "";
    try {
      const payload = token.split(".")[1];
      if (!payload) return "";
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join(""),
      );
      const data = JSON.parse(json) as Record<string, string>;
      return (
        data[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] ||
        data.sub ||
        ""
      );
    } catch {
      return "";
    }
  };

  const userId =
    storedUser.id ||
    storedUser._id ||
    storedUser.userId ||
    getUserIdFromToken();

  const handleDelete = async () => {
    if (!token) {
      toast.error("You must be logged in to delete your account.");
      return;
    }
    if (userId) {
      try {
        await dispatch(DeleteAccountFunction(userId)).unwrap();
        setShowConfirm(false);
        navigate("/signup");
      } catch {
        // Errors are already handled by the thunk toast.
      }
    } else {
      toast.error("Missing user id. Please log in again.");
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isLoading}
        className="flex items-center justify-center gap-3 px-6 py-3 bg-[#1C2435] text-red-500 rounded-xl hover:bg-[#252d3d] transition-all border border-red-500/20"
      >
        <Trash2 size={20} />
        <span className="text-[16px] font-semibold">Delete Account</span>
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C2435] p-8 rounded-2xl max-w-md w-full border border-red-500/20">
            <h3 className="text-white text-xl font-bold mb-4">
              Delete Account?
            </h3>
            <p className="text-gray-400 mb-6">
              This action is permanent and cannot be undone. All your data will
              be lost.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isLoading}
                className="flex-1 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-all"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAccountButton;
