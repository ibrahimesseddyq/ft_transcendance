import { Link } from 'react-router-dom';
import { Navbar } from "@/components/Navigation";
import { Notifications } from '@/components/ui/Notifications';
import { useAuthStore } from '@/utils/ZuStand';

export function Header() {
  const user = useAuthStore((state) => state.user);
  const isAdminOrRecruiter = ["admin", "recruiter"].includes(user?.role);
  const profile = useAuthStore((state) => state.profile);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const avatarUrl = `${BACKEND_URL}${profile.user?.avatarUrl || user?.avatarUrl}`;
  const redirectPath = isAdminOrRecruiter ? "/Dashboard" : "/Jobs";
  return (
    <header className="mx-auto flex justify-between h-16 w-full md:rounded-xl
      max-w-screen-2xl items-center px-4 md:px-8 bg-white/80 backdrop-blur-sm fixed md:sticky top-0 z-50">
      
      {/* Logo */}
      <Link to={redirectPath}
        className="hover:scale-105 inline-flex items-center gap-2 group transition-all duration-300"
      >
        <img 
          src="/logo.svg" 
          alt="RH Connect" 
          className="w-7 h-7 md:w-8 md:h-8 object-contain transition-all duration-700 ease-in-out group-hover:rotate-[360deg]" 
        />
        <h1 className="text-sm md:text-md text-center p-2 sm:flex hidden">
          RH-<span className="text-[#00adef] font-bold">Connect</span>
        </h1>
      </Link>  

      {/* Navigation */}
      <div className="hidden lg:block">
        <Navbar />
      </div>

      <div className="flex justify-end items-center gap-3 md:gap-5">
        <Notifications />

        <Link to={`/Profile/${user?.id}`}
          className="flex items-center gap-2 md:gap-3 group">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-bold text-black group-hover:text-[#00adef] transition-colors">
              {user?.firstName}
            </p>
            <p className="text-[10px] text-[#00adef] font-semibold tracking-wider uppercase">
              @{user?.role}
            </p>
          </div>
          
          {/* Avatar */}
          <div
            className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-cover bg-center border-2 border-gray-800 group-hover:border-[#00adef] transition-all"
            style={{ 
              backgroundImage: `url("${ avatarUrl }")`
            }}
          />
        </Link>

        {/* Mobile Menu */}
        <div className="lg:hidden">
            <Navbar /> 
        </div>
      </div>
    </header>
  );
}