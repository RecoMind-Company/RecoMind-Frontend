import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "../layouts/Layout";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import MasterLayout from "../layouts/MasterLayout";
import Home from "../pages/Home";
import NotFound from "../UI/NotFound";
import ForgotPassword from "../pages/ForgotPassword";
import Verification from "../pages/Verification";
import Completed from "../pages/Completed";
import PersonalInfoPage from "../pages/PersonalInfoPage";
import DashBoard from "../pages/DashBoard";
import ChatBot from "../pages/ChatBot";
import PublicRoute from "../Auth/PublicRoute";
import ProtectedRoute from "../Auth/ProtectedRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Auth Routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Layout />
          </PublicRoute>
        }
      >
        <Route index element={<Login />}></Route>
        <Route path="signup" element={<SignUp />}></Route>
        <Route path="forgotpassword" element={<ForgotPassword />}></Route>
        <Route path="verification" element={<Verification />}></Route>
        <Route path="completed" element={<Completed />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Route>
      {/* Main Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <MasterLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="dashboard" element={<DashBoard />} />
        <Route path="chatbot" element={<ChatBot />} />
        <Route path="profile" element={<PersonalInfoPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </>
  )
);
export default router;
