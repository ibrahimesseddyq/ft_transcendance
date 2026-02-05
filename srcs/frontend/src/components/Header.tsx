import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { Navbar } from "@/components/Navigation";
import { SearchField } from '@/components/ui/SearchField';
import { Notifications } from '@/components/ui/Notifications';
import { useAuthStore } from '@/utils/ZuStand';

export function Header() {
  const user = useAuthStore((state) => state.user);
  const BACKEND_URL = "http://localhost:3000";
  const avatarUrl = `${BACKEND_URL}${user?.avatarUrl}`;
  return (
    <header className="mx-auto flex gap-2 justify-between h-full w-full rounded-xl
      max-w-screen-2xl items-center px-8 bg-white/80 backdrop-blur-sm">
      
      {/* Logo */}
      <Link 
        to="/Dashboard" 
        className="hover:scale-105  inline-flex items-center gap-2 
          group transition-all duration-300 "
      >
        <img 
          src="/logo.svg" 
          alt="RH Connect" 
          className="w-8 h-8 object-contain transition-all duration-700 ease-in-out group-hover:rotate-[360deg]" 
        />
        <h1 className="text-md text-center p-2 sm:flex hidden">
          RH-<span className="pramary-text font-bold">Connect</span>
        </h1>
      </Link>  

      {/* Navigation SECTION */}
      <Navbar />
      <div className="flex justify-end items-center gap-2 md:gap-5 min-w-fit">
          <Notifications />

          <Link to="/profile" className="flex items-center gap-3 group">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-bold text-black group-hover:text-[#00adef] transition-colors">{user?.firstName}</p>
              <p className="text-[10px] text-[#00adef] font-semibold tracking-wider uppercase">@{user?.role}</p>
            </div>
            
            <div
              className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-gray-800 group-hover:border-[#00adef] transition-all"
              style={{ 
                backgroundImage: `url("${user?.avatarUrl ? avatarUrl : "/icons/placeholder.jpg"}")` 
              }}
            />
          </Link>
        </div>
    </header>
  );
}