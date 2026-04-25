import { useState, useEffect, ChangeEvent } from "react";
import { Toaster } from "react-hot-toast";
import ProfileAvatar from "../components/ProfileAvatar";
import InputField from "../components/InputField";
import LogoutButton from "../components/LogoutButton";
import ProfileCompletionBanner from "../UI/ProfileCompletionBanner";
import userB from "../assets/images/userB.png";
import ChangePasswordButton from "../components/ChangePasswordButton";
import DeleteAccountButton from "../components/DeleteAccountButton";

interface UserData {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  profileImage: string;
  isProfileComplete: boolean;
}

import { useProfile } from "../hooks/useProfile";

const PersonalInfoPage = () => {
  const { data: profile, isLoading } = useProfile();

  const [userData, setUserData] = useState<UserData>({
    name: "ALi Alaa",
    email: "ali@gmail.com",
    phone: "",
    jobTitle: "",
    profileImage: userB,
    isProfileComplete: false,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [resetEdit, setResetEdit] = useState(false);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);

  useEffect(() => {
    if (profile) {
      setUserData((prev) => ({
        ...prev,
        name: profile.fullName || prev.name,
        email: profile.email || prev.email,
        phone: profile.phoneNumber || prev.phone,
        jobTitle: profile.jobTitle || prev.jobTitle,
        profileImage: profile.imagePath || prev.profileImage,
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (!userData.isProfileComplete && !userData.phone && !userData.jobTitle) {
      setShowCompletionBanner(true);
    }
  }, [userData]);

  const handleInputChange = (field: keyof UserData, value: string | boolean, resetSave = false) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
    if (resetSave) {
      setHasChanges(false);
    } else {
      setHasChanges(true);
    }
  };

  const handleSaveChanges = async () => {
    console.log("Saving changes:", userData);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setHasChanges(false);
    setResetEdit(true);
    setTimeout(() => setResetEdit(false), 10);
    alert("Changes saved successfully!");
  };

  const handleProfileCompletion = (jobTitle: string, phoneNumber: string) => {
    setUserData((prev) => ({
      ...prev,
      jobTitle,
      phone: phoneNumber,
      isProfileComplete: true,
    }));
    setShowCompletionBanner(false);
  };

  const handleImageChange = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUserData((prev) => ({
              ...prev,
              profileImage: event.target?.result as string,
            }));
            setHasChanges(true);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <>
      <Toaster position="top-center" />

      <div className="min-h-screen p-4 mt-24 sm:px-6 md:px-8 lg:w-[907px] ml-0 lg:ml-[65px] md:pt-8 relative">
        {showCompletionBanner && (
          <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
            <ProfileCompletionBanner
              userName={userData.name || "User"}
              completionPercentage={50}
              onClose={() => setShowCompletionBanner(false)}
              onComplete={handleProfileCompletion}
            />
          </div>
        )}

        <div className="flex flex-col items-center md:items-start mb-6">
          <ProfileAvatar
            imageUrl={userData.profileImage}
            onImageChange={handleImageChange}
          />
        </div>

        <div className="border border-[var(--Secondary)] p-4 sm:p-6 md:p-8 rounded-3xl">
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <InputField
                label="Name"
                value={userData.name}
                onChange={(newValue) => handleInputChange("name", newValue)}
              />

              <InputField
                label="Email"
                value={userData.email}
                onChange={(newValue) => handleInputChange("email", newValue)}
                type="email"
              />
            </div>

            {userData.isProfileComplete && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InputField
                  label="Job Title"
                  value={userData.jobTitle}
                  onChange={(newValue, resetSave) =>
                    handleInputChange("jobTitle", newValue, resetSave)
                  }
                  resetEdit={resetEdit}
                />
                <InputField
                  label="Phone"
                  value={userData.phone}
                  onChange={(newValue, resetSave) =>
                    handleInputChange("phone", newValue, resetSave)
                  }
                  type="tel"
                  resetEdit={resetEdit}
                />
              </div>
            )}
          </div>

          <button
            onClick={handleSaveChanges}
            disabled={!hasChanges}
            className={`w-full py-3 mt-8 rounded-lg text-[16px] font-semibold transition-all duration-300
              ${
                hasChanges
                  ? "bg-[var(--Secondary)] text-[var(--Primary)] hover:opacity-90"
                  : "bg-[#7F7F7F] text-[var(--Primary)] cursor-not-allowed"
              }`}
          >
            Save Changes
          </button>
        </div>

        <div className="flex justify-center gap-4 md:justify-start mt-6">
          <LogoutButton onClick={() => console.log("Logging out...")} />
          <ChangePasswordButton />
          <DeleteAccountButton />
        </div>
      </div>
    </>
  );
};

export default PersonalInfoPage;
