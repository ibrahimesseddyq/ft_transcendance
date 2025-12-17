import {Link } from 'react-router-dom';

export function HeroSection() {
  return (

      <div className="h-full w-full flex items-center">
          <div className="flex flex-col gap-10">
            <div className="left-1 ml-8 mt-auto">
              <p className="text-2xl  md:text-3xl xl:text-4xl 2xl:text-6xl text-foreground font-electrolize text-white">Play Like a Legend,</p>
              <p className="text-2xl md:text-3xl xl:text-4xl 2xl:text-6xl text-[#bfbcbc] font-electrolize">&nbsp;&nbsp;&nbsp;Visualize Your Victory</p>  
            </div>
            <button className="ml-16 bg-[#FF0000] font-electrolize rounded-sm xl:rounded-lg h-12 w-32  mx-auto">
              <Link
                className=" h-full w-full text-white hover:text-yellow-400 flex items-center justify-center font-bold"
                to={"/games"}>
                Play Now
              </Link>
            </button>
          </div>
      </div>
  );
}