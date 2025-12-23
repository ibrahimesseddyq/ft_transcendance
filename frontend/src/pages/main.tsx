import {Routes, Route} from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { LoginPage } from "@/pages/Loginpage";
import { HomePage } from "@/pages/Dashboard"
import { Profile } from "@/pages/Profile"
import { Games } from "@/components/Jobs"
import { Tournaments } from "@/components/Tournaments"
import { GameSettings } from "@/components/GameSettings"
import { GameBoard } from "@/components/Gameboard";
import { NotFound } from "@/components/NotFound"


export function Main () {
  const location = useLocation();
    const isLoginPage = location.pathname === '/';
    if (isLoginPage) {
        return (
            <main className="sm:rounded-tl-lg h-screen w-screen overflow-auto bg-[#21252E] items-center place-content-center">
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        );
    }
  return (
      <div className="flex flex-col h-screen w-screen bg-black overflow-hidden ">
          <div className="h-[10%] max-h-32 w-full bg-[#242B3A] border-b-2 border-[#5F88B8]">
              <Header/>
          </div>
          <div className="flex w-full h-[90%] bg-[#21252E] bg-no-repeat bg-center bg-cover pb-20 lg:pb-0">
              {/* Sidebar */}
                <Sidebar />
              {/* Main Content */}
                <main className="sm:rounded-tl-lg  w-full h-auto  lg:w-[90%] max-w-[2400px] overflow-hidden mx-auto mt-2">
                    <Routes>
                      <Route path="/homepage" element={<HomePage />} />
                      <Route path="/games" element={<Games/>} />
                      <Route path="/tournaments" element={<Tournaments />} />
                      <Route path="/gamesettings" element={<GameSettings />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/Gameboard" element={<GameBoard />} />
                      <Route path="*" element={<NotFound />} /> 
                    </Routes>

                </main>
          </div>
        </div>    
  );
};

