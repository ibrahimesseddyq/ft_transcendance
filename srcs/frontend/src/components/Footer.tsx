import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full py-4 px-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs text-gray-500 dark:text-gray-400">
      <span>&copy; {new Date().getFullYear()} Hirefy. All rights reserved.</span>
      <div className="flex items-center gap-4">
        <Link to="/PrivacyPolicy" className="hover:text-primary transition-colors">
          Privacy Policy
        </Link>
        <span className="hidden sm:inline">|</span>
        <Link to="/TermsOfService" className="hover:text-primary transition-colors">
          Terms of Service
        </Link>
      </div>
    </footer>
  );
}
