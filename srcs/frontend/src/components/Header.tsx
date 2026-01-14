import { Search, Bell} from "lucide-react";
import {Link } from 'react-router-dom';


export function Header() {
  return (
  <header className="container mx-auto flex justify-between 
  h-full max-w-screen-2xl items-center px-4 sm:px-8 ">
    <Link
        to={"/Dashboard"}
        className="h-full w-64 place-content-center">
        <h1 className="hover:scale-105 text-md text-center p-3 logo">
          RH-<span className="pramary-text font-bold">Connect</span>
        </h1>
    </Link>
  {/*search bar */}
  <div className="w-full h-9 flex justify-center items-center">
    <button className="flex sm:hidden childcard w-10 h-10 items-center justify-center">
      <Search className="h-4 w-4 text-[#94999A] hover:text-green-600" />
      <div className="sm:flex h-full w-60 items-center hidden rounded-md
        bg-[#1F2027] pl-5  border border-[#5F88B8] px-5 gap-2">
        <button className="h-6 w-6 cursor-pointer">
          <Search className="h-full w-full text-[#94999A] hover:text-green-600" />
        </button>
        <input
          id="searchBar"
          placeholder="Search"
          type='search'
          className="flex h-full w-full max-h-10 outline-none 
            placeholder-[#94999A]text-white bg-transparent"
        />
      </div>
    </button>
    <div className="sm:flex h-full w-60 items-center hidden rounded-md
        bg-[#1F2027] pl-5  border border-[#5F88B8] px-5 gap-2">
      <button className="h-6 w-6 cursor-pointer">
          <Search className="h-full w-full text-[#94999A] hover:text-green-600" />
        </button>
      <input
        id="searchBar"
        placeholder="Search"
        type='search'
        className="flex h-full w-full max-h-10 outline-none placeholder-[#94999A]
           text-white bg-transparent"
      />
    </div>
  </div>

  {/*user section */}
  <div className="w-[30%] flex justify-end items-center gap-2 ">
      <button className="relative inline-flex items-center justify-center h-10 w-10 childcard">
        <Bell className="h-5 w-5 text-gray-300 hover:text-green-600" />
      </button>

      <Link
        to="/profile"
        className="flex items-center space-x-3"
      >
        <div
          className="h-12 w-12 rounded-full bg-cover bg-center"
          style={{ backgroundImage: "url('../src/assets/icons/profile.png')" }}
        />
        <div className="text-right hidden sm:block">
          <p className="text-sm xl:text-md font-medium text-white">CHIDORI</p>
          <p className="text-xs xl:text-md text-green-600">@Developer</p>
        </div>
      </Link>
  </div>

</header>

  );
}