import { useState } from "react";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  DeleteAccountFunction,
  resetState,
} from "../redux/features/DeleteAccount/DeleteAccountSlice";
import { useEffect } from "react";
import { GetprofileFunction } from "../redux/features/GetProfile/getProfileSlice";

const DeleteAccountButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isloading, success } = useSelector((state) => state.deleteAccount);
  const { data } = useSelector((state) => state.getprofile);


  const isConfirmValid = confirmText.toLowerCase() === "delete";


  useEffect(() => {
  dispatch(GetprofileFunction());
  console.log(data)
}, []);
  const handleDelete = () => {
    if (!isConfirmValid) return;
    dispatch(DeleteAccountFunction(data.id));
  };

  const handleClose = () => {
    setIsOpen(false);
    setConfirmText("");
    dispatch(resetState());
  };

  if (success) {
    setTimeout(() => {
      handleClose();
      navigate("/");
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
          text-[var(--error)] font-medium text-[18px] 
          transition-all duration-300 hover:opacity-80
        "
      >
        <Trash2 size={22} className="sm:w-5 sm:h-5" />
        <span className="text-lg">Delete Account</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-[450px] bg-[var(--Primary)] rounded-lg shadow-2xl p-6 md:p-8 border border-[var(--error)]/20">
            <button
              onClick={handleClose}
              disabled={isloading}
              className="absolute top-4 right-4 text-[var(--font_secondary)] hover:text-[var(--font_primary)] transition-colors disabled:opacity-50"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[var(--error)] bg-opacity-20 flex items-center justify-center">
                <AlertTriangle size={32} className="text-[var(--error)]" />
              </div>
              <h2 className="text-2xl font-semibold text-[var(--error)] text-center">
                Delete Account
              </h2>
              <p className="text-[var(--font_secondary)] text-center text-sm">
                This action cannot be undone. All your data will be permanently
                deleted.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-lg p-4">
                <p className="text-[var(--font_primary)] text-sm mb-2">
                  To confirm, type{" "}
                  <span className="font-bold text-[var(--error)]">DELETE</span>{" "}
                  below:
                </p>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  disabled={isloading}
                  className="w-full bg-transparent border border-[var(--border_color)] rounded-md py-2 px-4 focus:outline-none focus:border-[var(--error)] transition-all disabled:opacity-50 text-[var(--font_primary)]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isloading}
                  className="flex-1 rounded-lg py-2. 5 font-medium text-[16px] transition-all border border-[var(--border_color)] text-[var(--font_primary)] hover:opacity-80 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isloading || !isConfirmValid}
                  className="flex-1 rounded-lg py-2.5 font-medium text-[16px] transition-all bg-[var(--error)] text-white hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isloading ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    "Delete Forever"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAccountButton;