import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { DeleteAccountFunction } from "../redux/features/DeleteAccount/DeleteAccountSlice";
import { useNavigate } from "react-router-dom";

const DeleteAccountButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") ?? "{}");
  const userId = storedUser.id || "";

  const handleDelete = async () => {
    if (userId) {
      await dispatch(DeleteAccountFunction(userId));
      navigate("/signup");
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-3 px-6 py-3 bg-[#1C2435] text-red-500 rounded-xl hover:bg-[#252d3d] transition-all border border-red-500/20"
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
                className="flex-1 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAccountButton;