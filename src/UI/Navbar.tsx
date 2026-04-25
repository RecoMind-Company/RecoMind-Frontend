import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, LayoutDashboard, Bot, Menu, X } from "lucide-react";
import user from "../assets/images/user.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "home", icon: Home, label: "Home", path: "/home" },
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/home/dashboard",
    },
    { id: "chatbot", icon: Bot, label: "Chatbot", path: "/home/chatbot" },
    {
      id: "profile",
      icon: null,
      label: "Profile",
      path: "/home/profile",
      image: user,
    },
  ];

  return (
    <>
      {/* Burger button (mobile only) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden fixed top-4 right-4 z-[60] p-2 rounded-md transition-all duration-300
          ${
            isOpen
              ? "bg-[var(--Secondary)] text-[var(--Primary)]"
              : "bg-[var(--Primary)] text-white border border-[var(--Secondary)]"
          }`}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar container */}
      <div className="flex">
        <aside
          className={`bg-[var(--Primary)] border-r border-[#EFEFEF]/10 flex flex-col items-center pt-16 px-4 gap-8 z-[9999] 
                      w-[134px] md:w-[134px] min-h-full md:min-h-screen
                      fixed md:sticky top-0 left-0
                      transition-transform duration-300 ease-in-out
                      ${
                        isOpen ? "translate-x-0" : "-translate-x-full"
                      } md:translate-x-0 z-50`}
          style={{
            boxShadow: "4px 0px 4px 0px rgba(186, 186, 186, 0.05)",
          }}
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <svg
              width="50"
              height="38"
              viewBox="0 0 79 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M41.6999 52.7002L45.7001 37.2002L36.7001 38.8002L28.2001 40.2002L30.2001 41.2002L33.2001 42.7002C33.2001 42.7002 27.8726 46.1619 24.6999 48.7002C22.2001 50.7002 20.2001 52.4002 18.7001 53.7002C15.7712 56.6291 13.8057 58.4802 11.2001 61.7002C7.89289 65.7873 6.61557 68.3039 4.70013 73.2002C3.16448 77.1256 2.55095 79.4997 2.19994 83.7002C2.00481 86.0352 2.2002 89.7002 2.2002 89.7002L9.70013 89.6002L17.4201 89.5002V88.7002L17.4901 87.2002L17.7001 84.7002C17.7001 84.7002 17.9072 81.9439 18.2001 80.2002C18.6683 77.4137 19.0684 76.2376 20.0301 73.2002C21.5592 68.371 25.5335 62.7002 26.2001 61.7002C27.2001 60.2002 30.2049 56.4949 33.2001 53.2002C35.0577 51.1569 38.7001 47.7002 38.7001 47.7002L41.6999 52.7002Z"
                fill="#ECF5FA"
              />
              <path
                d="M19.2002 9.2005V14.7005H30.2002L36.7002 14.7007C36.7002 14.7007 40.7002 14.7002 43.2002 14.7002C45.7002 14.7002 47.8196 14.9132 49.7002 15.7002C50.9085 16.2059 53.2002 17.7002 53.2002 17.7002C53.2002 17.7002 55.2719 19.3442 56.2002 21.2007C57.2002 23.2007 58 25 58 28C58 30.9549 57.4279 33.5042 56.0002 35.7007C54.7002 37.7007 53.6782 38.4511 51.2002 39.7007C49.5462 40.5348 46.7002 41.2007 46.7002 41.2007L44.2002 50.2005L42.2002 57.7005L40.2002 54.2005L38.2002 51.7005H37.7002L36.7002 52.7005L33.7002 55.7005H35.2002L35.7002 56.7005L45.7002 70.2005L57.7002 86.2005L60.2002 89.7005H62.7002H72.2002H78.7002L70.7002 78.7007L62.2002 67.2007L55.7002 58.7007L52.2002 54.2007C52.2002 54.2007 54.2002 54.2007 55.7002 53.7007C57.8605 52.9806 59.7771 52.4201 61.7002 51.2007C63.4839 50.0697 64.7067 49.1942 66.2002 47.7007C66.897 47.0038 68.3653 44.8565 69.4002 43.2007C70.2002 41.9207 70.9942 40.2663 71.7002 38.2005C72.2824 36.497 72.506 35.4767 72.8002 33.7007C73.0892 31.9563 73.1648 30.9683 73.2002 29.2005C73.2433 27.0442 73.0447 24.8297 72.7002 22.7007C72.4126 20.9236 72.3795 20.4359 71.9002 18.7007C71.407 16.9151 71.4066 16.7044 70.5002 14.7007C69.5938 12.697 68.4292 11.0692 66.7002 9.2005C64.6035 6.93433 63.4181 6.16522 60.7002 4.70068C57.9231 3.20427 55.7513 2.50168 52.7002 1.7005C48.7162 0.654355 42.2002 0.700499 42.2002 0.700499H33.2002H22.7002H17.7002C17.7002 0.700499 18.2002 1.70087 18.2002 2.20068C18.2002 2.7005 17.7002 3.7005 17.7002 3.7005C17.7002 3.7005 18.0055 3.68552 18.2002 3.7005C18.8159 3.74787 19.7002 4.20068 19.7002 4.20068C19.7002 4.20068 19.9037 4.23456 20.2002 4.7005C20.6324 5.37972 20.7619 5.89778 20.7002 6.7005C20.6528 7.31615 20.5317 7.67956 20.2002 8.2005C19.9037 8.66644 19.2002 8.64821 19.2002 9.2005Z"
                fill="url(#paint0_linear_2764_16236)"
              />
              <circle
                cx="17.9502"
                cy="49.9502"
                r="1.25"
                fill="#060B1B"
                stroke="#ECF5FA"
              />
              <path
                d="M2.19925 24.7002L2.19972 34.7002C2.19972 34.7002 2.19972 35.6144 2.19972 36.2002C2.19972 36.5907 2.11962 37.818 2.20007 38.2002C2.3451 38.8891 3.20007 39.7002 3.20007 39.7002C3.20007 39.7002 3.61457 40.1144 4.20044 40.7002C4.98144 41.4811 6.69996 42.6479 6.70007 43.2002C6.70044 45.2002 6.70007 49.7002 6.70007 49.7002C6.70007 48.7002 6.70007 48.2002 6.70007 54.2002C6.70007 60.2002 6.70007 62.7002 6.70007 63.2002C6.70007 63.7002 6.20007 63.7002 6.20007 63.7002"
                stroke="#ECF5FA"
              />
              <path
                d="M2.2002 3.2002V16.2002C2.2002 16.2002 3.4002 17.2002 4.4002 18.2002C4.85002 18.65 6.7002 20.2002 6.7002 20.7002C6.7002 21.2002 4.2002 22.6093 4.2002 23.2002C4.2002 25.7002 4.2002 32.7002 4.2002 32.7002"
                stroke="url(#paint1_linear_2764_16236)"
              />
              <path
                d="M7.7002 3.7002V12.7002"
                stroke="url(#paint2_linear_2764_16236)"
              />
              <path
                d="M6.2002 14.2002C6.2002 14.2002 9.2002 16.9934 9.2002 17.7002C9.2002 18.407 6.7002 20.7002 6.7002 20.7002"
                stroke="url(#paint3_linear_2764_16236)"
              />
              <path
                d="M10.7002 9.2002V20.2002"
                stroke="url(#paint4_linear_2764_16236)"
              />
              <path
                d="M11.2002 22.7002L6.7002 27.7002V32.7002"
                stroke="#ECF5FA"
              />
              <path
                d="M14.2002 2.7002V13.7002"
                stroke="url(#paint5_linear_2764_16236)"
              />
              <path
                d="M17.7003 6.2002V16.7002L15.4282 18.9723C14.9714 19.4291 14.7666 20.0779 14.8342 20.7204C14.9358 21.6865 15.0111 23.0791 14.7003 23.7002C14.2 24.7002 9.20061 28.7002 9.20032 29.2002C9.20003 29.7002 9.20032 34.7002 9.20032 34.7002L9.7002 35.2002"
                stroke="url(#paint6_linear_2764_16236)"
              />
              <path
                d="M17.7002 23.7002L12.2002 29.2002L11.7002 30.7002V36.2002"
                stroke="#ECF5FA"
              />
              <path
                d="M6.2002 37.2002V39.2002L8.7002 41.7002V46.7002V60.7002"
                stroke="#ECF5FA"
              />
              <path
                d="M11.7002 37.7002V42.2002L8.7002 45.2002"
                stroke="#ECF5FA"
              />
              <path
                d="M2.7002 45.2002V62.7002V70.7002L2.2002 72.2002"
                stroke="#ECF5FA"
              />
              <path
                d="M4.7002 51.7002V65.7002L4.2002 67.2002"
                stroke="#ECF5FA"
              />
              <path
                d="M15.2002 32.7002V41.7002L11.2002 45.7002L11.7002 56.7002L11.2002 58.2002"
                stroke="#ECF5FA"
              />
              <path
                d="M18.7002 31.2002V41.7002L18.2002 43.7002L15.7002 45.7002L13.7002 47.7002V54.7002L13.2002 55.7002"
                stroke="#ECF5FA"
              />
              <circle
                cx="1.75"
                cy="23.1504"
                r="1.25"
                fill="#060B1B"
                stroke="#ECF5FA"
              />
              <circle
                cx="6.15039"
                cy="12.9502"
                r="1.25"
                fill="#060B1B"
                stroke="#7EE3FF"
              />
              <circle
                cx="7.75"
                cy="2.75"
                r="1.25"
                fill="#060B1B"
                stroke="#7EE3FF"
              />
              <circle
                cx="2.4502"
                cy="1.8501"
                r="1.25"
                fill="#060B1B"
                stroke="#7EE3FF"
              />
              <circle
                cx="14.4502"
                cy="1.75"
                r="1.25"
                fill="#060B1B"
                stroke="#7EE3FF"
              />
              <circle
                cx="13.9502"
                cy="15.0503"
                r="1.25"
                fill="#060B1B"
                stroke="#7EE3FF"
              />
              <circle
                cx="17.8506"
                cy="5.8501"
                r="1.25"
                fill="#060B1B"
                stroke="#7EE3FF"
              />
              <circle
                cx="17.8506"
                cy="23.0503"
                r="1.25"
                fill="#060B1B"
                stroke="#ECF5FA"
              />
              <circle
                cx="10.9502"
                cy="21.75"
                r="1.25"
                fill="#060B1B"
                stroke="#ECF5FA"
              />
              <circle
                cx="11.6504"
                cy="37.4502"
                r="1.25"
                fill="#060B1B"
                stroke="#ECF5FA"
              />
              <circle
                cx="6.15039"
                cy="36.4502"
                r="1.25"
                fill="#060B1B"
                stroke="#ECF5FA"
              />
              <circle
                cx="2.4502"
                cy="44.8501"
                r="1.25"
                fill="#060B1B"
                stroke="#ECF5FA"
              />
              <circle
                cx="18.25"
                cy="30.4502"
                r="1.25"
                fill="#060B1B"
                stroke="#ECF5FA"
              />
              <circle
                cx="14.8506"
                cy="32.0503"
                r="1.25"
                fill="#060B1B"
                stroke="#ECF5FA"
              />
              <circle
                cx="4.75"
                cy="51.4502"
                r="1.25"
                fill="#060B1B"
                stroke="#ECF5FA"
              />
              <circle
                cx="10.75"
                cy="8.4502"
                r="1.25"
                fill="#060B1B"
                stroke="#7EE3FF"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_2764_16236"
                  x1="48.001"
                  y1="11.2998"
                  x2="71.2275"
                  y2="89.6772"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#59CEFC" />
                  <stop offset="1" stopColor="#E7E7E7" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_2764_16236"
                  x1="3.05916"
                  y1="3.21023"
                  x2="17.6741"
                  y2="11.2996"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#59CEFC" />
                  <stop offset="1" stopColor="#E7E7E7" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_2764_16236"
                  x1="7.89108"
                  y1="3.70326"
                  x2="11.5406"
                  y2="5.17463"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#59CEFC" />
                  <stop offset="1" stopColor="#E7E7E7" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear_2764_16236"
                  x1="6.77284"
                  y1="14.2024"
                  x2="10.1183"
                  y2="19.8051"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#59CEFC" />
                  <stop offset="1" stopColor="#E7E7E7" />
                </linearGradient>
                <linearGradient
                  id="paint4_linear_2764_16236"
                  x1="10.8911"
                  y1="9.20394"
                  x2="14.7175"
                  y2="10.4661"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#59CEFC" />
                  <stop offset="1" stopColor="#E7E7E7" />
                </linearGradient>
                <linearGradient
                  id="paint5_linear_2764_16236"
                  x1="14.3911"
                  y1="2.70394"
                  x2="18.2175"
                  y2="3.96613"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#59CEFC" />
                  <stop offset="1" stopColor="#E7E7E7" />
                </linearGradient>
                <linearGradient
                  id="paint6_linear_2764_16236"
                  x1="10.8227"
                  y1="6.21006"
                  x2="27.7453"
                  y2="24.2079"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#59CEFC" />
                  <stop offset="1" stopColor="#E7E7E7" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <nav className="flex flex-col items-center gap-8 flex-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-center justify-center text-center transition-all"
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-14 h-14 md:w-12 md:h-12 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-300
                        ${
                          item.image
                            ? "bg-transparent"
                            : isActive
                            ? "bg-[var(--Secondary)]"
                            : "bg-transparent hover:bg-[#0f1629]"
                        }`}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.label}
                          className={`w-10 h-10 rounded-full object-cover transition-all duration-300
                            ${
                              isActive
                                ? "border-2 border-[var(--Secondary)]"
                                : "border-2 border-transparent"
                            }`}
                        />
                      ) : (
                        <item.icon
                          size={30}
                          strokeWidth={1.7}
                          className={`transition-all duration-300 ${
                            isActive ? "text-[var(--Primary)]" : "text-white"
                          }`}
                        />
                      )}
                    </div>
                    <span className="text-[var(--font_primary)] text-xs md:text-base mt-1">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 z-[40] md:hidden transition-opacity duration-300"
          />
        )}
      </div>
    </>
  );
};

export default Navbar;

// Burger Menu

// import { NavLink } from "react-router-dom";
// import { Home, LayoutDashboard, Bot } from "lucide-react";
// import LogoR from "../assets/images/LogoR.png";
// import user from "../assets/images/user.png";

// const Sidebar = () => {
//   const menuItems = [
//     { id: "home", icon: Home, label: "Home", path: "/home" },
//     { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/home/dashboard" },
//     { id: "chatbot", icon: Bot, label: "Chatbot", path: "/home/chatbot" },
//     { id: "profile", icon: null, label: "Profile", path: "/home/profile", image: user },
//   ];

//   return (
//     <aside
//       className="bg-[var(--Primary)] border-t md:border-r border-[#EFEFEF]/10 flex
//                  md:flex-col items-center justify-between w-full md:w-[134px]
//                  py-2 md:py-6 md:h-screen fixed md:static bottom-0 md:top-0 z-50 transition-all duration-300"
//       style={{
//         boxShadow: "4px 0px 4px 0px rgba(186, 186, 186, 0.05)",
//       }}
//     >
//       {/* Logo */}
//       <div className="hidden md:flex w-12 h-12 items-center justify-center">
//         <img src={LogoR} alt="Logo" className="w-full h-full object-contain" />
//       </div>

//       {/* Navigation */}
//       <nav className="flex md:flex-col items-center justify-around flex-1 w-full md:mt-6">
//         {menuItems.map((item) => (
//           <NavLink
//             key={item.id}
//             to={item.path}
//             end
//             className="flex flex-col items-center justify-center text-center transition-all"
//           >
//             {({ isActive }) => (
//               <>
//                 <div
//                   className={`w-14 h-14 md:w-12 md:h-12 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-300
//                     ${
//                       item.image
//                         ? "bg-transparent"
//                         : isActive
//                         ? "bg-[var(--Secondary)]"
//                         : "bg-transparent hover:bg-[#0f1629]"
//                     }`}
//                 >
//                   {item.image ? (
//                     <img
//                       src={item.image}
//                       alt={item.label}
//                       className={`w-10 h-10 rounded-full object-cover transition-all duration-300
//                         ${
//                           isActive
//                             ? "border-2 border-[var(--Secondary)]"
//                             : "border-2 border-transparent"
//                         }`}
//                     />
//                   ) : (
//                     <item.icon
//                       size={30}
//                       strokeWidth={1.7}
//                       className={`transition-all duration-300 ${
//                         isActive ? "text-[var(--Primary)]" : "text-white"
//                       }`}
//                     />
//                   )}
//                 </div>
//                 <span className="text-[var(--font_primary)] text-xs md:text-[12px] mt-1">
//                   {item.label}
//                 </span>
//               </>
//             )}
//           </NavLink>
//         ))}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;
