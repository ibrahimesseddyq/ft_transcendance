import {Routes, Route, Navigate} from 'react-router-dom';
import {useLocation } from 'react-router-dom';
import { Header } from "@/components/Header";
import { LoginPage } from "@/pages/Loginpage";
import { ResetPassword } from '@/components/ResetPassword';
import { ProfileInformations } from "@/components/ProfileInformations"
import { Dashboard } from "@/pages/Dashboard"
import { Profile } from "@/pages/Profile"
import { Jobs } from "@/components/Jobs"
import { ViewJob } from "@/components/ViewJob"
import { Condidates } from "@/components/Condidates"
import { OTPpage } from '@/components/OTPpage';
import { NotFound } from "@/components/NotFound";
import { useTransition as ViewTransition } from 'react';


export function Main() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  
  const publicPaths = ['/Login', '/reset-password', '/otp'];
  const isPublicPage = publicPaths.includes(location.pathname) || location.pathname === '/';

  if (!token && !isPublicPage) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  if (isPublicPage) {
    if (token && location.pathname === '/Login') {
      return <Navigate to="/Dashboard" replace />;
    }

    return (
      <main className="h-screen w-screen bg-white flex items-center justify-center">
        <Routes>
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/Login" replace />} />
          <Route path="*" element={<Navigate to="/Login" replace />} />
        </Routes>
      </main>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F0F3FA] overflow-hidden pt-4 px-4">
      {/* Header */}
      <div className="h-20 w-full sticky top-0 z-50 bg-white rounded-xl shadow-xl shadow-black/10 border-[#5F88B8] border-opacity-30 shrink-0">
        <Header />
      </div>

      <div className="flex flex-1 w-full max-w-screen-2xl mx-auto overflow-hidden">
        <main className="w-full h-full py-5 overflow-auto no-scrollbar">
          <Routes>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Jobs" element={<Jobs />} />
            <Route path="/Jobs/Viewjob" element={<ViewJob />} />
            <Route path="/Condidates" element={<Condidates />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Messages" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}