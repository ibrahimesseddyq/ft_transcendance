import {AllMatches} from "@/lib/data";
import { useState, useEffect } from "react";

const StatusBadge = ({condition} : { condition: string }) => {
    let classes = '';
    if (condition === "VICTORY") {
        classes = 'bg-green-600/20 border-green-400 text-green-400';
    } else if (condition === "DEFEAT") {
        classes = 'bg-red-600/20 border-red-400 text-red-400';
    } else {
        classes = 'bg-yellow-600/20 border-yellow-400 text-yellow-400';
    }

    return (
        <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-sm border ${classes}`}>
            {condition}
        </span>
    );
};


export function RecentGames() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchMatches = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch('http://localhost:3000/api/matches', { signal });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const fetcheddata = await response.json();
                
                // Handle different API response formats
                if (Array.isArray(fetcheddata)) {
                    setMatches(fetcheddata);
                } else if (fetcheddata && Array.isArray(fetcheddata.data)) {
                    setMatches(fetcheddata.data);
                } else if (fetcheddata && Array.isArray(fetcheddata.users)) {
                    setMatches(fetcheddata.users);
                } else {
                    console.error("Unexpected API response format:", fetcheddata);
                    throw new Error("API returned data in unexpected format");
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error("Error fetching matches:", err);
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
        return () => {
            controller.abort();
        };
    }, []);
  
    if (loading) {
        return (
            <div className="bg-[#1E212A] text-white p-4 h-24 flex items-center justify-center">
                <p>Loading Recent Games...</p>
            </div>
        );
    }
  
    if (error) {
      return (
          <div className="bg-[#1E212A] text-red-400 p-4 h-24 flex flex-col items-center justify-center">
              <p>Error: Could not load users. ({error})</p>
              <p className="text-sm mt-2">Please check your server and data format.</p>
          </div>
      );
    }
  return (
    <div className="items-center bg-transparent">
        <div className="p-2 flex font-medium justify-center z-10 top-0 sticky bg-[#1E212A]">
          <header className="top-0 sticky">
            <h5 className="text-center items-center font-electrolize text-xl 2xl:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-400">
              RECENT GAMES
            </h5>
          </header>
        </div>


				<div className="space-y-2 p-4 overflow-hidden"> 
					{matches.map((it, index) => {
            let playerImagePath = it.Match.player.profileImage;
            const fallbackImagePath = "../src/assets/icons/profileimage.png";

            if (playerImagePath === "#") {
                playerImagePath = fallbackImagePath;
            }
          return (
					<div 
            key={index} 
            className="flex items-center rounded-md border border-yellow-600
                bg-gradient-to-r from-[#2A2D3C] via-[#242735] to-[#1E212A] p-2 justify-between pt-3 transition-all
                duration-200 hover:scale-[1.02] hover:shadow-[0_0_15px_3px_rgba(252,_211,_77,_0.3)]">
							<div className="space-x-3 flex items-center ">
								<div className="relative hidden md:block">
									<div className="flex lg:hidden xl:flex h-14 w-14 rounded-full items-center justify-center border-2 border-yellow-500">
										<img
											src={fallbackImagePath}
											alt="Photo"
											className="h-full w-full rounded-full object-cover"
										/> 
									</div>
								</div>

								<div className="flex flex-col gap-1">
									<span className="text-lg text-foreground font-electrolize text-white">{it.Match.player.name}</span>
									<StatusBadge condition={it.Match.result} />
								</div>
							</div>

			
							<div className="items-center flex gap-2">
                <span className="text-sm text-foreground font-electrolize text-yellow-400">{it.Match.gametype}</span>
                <div className="flex flex-col">
								  <span className="text-sm text-foreground font-electrolize text-gray-400">{it.Match.date}</span>
								  <span className="text-sm text-foreground font-electrolize text-gray-400">{it.Match.time}</span>
                </div>
								<div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-b from-yellow-600 to-transparent">
									<h3 className="text-white font-semibold text-lg">{it.Match.player.rank}</h3>
								</div>
							</div>
          </div>);
          })}

        </div> 
      </div>
  );
}