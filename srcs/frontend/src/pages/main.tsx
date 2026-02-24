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
import { NotFound } from "@/components/NotFound";
import { useAuthStore } from '@/utils/ZuStand';
import { Application } from '@/components/Application'
import { AppAllCards } from '@/components/AppAllCards'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import { JobDescription } from '@/components/JobDescription'
import { QRcode } from '@/components/QRcode'
import { QuizPage } from '@/components/QuizPage'

export function Main() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const userId = useAuthStore((state) => state.userId);
  const token = useAuthStore((state) => state.token);
  const profile = useAuthStore((state) => state.profile);
  const qrVerified = useAuthStore((state) => state.qrVerified);


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
  
  console.log("qrVerified : ", qrVerified);
  console.log("userId : ", userId);
  if (token && userId && !qrVerified){
    {console.log("Was here")}
    return (
      <FullScreenWrapper>
        <Routes>
          <Route path="/otp" element={<QRcode/>} />
          <Route path="*" element={<Navigate to="/otp" replace />} />
        </Routes>
      </FullScreenWrapper>
    );
  }
  console.log("has profile : ", hasProfile);
 if (token && user && qrVerified && !hasProfile) {
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
    <div className="min-h-screen w-full bg-[#F0F3FA] md:h-screen overflow-y-auto custom-scrollbar md:px-4 ">
      <div className="h-20 w-full sticky top-2 z-50">
        <Header />
      </div>

      <div className="flex flex-1 w-full max-w-screen-2xl mx-auto overflow-hidden">
        <main className="w-full ">
          <Routes>
            {/* STAFF ROUTES (Admin & Recruiter) */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'recruiter']} />}>
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/AppAllCards" element={<AppAllCards />} />
              <Route path="/QuizPage" element={<QuizPage />} />
            </Route>

            {/* CANDIDATE ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'recruiter', 'candidate']} />}>
              <Route path="/Jobs" element={<Jobs />} />
              <Route path="/Jobdescription" element={<JobDescription />} />
              <Route path="/Application/:jobId" element={<Application />} />
              <Route path="/Profile/:postId" element={<Profile />} />
            </Route>

            {/* ROOT REDIRECT */}
            <Route path="/" element={
              user?.role === 'user' ? <Navigate to="/Jobs" /> : <Navigate to="/Dashboard" />
            } />

            <Route path="/NotFound" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}