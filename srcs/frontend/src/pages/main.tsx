import {Routes, Route} from 'react-router-dom';
import {useLocation } from 'react-router-dom';

import ProtectedRoutes from "@/utils/ProtectedRoutes"
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { LoginPage } from "@/pages/Loginpage";
import { ResetPassword } from '@/components/ResetPassword';
import { Dashboard } from "@/pages/Dashboard"
import { Profile } from "@/pages/Profile"
import { Jobs } from "@/components/Jobs"
import { Condidates } from "@/components/Condidates"
import { OTPpage } from '@/components/OTPpage';
import { NotFound } from "@/components/NotFound"


export function Main () {
  const location = useLocation();
    const isLoginPage = location.pathname === '/';
    if (isLoginPage) {
        return (
            <main className="h-full w-full lg:h-screen lg:w-screen  overfolw-auto custom-scrollbar bg-[#0a1128] place-items-center place-content-center">
              {/* {<SimpleSignUp/>} */}
              {/* {<ResetPassword/>} */}
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        );
    }
  return (
      <div className="flex flex-col h-screen w-screen bg-black overflow-hidden ">
          <div className="h-20 fixed right-0 left-0 top-0 w-full bg-[#0a1128] border-b-2 border-[#5F88B8]">
              <Header/>
          </div>
          <div className="flex w-full h-full bg-[#0a1128]  my-20 pb-20 lg:pb-0">
              {/* Sidebar */}
                <Sidebar />
              {/* Main Content */}
                <main className="w-full h-full lg:w-[90%] max-w-[1500px] mx-auto mt-2 p-1 overflow-auto custom-scrollbar">
                    <Routes>
                      <Route element={<ProtectedRoutes />}>
                        <Route path="/Dashboard" element={<Dashboard />} />
                        <Route path="/Jobs" element={<Jobs />} />
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

