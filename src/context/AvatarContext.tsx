import { createContext, useContext, useState } from "react";

const STORAGE_KEY = "profile_avatar";

interface AvatarContextType {
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
}

const AvatarContext = createContext<AvatarContextType | null>(null);

export const AvatarProvider = ({ children }: { children: React.ReactNode }) => {
  const [avatarUrl, setAvatarUrlState] = useState<string>(
    localStorage.getItem(STORAGE_KEY) || "",
  );

  const setAvatarUrl = (url: string) => {
    localStorage.setItem(STORAGE_KEY, url);
    setAvatarUrlState(url);
  };

  return (
    <AvatarContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error("useAvatar must be used inside AvatarProvider");
  return ctx;
};
