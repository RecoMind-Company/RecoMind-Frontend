import { Edit2 } from "lucide-react";

const ProfileAvatar = ({ imageUrl, onImageChange }) => {
  return (
    <div className="relative w-[166px] h-[166px] mb-6">
      <img
        src={imageUrl}
        alt="Profile"
        className="w-full h-full rounded-full object-cover"
      />
      <button
        onClick={onImageChange}
        className="absolute bottom-0 right-0 w-[58px] h-[58px] bg-[#494949] rounded-full flex items-center justify-center hover:bg-[#6a6a6a] transition-all"
      >
        <Edit2 size={26} className="text-white" />
      </button>
    </div>
  );
};

export default ProfileAvatar;
