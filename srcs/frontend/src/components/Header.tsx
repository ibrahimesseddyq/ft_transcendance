import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { SearchField } from '@/components/ui/SearchField'
import { Notifications } from '@/components/ui/Notifications'


export function Header() {
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

  return (
    <header className="container mx-auto flex justify-between h-full max-w-screen-2xl items-center py-2 px-4 sm:px-8 relative">
      
      {/* Logo */}
      {!isMobileSearchVisible && (
        <Link to={"/Dashboard"} className="h-full w-auto sm:w-36 place-content-center">
          <h1 className="hover:scale-105 text-md text-center p-2 logo">
            RH-<span className="pramary-text font-bold">Connect</span>
          </h1>
        </Link>
      )}

      {/* SEARCH SECTION */}
      <SearchField 
        isMobileSearchVisible={isMobileSearchVisible}
        setIsMobileSearchVisible={setIsMobileSearchVisible}/>

      {!isMobileSearchVisible && (
        <div className="flex justify-end items-center gap-2 sm:w-[30%]">
          <Notifications/>

          <Link to="/profile" className="flex items-center space-x-3">
            <div
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-cover bg-center border border-gray-700"
              style={{ backgroundImage: "url('../src/assets/icons/profile.png')" }}
            />
            <div className="text-right hidden lg:block">
              <p className="text-sm font-medium text-white">CHIDORI</p>
              <p className="text-xs text-green-600">@Developer</p>
            </div>
          </Link>
        </div>
      )}
    </header>
  );
}