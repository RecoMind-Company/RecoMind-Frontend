import { useState } from "react";
import { Key, Eye, EyeOff, X, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChangePasswordFunction,
  resetState,
} from "../redux/features/ChangePassword/ChangePasswordSlice";

const ChangePasswordButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const dispatch = useDispatch();
  const { isloading, success } = useSelector((state) => state.changePassword);

  const isPasswordValid = (password) => {
    return password.length >= 8;
  };

  const doPasswordsMatch = () => {
    return newPassword === confirmNewPassword && newPassword.length > 0;
  };

  const isFormValid =
    oldPassword.length > 0 &&
    isPasswordValid(newPassword) &&
    doPasswordsMatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    const data = {
      oldPassword,
      newPassword,
      confirmNewPassword,
    };

    dispatch(ChangePasswordFunction(data));
  };

  const handleClose = () => {
    setIsOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setTouched({
      oldPassword: false,
      newPassword: false,
      confirmNewPassword: false,
    });
    dispatch(resetState());
  };

  if (success) {
    setTimeout(() => {
      handleClose();
    }, 1500);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="
          flex items-center justify-center gap-2
          md:w-[298px] md:h-[63px]
          w-full h-[50px]
          rounded-lg bg-[#454A554D] p-4 
          text-[var(--Secondary)] font-medium text-[18px] 
          transition-all duration-300 hover:opacity-80
        "
      >
        <Key size={22} className="sm:w-5 sm:h-5" />
        <span className="text-lg">Change Password</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-[500px] bg-[var(--Primary)] rounded-lg shadow-2xl p-6 md:p-8 border border-[var(--border_color)]/10">
            <button
              onClick={handleClose}
              disabled={isloading}
              className="absolute top-4 right-4 text-[var(--font_secondary)] hover:text-[var(--font_primary)] transition-colors disabled:opacity-50"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[var(--Secondary)] bg-opacity-20 flex items-center justify-center">
                <Key size={24} className="text-[var(--Secondary)]" />
              </div>
              <h2 className="text-2xl font-semibold text-[var(--font_primary)]">
                Change Password
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[var(--font_primary)] font-medium">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    onBlur={() => setTouched({ ...touched, oldPassword: true })}
                    disabled={isloading}
                    className={`w-full bg-transparent border rounded-md py-2 px-4 pr-10 focus:outline-none transition-all disabled:opacity-50 ${
                      touched.oldPassword && oldPassword.length === 0
                        ? "border-[var(--error)]"
                        : "border-[var(--border_color)] focus:border-[var(--Secondary)]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-3 text-[var(--border_color)]"
                  >
                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[var(--font_primary)] font-medium">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onBlur={() => setTouched({ ...touched, newPassword: true })}
                    disabled={isloading}
                    className={`w-full bg-transparent border rounded-md py-2 px-4 pr-10 focus:outline-none transition-all disabled:opacity-50 ${
                      touched.newPassword && !isPasswordValid(newPassword)
                        ? "border-[var(--error)]"
                        : "border-[var(--border_color)] focus:border-[var(--Secondary)]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-[var(--border_color)]"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {touched.newPassword &&
                  !isPasswordValid(newPassword) &&
                  newPassword.length > 0 && (
                    <p className="text-[var(--error)] text-sm flex items-center gap-1">
                      <AlertCircle size={14} /> Password must be at least 8
                      characters
                    </p>
                  )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[var(--font_primary)] font-medium">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    onBlur={() =>
                      setTouched({ ...touched, confirmNewPassword: true })
                    }
                    disabled={isloading}
                    className={`w-full bg-transparent border rounded-md py-2 px-4 pr-10 focus:outline-none transition-all disabled:opacity-50 ${
                      touched.confirmNewPassword && !doPasswordsMatch()
                        ? "border-[var(--error)]"
                        : "border-[var(--border_color)] focus:border-[var(--Secondary)]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-[var(--border_color)]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {touched.confirmNewPassword &&
                  !doPasswordsMatch() &&
                  confirmNewPassword.length > 0 && (
                    <p className="text-[var(--error)] text-sm flex items-center gap-1">
                      <AlertCircle size={14} /> Passwords do not match
                    </p>
                  )}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isloading}
                  className="flex-1 rounded-lg py-2. 5 font-medium text-[16px] transition-all border border-[var(--border_color)] text-[var(--font_primary)] hover:opacity-80 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isloading || !isFormValid}
                  className="flex-1 rounded-lg py-2.5 font-medium text-[16px] transition-all bg-[var(--Secondary)] text-[var(--Primary)] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isloading ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangePasswordButton;
