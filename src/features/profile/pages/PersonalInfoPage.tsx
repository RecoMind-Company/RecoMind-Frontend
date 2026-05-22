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
  const [showSettings, setShowSettings] = useState(false);
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
  const popupSettings = () => {
    setShowSettings(true);
  }
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

        <div>
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
              ${hasChanges
                ? "bg-[var(--Secondary)] text-[var(--Primary)] hover:opacity-90"
                : "bg-[#7F7F7F] text-[var(--Primary)] cursor-not-allowed"
              }`}
          >
            Save Changes
          </button>
        </div>
        <div className="btn_settings_container mt-6 pt-[20px] border-t border-[#222E53]">
          <button onClick={popupSettings} className="flex items-center gap-2.5"><svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 17.5C15.933 17.5 17.5 15.933 17.5 14C17.5 12.067 15.933 10.5 14 10.5C12.067 10.5 10.5 12.067 10.5 14C10.5 15.933 12.067 17.5 14 17.5Z" stroke="#EEEEEE" stroke-width="2" />
            <path d="M16.0592 2.51087C15.6304 2.33325 15.0868 2.33325 13.9996 2.33325C12.9124 2.33325 12.3688 2.33325 11.94 2.51087C11.3683 2.74769 10.914 3.20193 10.6772 3.77365C10.5691 4.03465 10.5268 4.33817 10.5102 4.78091C10.4859 5.43155 10.1522 6.03379 9.58835 6.35934C9.0245 6.68487 8.33611 6.67272 7.76048 6.36847C7.36878 6.16144 7.08477 6.04631 6.80469 6.00944C6.19114 5.92866 5.57063 6.09492 5.07968 6.47165C4.71145 6.7542 4.43965 7.22497 3.89606 8.1665C3.35246 9.10805 3.08066 9.57881 3.02008 10.039C2.93931 10.6525 3.10557 11.273 3.4823 11.764C3.65424 11.9881 3.89591 12.1764 4.27098 12.4121C4.82236 12.7586 5.17713 13.3488 5.17709 13.9999C5.17706 14.651 4.8223 15.2411 4.27097 15.5875C3.89585 15.8233 3.65415 16.0117 3.48218 16.2358C3.10546 16.7268 2.93919 17.3472 3.01997 17.9608C3.08055 18.4209 3.35235 18.8918 3.89594 19.8333C4.43955 20.7748 4.71135 21.2456 5.07956 21.5281C5.57052 21.9048 6.19102 22.071 6.80457 21.9903C7.08463 21.9534 7.36863 21.8383 7.7603 21.6313C8.33597 21.3271 9.02441 21.3149 9.58831 21.6404C10.1522 21.966 10.4859 22.5683 10.5102 23.219C10.5268 23.6617 10.5691 23.9652 10.6772 24.2262C10.914 24.7979 11.3683 25.2522 11.94 25.489C12.3688 25.6666 12.9124 25.6666 13.9996 25.6666C15.0868 25.6666 15.6304 25.6666 16.0592 25.489C16.6309 25.2522 17.0852 24.7979 17.3219 24.2262C17.4301 23.9652 17.4724 23.6617 17.489 23.2189C17.5132 22.5683 17.8469 21.966 18.4108 21.6404C18.9746 21.3148 19.6631 21.3271 20.2388 21.6313C20.6305 21.8383 20.9144 21.9533 21.1944 21.9902C21.808 22.071 22.4285 21.9048 22.9195 21.5281C23.2877 21.2455 23.5595 20.7748 24.103 19.8331C24.6467 18.8916 24.9185 18.4209 24.9791 17.9608C25.0598 17.3472 24.8936 16.7267 24.5169 16.2357C24.3449 16.0116 24.1032 15.8232 23.7281 15.5875C23.1768 15.2411 22.822 14.6509 22.822 13.9998C22.822 13.3487 23.1768 12.7587 23.7281 12.4123C24.1033 12.1765 24.345 11.9882 24.517 11.764C24.8937 11.2731 25.0599 10.6526 24.9792 10.0391C24.9187 9.57889 24.6468 9.10812 24.1032 8.16659C23.5596 7.22505 23.2878 6.75428 22.9196 6.47173C22.4286 6.09501 21.8081 5.92874 21.1945 6.00952C20.9145 6.04639 20.6306 6.16151 20.2388 6.36852C19.6632 6.67277 18.9747 6.68494 18.4109 6.35937C17.8469 6.03381 17.5132 5.43152 17.489 4.78085C17.4724 4.33815 17.4301 4.03464 17.3219 3.77365C17.0852 3.20193 16.6309 2.74769 16.0592 2.51087Z" stroke="#EEEEEE" stroke-width="2" />
          </svg>
            <span>Account Settings</span></button>
        </div>
        {
          showSettings && (
            <div className="p-5 bg-[#060B1B] text-right fixed z-[999] top-0 right-0 w-[90%] max-w-md h-[100dvh] shadow-[-8px_0_30px_0px_rgba(255,255,255,0.06)]">
              <button onClick={() => setShowSettings(false)} className="text-lg font-semibold mb-2  p-[8px] rounded-[8px]"><svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.9999 24.9999L12.9999 12.9999M12.9999 12.9999L1 1M12.9999 12.9999L25 1M12.9999 12.9999L1 25" stroke="#EEEEEE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              </button>
              <div className="flex flex-col  justify-between h-[93%] gap-4">
                 <div className="flex flex-col gap-4">
                <LogoutButton onClick={() => console.log("Logging out...")} />
                <ChangePasswordButton />
                 </div>
                <DeleteAccountButton />
              </div>
            </div>
          )
        }

      </div>
    </>
  );
};

export default PersonalInfoPage;
