import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { MessageSquareText } from 'lucide-react';

export function OnlineFriends() {
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
                <p>Loading Online Friends...</p>
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
        <div className="bg-[#1E212A]">
            <div className="flex items-center justify-between p-2 px-4 sticky top-0 bg-[#1E212A] z-10">
                <h3 className="text-xl 2xl:text-2xl font-medium text-white font-electrolize">Online Friends</h3>
                <a href='#' className="text-yellow-400 text-xl 2xl:text-2xl font-electrolize hover:text-yellow-300 hover:underline">
                    View all
                </a>
            </div>

            <div className="space-y-2 p-4 overflow-hidden">
                {!Array.isArray(users) || users.length === 0 ? (
                    <div className="text-gray-400 p-2">No friends are currently online.</div>
                ) : (
                    users.map((friend, index) => {
                        const userDetails = friend.User; 
                        const name = userDetails.name;
                        const status = userDetails.status;
                        const login = userDetails.login;

                        return (
                            <div 
                                key={login}
                                className="flex items-center rounded-md border border-yellow-600 bg-gradient-to-r from-[#2A2D3C] via-[#242735] to-[#1E212A] p-2 justify-between pt-3 transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_15px_3px_rgba(252,211,77,0.3)]"
                            >
                                <div className="space-x-3 flex items-center">
                                    <div className="relative hidden md:block">
                                        <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                                            <User className="h-4 w-4 text-white" /> 
                                        </div>
                                        <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#1E212A] ${
                                            status === "online" ? "bg-yellow-400" : "bg-gray-500"
                                        }`} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-white font-electrolize">{name}</span>
                                        <span className={`text-sm font-electrolize ${
                                            status === "online" ? "text-yellow-400" : "text-gray-500"
                                        }`}>
                                            {status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-8 items-center">
                                    <a href="#" className="h-6 w-6 text-white hover:text-yellow-400">
                                        <MessageSquareText />
                                    </a>
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-b from-yellow-600 to-transparent">
                                        <h3 className="text-white font-semibold text-lg">14</h3> 
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}