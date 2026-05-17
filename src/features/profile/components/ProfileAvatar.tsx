import { Edit2 } from "lucide-react";
import { useRef, useState } from "react";

interface ProfileAvatarProps {
  imageUrl?: string;
  onImageChange?: (newImage: string) => void;
}

const STORAGE_KEY = "profile_avatar";

const ProfileAvatar = ({ imageUrl, onImageChange }: ProfileAvatarProps) => {
  const defaultImage = "https://placehold.co/150?text=No+Image";

  const getSavedImage = () =>
    localStorage.getItem(STORAGE_KEY) || imageUrl || defaultImage;

  const [imageSrc, setImageSrc] = useState<string>(getSavedImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImageSrc(base64);
      localStorage.setItem(STORAGE_KEY, base64);
      onImageChange?.(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative w-[166px] h-[166px] mb-6">
      <img
        src={imageSrc}
        alt="Profile"
        className="w-full h-full rounded-full object-cover"
        onError={() => setImageSrc(defaultImage)}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={handleButtonClick}
        className="absolute bottom-0 right-0 w-[58px] h-[58px] bg-[#494949] rounded-full flex items-center justify-center hover:bg-[#6a6a6a] transition-all"
      >
        <Edit2 size={26} className="text-white" />
      </button>
    </div>
  );
};

export default ProfileAvatar;