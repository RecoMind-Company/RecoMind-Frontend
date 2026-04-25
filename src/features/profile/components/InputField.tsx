import { useState, useRef, useEffect } from "react";
import edit from "../assets/images/PencilSimpleLine.png";

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  fullWidth = true,
  resetEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [originalValue, setOriginalValue] = useState(value);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isEditing) setTempValue(value);
  }, [value, isEditing]);

  useEffect(() => {
    if (resetEdit) setIsEditing(false);
  }, [resetEdit]);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const handleEditClick = () => {
    setOriginalValue(value);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    const changed = tempValue !== originalValue;
    setTempValue(originalValue);
    onChange(originalValue);
    setIsEditing(false);
    if (!changed) {
      onChange(originalValue, true);
    }
  };

  const handleChange = (e) => {
    setTempValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className={`flex flex-col ${fullWidth ? "w-full" : ""}`}>
      <label className="text-white text-[20px] font-normal mb-2 block">
        {label}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          value={tempValue}
          onChange={handleChange}
          disabled={!isEditing}
          className={`w-full h-[52px] text-[16px] font-medium px-4 pr-[110px] rounded-lg border transition-all
            ${
              isEditing
                ? "bg-[#454A55] border-[var(--Secondary)] text-white outline-none"
                : "bg-[#454A5599] border-transparent text-[#B9B8B8]"
            }`}
        />

        <button
          onClick={isEditing ? handleCancelClick : handleEditClick}
          className={`absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md flex items-center justify-center gap-2 transition-all
            ${
              isEditing
                ? "bg-[#1C2435] text-red-500 hover:opacity-90"
                : "bg-[#1C2435] text-white hover:opacity-90"
            }`}
        >
          {isEditing ? (
            <span className="text-[16px] font-medium">X Cancel</span>
          ) : (
            <>
              <img src={edit} alt="Edit" className="w-4 h-4" />
              <span className="text-[16px] font-medium">Edit</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputField;
