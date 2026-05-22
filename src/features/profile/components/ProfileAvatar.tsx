import { Edit2 } from "lucide-react";
import { useRef } from "react";
import { useAvatar } from "../../../context/AvatarContext";

interface ProfileAvatarProps {
  imageUrl?: string;
  onImageChange?: () => void;
}

const ProfileAvatar = ({ imageUrl, onImageChange }: ProfileAvatarProps) => {
  const { avatarUrl, setAvatarUrl } = useAvatar();
  const defaultImage = "https://placehold.co/150?text=No+Image";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative w-41.5 h-41.5 mb-6">
      <img
        src={imageUrl || avatarUrl || defaultImage}
        alt="Profile"
        className="w-full h-full rounded-full object-cover"
        onError={(e) => (e.currentTarget.src = defaultImage)}
      />
      {!onImageChange && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      )}
      <button
        onClick={() =>
          onImageChange ? onImageChange() : fileInputRef.current?.click()
        }
        className="absolute bottom-0 right-0 w-14.5 h-14.5 bg-[#494949] rounded-full flex items-center justify-center hover:bg-[#6a6a6a] transition-all"
      >
        <Edit2 size={26} className="text-white" />
      </button>
    </div>
  );
};

export default ProfileAvatar;
