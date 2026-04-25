import { KeyRound, Eye, EyeOff, X, AlertCircle } from "lucide-react";
import { useState, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { ChangePasswordFunction, resetState } from "../redux/features/ChangePassword/ChangePasswordSlice";
import { toast } from "react-hot-toast";

const ChangePasswordButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useAppDispatch();
  const { isloading } = useAppSelector((state) => state.changePassword);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    const resultAction = await dispatch(
      ChangePasswordFunction({ oldPassword, newPassword })
    );

    if (ChangePasswordFunction.fulfilled.match(resultAction)) {
      setShowModal(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      dispatch(resetState());
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-3 px-6 py-3 bg-[#1C2435] text-white rounded-xl hover:bg-[#252d3d] transition-all border border-gray-700"
      >
        <KeyRound size={20} />
        <span className="text-[16px] font-semibold">Change Password</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C2435] w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white transition-all"
            >
              <X size={24} />
            </button>

            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Change Password
              </h3>
              <p className="text-gray-400 mb-8">
                Update your account password to keep it secure.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">
                    Old Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOld ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full bg-[#252d3d] border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[var(--Secondary)] transition-all"
                      placeholder="Enter old password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOld(!showOld)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#252d3d] border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[var(--Secondary)] transition-all"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#252d3d] border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[var(--Secondary)] transition-all"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <div className="flex items-center gap-2 text-red-500 text-sm ml-1">
                    <AlertCircle size={14} />
                    <span>Passwords do not match</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isloading}
                  className="w-full py-4 bg-[var(--Secondary)] text-[var(--Primary)] rounded-xl font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {isloading ? (
                    <div className="w-6 h-6 border-2 border-[var(--Primary)] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangePasswordButton;
