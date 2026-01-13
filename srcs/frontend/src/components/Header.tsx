import { Search, Bell} from "lucide-react";
import {Link } from 'react-router-dom';


export function Header() {
  return (
  <header className="flex h-full w-full  items-center justify-center">
       <Link
        to={"/Dashboard"}
        className="hidden sm:flex h-full w-[300px]  border-r-2 border-[#5F88B8] 
        place-content-center place-items-center">
        <h1 className="hover:scale-105 text-xl text-center text-white">RH-<span className="pramary-text font-bold">Connect</span></h1>
      </Link>
  {/*search bar */}
  <div className="w-full flex  justify-center h-16 mt-auto items-center">
    <div className="flex w-[50%]  h-12 items-center">
      {/* <Search className=" h-4 w-4  2xl:h-8 2xl:w-8  text-[#94999A]" /> */}
      <input
        placeholder="Search"
        type='search'
        className="flex h-full w-full max-h-10 rounded-xl outline-none placeholder-[#94999A]
           text-white bg-[#1F2027] pl-10  border border-[#5F88B8] px-5"
      />
    </div>
  </div>

  {/*user section */}
  <div className="w-[30%] flex justify-end items-center mr-4 divide-x-2 divide-[#5F88B8]">
      <button className="relative inline-flex items-center justify-center h-14 w-14 pr-4">
        <Bell className="h-[70%] w-[70%] text-gray-300 hover:text-green-600" />
      </button>

      <Link
        to="/profile"
        className="flex items-center space-x-3 pl-4 pr-8"
      >
        <div
          className="h-12 w-12 rounded-full bg-cover bg-center"
          style={{ backgroundImage: "url('../src/assets/icons/profile.png')" }}
        />
        <div className="text-right">
          <p className="text-sm xl:text-md font-medium text-white">CHIDORI</p>
          <p className="text-xs xl:text-md text-green-600">@Developer</p>
        </div>
      </Link>
  </div>

</header>

  );
}