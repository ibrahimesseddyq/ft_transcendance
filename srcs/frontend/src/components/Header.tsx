import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { Navbar } from "@/components/Navigation";
import { SearchField } from '@/components/ui/SearchField'
import { Notifications } from '@/components/ui/Notifications'


export function Header() {

  return (
    <header className="mx-auto flex gap-2 justify-between h-full 
      max-w-screen-2xl items-center p-2 md:px-8">
      
      {/* Logo */}
      <Link to={"/Dashboard"} className="hidden md:block  h-full w-auto sm:w-36 place-content-center">
        <h1 className="hover:scale-105 text-md text-center p-2 logo">
          RH-<span className="pramary-text font-bold">Connect</span>
        </h1>
      </Link>

      {/* Navigation SECTION */}
      <Navbar />
      <div className="flex justify-end items-center gap-2 md:gap-5 min-w-fit">
          <Notifications />

          <Link to="/profile" className="flex items-center gap-3 group">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-bold text-black group-hover:text-[#00adef] transition-colors">CHIDORI</p>
              <p className="text-[10px] text-[#00adef] font-semibold tracking-wider uppercase">@Developer</p>
            </div>
            
            <div
              className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-gray-800 group-hover:border-[#00adef] transition-all"
              style={{ backgroundImage: "url('/icons/profile.png')" }}
            />
          </Link>
        </div>
    </header>
  );
}