import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

/* Layouts */
import Layout from "@/layouts/Layout";
import MasterLayout from "@/layouts/MasterLayout";

/* Auth Feature */
import Login from "@/features/auth/pages/Login";
import SignUp from "@/features/auth/pages/SignUp";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import Verification from "@/features/auth/pages/Verification";
import Completed from "@/features/auth/pages/Completed";

import PublicRoute from "@/features/auth/Auth/PublicRoute";
import ProtectedRoute from "@/features/auth/Auth/ProtectedRoute";

/* Home Feature */
import Home from "@/features/home/pages/Home";

/* Chatbot Feature */
import ChatBot from "@/features/chatbot/pages/ChatBot";

/* Profile Feature */
import PersonalInfoPage from "@/features/profile/pages/PersonalInfoPage";

/* Shared */
import NotFound from "@/UI/NotFound";
import TodaysTasks from "@/features/tasksBoard/pages/TodaysTasks";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* ================= AUTH ================= */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Layout />
          </PublicRoute>
        }
      >
        <Route index element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="forgotpassword" element={<ForgotPassword />} />
        <Route path="verification" element={<Verification />} />
        <Route path="completed" element={<Completed />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ================= APP ================= */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <MasterLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="tasks" element={<TodaysTasks />} />
        <Route path="chatbot" element={<ChatBot />} />
        <Route path="profile" element={<PersonalInfoPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </>,
  ),
);

export default router;
