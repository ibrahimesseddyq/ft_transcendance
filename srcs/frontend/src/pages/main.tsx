import {Routes, Route} from 'react-router-dom';
import {useLocation } from 'react-router-dom';
import ProtectedRoutes from "@/utils/ProtectedRoutes"
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


export function Main () {
  const location = useLocation();
    const isLoginPage = location.pathname === '/';
    if (isLoginPage) {
        return (
            <main className="h-screen w-screen bg-[#FFFFFF] overflow-auto custom-scrollbar
              place-content-center place-items-center">
              {/* <OTPpage/> */}
              <Routes>
                <Route path="/" element={<ProfileInformations />} />
              </Routes>
                {/* <Routes>
                    <Route path="/" element={<LoginPage />} />
                </Routes> */}
            </main>
        );
    }
  return (
      <div className="h-screen w-screen flex flex-col 
      bg-[#F0F3FA] overflow-auto custom-scrollbar pt-4 px-4">
        
        {/* Sidebar */}
        <div className="h-full w-full max-h-20
          sticky top-0 z-50 bg-white rounded-xl shadow-xl shadow-black/10
           border-[#5F88B8] border-opacity-30">
            <Header/>
        </div>
        <div className="flex h-full max-w-screen-2xl
             justify-between overflow-hidden">
            {/* Main Content */}
              <main className="w-full h-full items-center justify-center
                overflow-auto no-scrollbar py-5">
                  <Routes>
                    <Route element={<ProtectedRoutes />}>
                      <Route path="/Dashboard" element={<Dashboard />} />
                      <Route path="/Jobs" element={<Jobs />} />
                      <Route path="/Jobs/Viewjob" element={<ViewJob />} />
                      <Route path="/Condidates" element={<Condidates />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/Messages" element={<NotFound />} />
                    </Route>
                  </Routes>
              </main>
        </div>
      </div>    
  );
};

