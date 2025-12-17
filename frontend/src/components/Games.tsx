import { FaRobot } from "react-icons/fa";
import {Link } from 'react-router-dom';

export function Games() {
    const LocalGame = () => {
        return (
            <div className=" h-full w-[350px] lg:w-[600px]  
              bg-[url('../src/assets/icons/backheros.png')] bg-no-repeat bg-center bg-cover
                border rounded-md border-yellow-500 items-center hover:shadow-[0_0_15px_0px_rgba(252,_211,_77,_0.3)] bg-[#1c1b1b]">
                    <div className="flex flex-col gap-10 rounded-md h-full w-full p-3
                        bg-black/20 backdrop-sepia-[0.25] items-center place-content-center">
                        <div className="flex flex-col gap-10  items-center place-content-center">
                            <p className="text-[#D9D9D9] text-center text-2xl lg:text-3xl font-electrolize">
                                Press <span className="text-yellow-500">play now</span> to begin the Local Game
                            </p>
                        </div>
                        <button className=" bg-[#FF0000] font-electrolize rounded-sm xl:rounded-lg h-12 w-32  mx-auto">
                            <Link
                              className=" h-full w-full text-white hover:text-yellow-400 flex items-center justify-center font-bold"
                              to={"/gamesettings"}>
                              Play Now
                            </Link>
                        </button>
                    </div>
            </div>
        );
    }

    const RemoteGame = () => {
        return (
            <div className=" h-full w-[350px] lg:w-[600px]  
              bg-[url('../src/assets/icons/deadpool.jpeg')] bg-no-repeat bg-center bg-cover
                border rounded-md border-yellow-500 items-center hover:shadow-[0_0_15px_0px_rgba(252,_211,_77,_0.3)] bg-[#1c1b1b]">
                    <div className="flex flex-col gap-10 rounded-md h-full w-full p-3
                        bg-black/20 backdrop-sepia-[0.25] items-center place-content-center">
                        <div className="flex flex-col gap-10  items-center place-content-center">
                            <p className="text-[#D9D9D9] text-center text-2xl lg:text-3xl font-electrolize">
                                Press <span className="text-yellow-500">play now</span> to begin the Remote game
                            </p>
                        </div>
                        <button className=" bg-[#FF0000] font-electrolize rounded-sm xl:rounded-lg h-12 w-32  mx-auto">
                            <Link
                              className=" h-full w-full text-white hover:text-yellow-400 flex items-center justify-center font-bold"
                              to={"/gamesettings"}>
                              Play Now
                            </Link>
                        </button>
                    </div>
            </div>
        );
    }
  return (
    <div className="grid grid-cols-2 md:grid-rows-6 items-center h-full w-full gap-5 overflow-auto m-auto">
        <div className="col-span-2 row-span-2 gap-2 ">
            <h1 className=" text-3xl xl:text-5xl 2xl:text-6xl text-[#D9D9D9]  text-center">
                Choose Your <span className="bg-gradient-to-t from-[#FFCE22] to-[#E15815] bg-clip-text text-transparent xl:text-4xl 2xl:text-5xl">Opponent</span>
            </h1>
            <p className="text-[#D9D9D9] text-center  text-xl xl:text-4xl 2xl:text-5xl">
                Select your preferred game mode to start playing
            </p>
        </div>

        <div className="flex flex-col md:flex-row col-span-2 row-span-3 gap-10 
            items-center w-full h-full place-items-center place-content-center">
            <LocalGame />
            <RemoteGame />
        </div>
    </div>
    );
}