// import { useState, useEffect } from 'react';
import { OAuthCallback }from '@/components/OAuthCallback';
import {Routes, Route, Navigate} from 'react-router-dom';
import {useLocation } from 'react-router-dom';
import { Header } from "@/components/Header";
import { LoginPage } from "@/pages/Loginpage"
import { ProfileInformations } from "@/components/ProfileInformations";
import { Dashboard } from "@/pages/Dashboard"
import { Profile } from "@/pages/Profile"
import { Jobs } from "@/components/Jobs"
import { Condidates } from "@/components/Condidates"
import { NotFound } from "@/components/NotFound";
import { useAuthStore } from '@/utils/ZuStand';
import { Application } from '@/components/Application'
import { AppAllCards } from '@/components/AppAllCards'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import { JobDescription } from '@/components/JobDescription'


export function Main() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const profile = useAuthStore((state) => state.profile);

  const hasProfile = !!profile;
  
  const publicPaths = ['/Login', '/reset-password', '/otp', '/auth/callback'];
  const isPublicPage = publicPaths.includes(location.pathname) || location.pathname === '/';

  if (!token && !isPublicPage) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  const FullScreenWrapper = ({ children }: { children: React.ReactNode }) => (
    <main className="min-h-screen w-full flex flex-col bg-[#F0F3FA] md:h-screen md:overflow-hidden pt-4 px-4">
      {children}
    </main>
  );

  if (token && !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
console.log("Current Profile Object:", profile);
console.log("Computed hasProfile:", !!profile);
  if (!token && isPublicPage) {
    return (
      <FullScreenWrapper>
        <Routes>
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route path="*" element={<Navigate to="/Login" replace />} />
        </Routes>
      </FullScreenWrapper>
    );
  }
  
  console.log("has profile : ", hasProfile);
  if (token && user && !hasProfile) {
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
    <div className="min-h-screen w-full bg-[#F0F3FA] md:h-screen overflow-y-auto custom-scrollbar md:px-4">
      <div className="h-20 w-full sticky top-2 z-50">
        <Header />
      </div>

      <div className="flex flex-1 w-full max-w-screen-2xl mx-auto overflow-hidden">
        <main className="w-full">
          <Routes> 
            <Route element={<ProtectedRoute />}/>
              <Route path="/Dashboard" element={<Dashboard />} />
            <Route/>
            <Route path="/Jobs" element={<Jobs />} />
            <Route path="/Jobdescription" element={<JobDescription />} />
            <Route path="/Application/:jobId" element={<Application />} />
            <Route path="/Condidates" element={<Condidates />} />
            <Route path="/Profile/:postId" element={<Profile />} />
            <Route path="/Messages" element={<NotFound />} />
            <Route path="/Createprofile" element={<Navigate to="/Dashboard" replace />} />
            <Route path="/AppAllCards" element={<AppAllCards />} />
            <Route path="/" element={<Navigate to="/Dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}