import { useEffect, useState } from "react";
import { LogOut, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SettingsCard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]); 

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="rounded-[20px] shadow-lg p-5 w-[292px] flex flex-col gap-4">
      {/* Theme Toggle Row */}
      <div className="flex items-center justify-between">
        {/* Toggle Text */}
        <div className="flex items-center gap-2">
          {theme === "light" ? (
            <Sun size={20} className="text-[var(--Secondary)]" />
          ) : (
            <Moon size={20} className="text-[var(--Secondary)]" />
          )}
          <span className="font-medium text-xl">
            {theme === "light" ? "Light Mode" : "Dark Mode"}
          </span>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
            theme === "light"
              ? "bg-[var(--font_tertiary)]"
              : "bg-[var(--font_tertiary)]"
          }`}
        >
          <span
            className={`absolute top-[2px] left-[2px] w-[24px] h-[24px] rounded-full ${
              theme === "light" ? "bg-white" : "bg-[var(--font_quaternary)]"
            } transition-all duration-300 ${
              theme === "light" ? "translate-x-5" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Divider */}
      <div className="w-[90%] h-[1px] bg-[var(--Secondary)] opacity-20 mx-auto"></div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 text-[var(--error)] text-2xl font-medium hover:opacity-80 transition-all"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
}
