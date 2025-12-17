import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { OnlineFriends } from "@/components/OnlineFriends";
import { CreateTournament } from "@/components/CreateTournament";
import { RecentGames } from "@/components/RecentGames";

export function HomePage(){
  return (
        <div className="w-full h-full p-2 grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-3 gap-4">
            {/* Left Column - Main Content */}
            <div className="flex flex-col col-span-1 lg:col-span-2 lg:row-span-3 gap-4">
              <div className="">
                <h2 className="text-[#FFCE22] font-serif text-xl	xl:text-2xl 2xl:text-5xl mb-2">WELCOME</h2>
                <h1 className="text-3xl xl:text-4xl 2xl:text-6xl text-white font-bold">TO YOUR ACCOUNT</h1>
              </div>
              <div className="h-[500px] lg:h-full w-full place-content-center bg-[url('../src/assets/icons/bg-test.jpeg')] bg-no-repeat bg-center bg-cover
                border border-yellow-500 rounded-xl  justify-between overflow-auto bg-[#1E212A] hover:shadow-[0_0_15px_0px_rgba(252,_211,_77,_0.3)]
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:bg-white
                  [&::-webkit-scrollbar-thumb]:rounded-full">
                <HeroSection />   
              </div>
              <div className="h-[500px] lg:h-full w-full items-center
                border border-yellow-500 rounded-xl  justify-between overflow-auto bg-[#1E212A] hover:shadow-[0_0_15px_0px_rgba(252,_211,_77,_0.3)] 
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:bg-white
                  [&::-webkit-scrollbar-thumb]:rounded-full">
                <StatsSection />
              </div>
            </div>
            
            {/* Right Column - Sidebar Content */}
            <div className="flex flex-col col-span-1 lg:row-span-3 gap-4">

              <div className="w-full h-full border  border-yellow-500 rounded-lg overflow-auto
                bg-[#1E212A] hover:shadow-[0_0_15px_0px_rgba(252,_211,_77,_0.3)]
                [&::-webkit-scrollbar]:w-3
                [&::-webkit-scrollbar-track]:bg-[#948a8a]
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-white
                [&::-webkit-scrollbar-thumb]:h-5
                [&::-webkit-scrollbar-thumb]:rounded-full">
                <OnlineFriends />
              </div>
              <CreateTournament /> 
              <div className="w-full h-full border  border-yellow-500 rounded-lg overflow-auto
                bg-[#1E212A] hover:shadow-[0_0_15px_0px_rgba(252,_211,_77,_0.3)]
                [&::-webkit-scrollbar]:w-3
                [&::-webkit-scrollbar-track]:bg-[#948a8a]
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-white
                [&::-webkit-scrollbar-thumb]:h-5
                [&::-webkit-scrollbar-thumb]:rounded-full">
                <RecentGames />
              </div>
            </div>
          </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  );
};
