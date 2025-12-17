import {X , Award  } from 'lucide-react';
import { useState, useEffect } from "react";

export function Leaderboard(){
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchUsers = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch('http://localhost:3000/api/users', { signal });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const fetcheddata = await response.json();
                
                // Handle different API response formats
                if (Array.isArray(fetcheddata)) {
                    setUsers(fetcheddata);
                } else if (fetcheddata && Array.isArray(fetcheddata.data)) {
                    setUsers(fetcheddata.data);
                } else if (fetcheddata && Array.isArray(fetcheddata.users)) {
                    setUsers(fetcheddata.users);
                } else {
                    console.error("Unexpected API response format:", fetcheddata);
                    throw new Error("API returned data in unexpected format");
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error("Error fetching users:", err);
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
        return () => {
            controller.abort();
        };
    }, []);
  
    if (loading) {
        return (
            <div className="bg-[#1E212A] text-white p-4 h-24 flex items-center justify-center">
                <p>Loading Leaderboard...</p>
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
                 <div className="flex flex-col gap-2  w-full h-full place-items-center">
                    <header className="z-10 top-0 sticky bg-[#1E212A] w-full">
                        <h5 className="text-center items-center font-electrolize text-xl 2xl:text-2xl font-medium text-transparent w-fit
                             bg-clip-text bg-gradient-to-r from-orange-600 to-[#E2D800] mx-auto">
                            Leaderboard
                        </h5>
                    </header>

                     <div className="flex flex-col w-full h-full">
                        <div className="space-y-2 divide-y-2 divide-yellow-500">
                            {users.map((friend, index) => (
                              <div key={index} className="flex items-center bg-transparent p-2  justify-between">
                                <div className="space-x-3 flex items-center">
                                    <div className="relative hidden md:block">
                                      <span className={`text-2xl text-foreground font-electrolize 
                                          ${friend.User.rank === 1 ? "text-yellow-500" : friend.User.rank === 2 ? "text-gray-400" : friend.User.rank === 3 ? "text-[#ca5e16]" : "text-white"}`}>
                                            #{friend.User.rank}
                                      </span>
                                    </div>
                                  <div
                                    className="h-10 w-10 rounded-full bg-cover bg-center"
                                    style={{ backgroundImage: "url('../src/assets/icons/profile.png')" }}
                                  >
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-sm text-foreground font-electrolize text-white">{friend.User.name}</span>
                                    <span className="text-sm text-foreground font-electrolize text-gray-500">{friend.User.login}</span>
                                  </div>
                                </div>

                                <div className="flex flex-col items-center mr-2">
                                    <div className="flex items-center gap-5">
                                        <a href="#" className="h-2 w-2 text-green-500 hover:text-[#ddd]"><Award /></a>
                                        <h3 className="level text-white ">{friend.User.win} Win</h3>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <a href="#" className="h-2 w-2 text-red-600 hover:text-[#ddd]"><X /></a>
                                        <h3 className="level text-white ">{friend.User.lose} Lose</h3>
                                    </div>
                                </div>
                              </div>
                            ))}
                        </div>
                    </div> 
                </div> 
    );
}