// import { useState, useEffect } from 'react';
// import { OAuthCallback }from '@/components/OAuthCallback';
import {Routes, Route, Navigate} from 'react-router-dom';
import {useLocation } from 'react-router-dom';
import { Header } from "@/components/Header";
import { LoginPage } from "@/pages/Loginpage"
import { ProfileInformations } from "@/components/ProfileInformations";
import { Dashboard } from "@/pages/Dashboard"
import { Profile } from "@/pages/Profile"
import { Jobs } from "@/components/Jobs"
import { ViewJob } from "@/components/ViewJob"
import { Condidates } from "@/components/Condidates"
import { NotFound } from "@/components/NotFound";
import { useAuthStore } from '@/utils/ZuStand';


export function Main() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const hasProfile = useAuthStore((state) => state.user?.hasProfile);
  
  const publicPaths = ['/Login', '/reset-password', '/otp'];
  const isPublicPage = publicPaths.includes(location.pathname) || location.pathname === '/';

  if (!token && !isPublicPage) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  const FullScreenWrapper = ({ children }: { children: React.ReactNode }) => (
    <main className="min-h-screen w-full flex flex-col bg-[#F0F3FA] md:h-screen md:overflow-hidden pt-4 px-4">
      {children}
    </main>
  );

  if (isPublicPage) {
    return (
      <FullScreenWrapper>
        <Routes>
          <Route path="/Login" element={<LoginPage />} />
          {/* <Route path="/auth/callback" element={<OAuthCallback />} /> */}
          <Route path="*" element={<Navigate to="/Login" replace />} />
        </Routes>
      </FullScreenWrapper>
    );
  }

  if (user && !hasProfile) {
    return (
      <FullScreenWrapper>
        <Routes>
          <Route path="/Createprofile" element={<ProfileInformations />} />
          <Route path="*" element={<Navigate to="/Createprofile" replace />} />
        </Routes>
      </FullScreenWrapper>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F0F3FA] md:h-screen md:overflow-hidden pt-4 px-4">
      <div className="h-20 w-full sticky top-0 z-50 bg-white rounded-xl shadow-xl shadow-black/10 border-[#5F88B8] border-opacity-30 shrink-0">
        <Header />
      </div>

      <div className="flex flex-1 w-full max-w-screen-2xl mx-auto overflow-hidden">
        <main className="w-full h-full py-5 overflow-y-auto no-scrollbar">
          <Routes>  
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Jobs" element={<Jobs />} />
            <Route path="/Jobs/Viewjob" element={<ViewJob />} />
            <Route path="/Condidates" element={<Condidates />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Messages" element={<NotFound />} />
            <Route path="/Createprofile" element={<Navigate to="/Dashboard" replace />} />
            <Route path="/" element={<Navigate to="/Dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}