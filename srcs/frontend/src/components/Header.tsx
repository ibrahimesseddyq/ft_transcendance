import { Link } from 'react-router-dom';
import { Navbar } from "@/components/Navigation";
import { Notifications } from '@/components/ui/Notifications';
import { useAuthStore } from '@/utils/ZuStand';
import { Logout } from '@/components/LogOut';
import { Sun, Moon } from 'lucide-react';

export function Header() {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  const isAdminOrRecruiter = ["admin", "recruiter"].includes(user?.role ?? "");
  const BACKEND_URL = import.meta.env.VITE_MAIN_SERVICE_URL;

  const avatarUrl = profile?.user?.avatarUrl
    ? `${BACKEND_URL}${profile.user.avatarUrl}`
    : "/default-avatar.png";

  const redirectPath = isAdminOrRecruiter ? "/Dashboard" : "/Jobs";

  const handleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.theme = isDark ? "dark" : "light";
  };

  const LogoutClassName = 'hidden xl:block ml-2 text-xs font-bold uppercase tracking-tight';

  return (
    <header className="mx-auto flex justify-between h-16 w-full md:rounded-xl max-w-screen-2xl items-center px-4 md:px-8 
      bg-surface-main dark:bg-secondary-darkbg backdrop-blur-sm fixed md:sticky top-0 z-50 
      border-b md:border border-gray-100 dark:border-slate-800 transition-colors duration-300">
      
      {/* Logo */}
      <Link to={redirectPath}
        className="hover:scale-105 inline-flex items-center gap-2 group transition-all duration-300"
      >
        <img 
          src="/logo.svg" 
          alt="RH Connect" 
          className="w-7 h-7 md:w-8 md:h-8 object-contain transition-all duration-700 ease-in-out group-hover:rotate-[360deg]" 
        />
        <h1 className="text-sm md:text-md text-center p-2 sm:flex hidden text-black dark:text-white 
          transition-colors duration-300">
          RH-<span className="text-[#00adef] font-bold">Connect</span>
        </h1>
      </Link>

      {/* Navigation */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="flex justify-end items-center gap-3 md:gap-5">
        <Notifications />

        <button 
          onClick={handleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-yellow-400 
            hover:ring-2 ring-primary transition-all"
        >
          <Sun className="hidden dark:block w-5 h-5" />
          <Moon className="block dark:hidden w-5 h-5" />
        </button>

        {isAdminOrRecruiter ? (
          <div
            className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-cover bg-center border-2 
              border-gray-800 dark:border-slate-200 transition-all"
            style={{ backgroundImage: `url("/recruiter.jpg")` }}
          />
        ) : (
          <Link to={`/Profile/${user?.id}`} className="flex items-center gap-2 md:gap-3 group">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-bold text-black dark:text-surface-main group-hover:text-primary transition-colors">
                {user?.firstName}
              </p>
              <p className="text-[10px] text-primary font-semibold tracking-wider uppercase">
                @{user?.role}
              </p>
            </div>
            <div
              className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-cover bg-center border-2 
                border-gray-800 dark:border-slate-200 group-hover:border-primary transition-all"
              style={{ backgroundImage: `url("${avatarUrl}")` }}
            />
          </Link>
        )}

        {isAdminOrRecruiter && (
          <Logout className={LogoutClassName} />
        )}

        {/* Mobile Menu */}
        <div className="flex md:hidden">
          <Navbar />
        </div>
      </div>
    </header>
  );
}