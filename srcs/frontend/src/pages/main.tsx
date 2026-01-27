import {Routes, Route} from 'react-router-dom';
import {useLocation } from 'react-router-dom';
import ProtectedRoutes from "@/utils/ProtectedRoutes"
import { Sidebar } from "@/components/Sidebar";
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
            <main className="h-screen w-screen bg-[#0a1128] overflow-auto custom-scrollbar
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
      <div className="h-screen w-screen bg-[#0a1128] overflow-auto custom-scrollbar">
        <div className='h-full w-full flex flex-col mx-auto
          custom-scrollbar'>
            {/* Sidebar */}
            <div className="h-full w-full max-h-20 
              sticky top-0 z-50 border-b bg-[#1e3249] 
               border-[#5F88B8] border-opacity-30">
                <Header/>
            </div>
            <div className="container mx-auto flex h-full max-w-screen-2xl
                items-center justify-between overflow-hidden">
                <div className="h-full ps-0 p-8 max-md:hidden md:sticky w-44 top-16 z-10
                  border-r border-[#5F88B8] border-opacity-30">
                  <Sidebar />
                </div>
                {/* Main Content */}
                  <main className="w-full h-full items-center justify-center lg:max-h-[1100px]
                    overflow-auto no-scrollbar p-0 md:pl-8 ">
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
        </div>    
  );
};

