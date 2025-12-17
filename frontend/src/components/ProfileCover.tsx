import { Bitcoin } from "lucide-react";

export function   ProfileCover(){
    return (    
        <div className="cover h-80 items-center lg:h-full w-full border border-yellow-500 divide-y-2 
          divide-yellow-500  rounded-2xl bg-[#1E212A] hover:shadow-[0_0_15px_0px_rgba(252,_211,_77,_0.3)]">
                <div className="w-full h-[75%] items-center place-content-center flex flex-col  gap-5 lg:gap-32 lg:p-5 lg:flex-row  bg-[url('../src/assets/icons/cover2.png')] bg-no-repeat bg-center bg-cover rounded-t-2xl overflow-hidden">
                  {/* Left Section */}
                  <div className="flex  items-center gap-4 lg:ml-32">
                    <div
                      className="h-14 w-14 lg:h-32 lg:w-32 rounded-xl lg:rounded-3xl bg-no-repeat bg-center bg-cover  shadow-md"
                      style={{ backgroundImage: "url('../src/assets/icons/primage.png')" }}
                    />
                    <div className="items-center">
                      <span className="text-white lg:text-lg font-electrolize font-bold tracking-wide">USERNAME</span>
                      <div className="flex items-center space-x-2">
                        <Bitcoin className="h-5 w-5 text-yellow-600" />
                        <span className="text-[#FFCE22]">2,300,11</span>
                      </div> 
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="text-right items-center justify-center">
                    <div className="flex items-center justify-between">
                      <h2 className="text-white text-xs lg:text-sm font-medium">Level 18</h2>
                      <span className="text-white text-xs lg:text-sm justify-end">90/100</span>
                    </div>
                    <div className="w-64 lg:w-96 bg-black rounded-full h-3  overflow-hidden border border-yellow-500">
                      <div className="bg-yellow-500 h-3 rounded-full w-[90%]"></div>
                    </div> 
                    <div className="flex  justify-between  space-x-1 text-xs text-gray-300">
                      <span className="text-xs lg:text-sm text-white">Next level:</span>
                      <span className="font-semibold text-xs lg:text-sm text-white">Level 19</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between  overflow-hidden h-[25%] w-full">
                    <div className="flex  ml-2 lg:ml-20  2lg:ml-20 justify-between ">
                        <div className="flex flex-col gap-1 pr-3 lg:pr-10 ">
                            <span className="text-gray-500 text-xs lg:text-md  lg:text-xl font-normal">Total&nbsp;games</span>
                            <span className="text-white text-xs lg:text-md lg:text-xl font-normal">1000</span>
                        </div>
                        <div className="flex flex-col  gap-1 pl-3 pr-3 lg:pl-10 lg:pr-10">
                            <span className="text-gray-500 text-xs lg:text-md lg:text-xl font-normal">Win</span>
                            <span className="text-white text-xs lg:text-md lg:text-xl font-normal">10%</span>
                        </div>
                        <div className="flex flex-col  gap-1 pl-3 lg:pl-10">
                            <span className="text-gray-500 text-xs lg:text-md lg:text-xl font-normal">Lose</span>
                            <span className="text-white text-xs lg:text-md lg:text-xl font-normal">90%</span>
                        </div>
                    </div>
                    <div className="justify-end flex  w-full mr-2 lg:mr-20 ">
                         <div className="flex flex-col  gap-1 pr-3 lg:pr-10">
                            <span className="text-gray-500 text-xs lg:text-md lg:text-xl font-normal">Followers</span>
                            <span className="text-white text-xs lg:text-md lg:text-xl font-normal">10k</span>
                        </div>
                        <div className="flex flex-col  gap-1  pl-3 lg:pl-10">
                            <span className="text-gray-500 text-xs lg:text-md lg:text-xl font-normal">Following</span>
                            <span className="text-white text-xs lg:text-md lg:text-xl font-normal">1k</span>
                        </div>
                    </div>
                </div>
        </div>
    );
}