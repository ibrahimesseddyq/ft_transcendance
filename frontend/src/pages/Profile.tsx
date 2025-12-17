import { ProfileCover } from "@/components/ProfileCover";
import { ProfileStatistics } from "@/components/ProfileStatistics";
import { Leaderboard } from "@/components/Leaderboard";
import { Achivements } from "@/components/Achivements";
import { OnlineFriends } from "@/components/OnlineFriends";
import { UserMatches } from "@/components/UserMatches";

export function Profile(){
  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 lg:grid-rows-9 p-2 gap-2 w-full h-full">
      <div className="grid-cols-1  lg:col-span-9 lg:row-span-3">
        <ProfileCover />
      </div>
      <div className="lg:flex lg:flex-row grid-cols-1  lg:col-span-6 lg:row-span-5  gap-2 ">
        <div className="flex flex-col h-[400px] w-full lg:h-full border  border-yellow-500
        rounded-lg overflow-auto bg-[#1E212A] hover:shadow-[0_0_15px_0px_rgba(252,_211,_77,_0.3)]
        [&::-webkit-scrollbar]:w-2 place-items-center
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-white
          [&::-webkit-scrollbar-thumb]:rounded-full ">
          <header className="z-10 top-0 sticky bg-[#1E212A] w-full">
              <h5 className="text-center items-center font-electrolize text-xl 2xl:text-2xl font-medium
                text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-[#E2D800] w-fit mx-auto">
                  Statistics
              </h5>
          </header>
          <ProfileStatistics />
        </div>
        <div className="h-[400px] w-full lg:h-full border  border-yellow-500 rounded-lg overflow-auto bg-[#1E212A] hover:shadow-[0_0_15px_0px_rgba(252,_211,_77,_0.3)]
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-white
          [&::-webkit-scrollbar-thumb]:rounded-full">
          <Leaderboard />
        </div>
      </div>
      
      <div className="grid-cols-1  lg:col-span-3 lg:row-span-6  lg:col-start-7 lg:row-start-4 flex flex-col gap-2 ">
        <div className="h-[400px] w-full lg:h-full border  border-yellow-500 rounded-lg overflow-auto bg-[#1E212A] hover:shadow-[0_0_15px_0px_rgba(252,_211,_77,_0.3)] 
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-white
            [&::-webkit-scrollbar-thumb]:rounded-full">
            <OnlineFriends />
        </div>
        <div className="h-[400px] w-full lg:h-full border  border-yellow-500 rounded-lg overflow-auto  bg-[#1E212A] hover:shadow-[0_0_15px_0px_rgba(252,_211,_77,_0.3)]
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-white
            [&::-webkit-scrollbar-thumb]:rounded-full">
          <UserMatches />
        </div>
      </div>
        
      <div className="grid-cols-1 lg:col-span-6 lg:row-span-1">
        <Achivements/>
      </div>
    </div>    
  );
};