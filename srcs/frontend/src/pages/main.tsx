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
import { Chat } from '@/components/Chat'
import { AuthGuard } from '@/utils/AuthGard'
import { EditProfile } from '@/components/EditProfile';
import { ApplicationDetails } from '@/components/ApplicationDetails'
import { UserApplications } from '@/components/UserApplications';
import { UserPhase } from '@/components/UserPhase'
import { AboutUs } from '@/pages/AboutUs'
import { PrivacyPolicy } from '@/pages/PrivacyPolicy'
import { TermsOfService } from '@/pages/TermsOfService'
import { Footer } from '@/components/Footer'

export function Main() {
  const location = useLocation();
  const { user, profile, qrVerified } = useAuthStore(); 

  const isAdminOrRecruiter = ["admin", "recruiter"].includes(user?.role ?? "");
  const hasProfile = profile ? true : false;
  
  const publicPaths = ['/Login', '/reset-password', '/Otp', '/auth/callback'];
  const isPublicPage = publicPaths.includes(location.pathname) || location.pathname === '/';

  const FullScreenWrapper = ({ children }: { children: React.ReactNode }) => (
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-slate-50 via-sky-50/60 to-slate-100
      dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 md:h-screen md:overflow-hidden">
      {children}
    </main>
  );

  if (isPublicPage && !user) {
    return (
      <FullScreenWrapper>
        <Routes>
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Otp" element={<QRcode/>} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route path="*" element={<Navigate to="/Login" replace />} />
        </Routes>
      </FullScreenWrapper>
    );
  }

 if (user && !isAdminOrRecruiter && qrVerified && !hasProfile) {
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
    <AuthGuard>
      <div className="min-h-screen w-full bg-[#F0F3FA] dark:bg-[#0f172a]  
        md:h-screen overflow-y-auto custom-scrollbar px-2 md:px-4 ">
        <div className="h-20 w-full sticky top-2 z-50">
          <Header />
        </div>

        <div className="flex flex-1 w-full max-w-screen-2xl  overflow-hidden mx-auto">
          <main className="w-full h-full">
            <Routes>
              {/* STAFF ROUTES (Admin & Recruiter) */}
              <Route element={<ProtectedRoute allowedRoles={['admin', 'recruiter']} />}>
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/AppAllCards" element={<AppAllCards />} />
                <Route path="/Application/:jobId" element={<Application />} />
                <Route path="/QuizPage" element={<QuizPage />} />
              </Route>




              {/* CANDIDATE ROUTES */}
              <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
                <Route path="/Applications" element={<UserApplications/>} />
                <Route path="/UserPhase/:appId" element={<UserPhase/>} />
              </Route>

              {/* SHARED ROUTES */}
              <Route element={<ProtectedRoute allowedRoles={['admin', 'recruiter', 'candidate']} />}>
                <Route path="/Jobs" element={<Jobs />} />
                <Route path="/Jobdescription/:jobId" element={<JobDescription />} />
                <Route path="/Profile/:postId" element={<Profile />} />
                <Route path="/Chat" element={<Chat />} />
                <Route path="/EditProfile" element={<EditProfile />} />
                <Route path="/ApplicationDetails/:id" element={<ApplicationDetails />} />
                <Route path="/About" element={<AboutUs />} />
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                <Route path="/TermsOfService" element={<TermsOfService />} />
              </Route>

              {/* ROOT REDIRECT */}
              <Route path="/" element={
                user?.role === 'candidate' ? <Navigate to="/Jobs" /> : <Navigate to="/Dashboard" />
              } />

              <Route path="/NotFound" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </AuthGuard>
  );
}