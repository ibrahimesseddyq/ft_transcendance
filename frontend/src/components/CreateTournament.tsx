import { Plus } from "lucide-react";
import {Link } from 'react-router-dom';

export function CreateTournament() {


  return (
      <div className="w-full h-full border border-yellow-500 rounded-xl bg-[url('../src/assets/icons/deadpool.jpeg')] bg-no-repeat bg-center bg-cover
        flex flex-col items-center text-center place-content-center overflow-auto bg-[#1E212A] hover:shadow-[0_0_15px_0px_rgba(252,_211,_77,_0.3)]
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-white
      [&::-webkit-scrollbar-thumb]:rounded-full">
      {/* Yellow glowing circle */}
      <Link 
        to={"/tournaments"}
        className="bg-yellow-500  rounded-full p-4 flex items-center justify-center mb-4 hover:shadow-[1px_1px_51px_10px_rgba(112,_0,_0,_0.7)]">
        <Plus className="text-white hover:text-[#FF0000] w-6 h-6" />
      </Link>

      {/* Title */}
      <h2 className="text-white font-semibold font-electrolize text-lg lg:text-xl">Create tournament</h2>

      <p className="text-gray-400 text-sm lg:text-lg font-electrolize">
        Create if there is minimum{" "}
        <span className="text-yellow-500 font-medium font-electrolize">of 3 players</span>
      </p>
    </div>

  );
}