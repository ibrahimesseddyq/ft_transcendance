import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { MessageSquareText } from 'lucide-react';

export function OnlineFriends() {
    const [users, setUsers] = useState([
        {id:1, firstName:'abdellatif', lastName:'Elfagrouch', profil:'Back-end', status:'Online'},
        {id:2, firstName:'abdellatif', lastName:'Elfagrouch', profil:'Front-end', status:'Online'},
        {id:3, firstName:'abdellatif', lastName:'Elfagrouch', profil:'Front-end', status:'Online'},
        {id:4, firstName:'abdellatif', lastName:'Elfagrouch', profil:'Front-end', status:'Online'},
        {id:5, firstName:'abdellatif', lastName:'Elfagrouch', profil:'Front-end', status:'Online'},]);


    return (
        <div className="bg-[#1E212A]">
            <div className="flex items-center justify-between p-2 px-4 sticky top-0 bg-[#1E212A] z-10">
                <h3 className="text-xl 2xl:text-2xl font-medium text-white font-electrolize">Online Friends</h3>
                <a href='#' className="text-yellow-400 text-xl 2xl:text-2xl font-electrolize hover:text-yellow-300 hover:underline">
                    View all
                </a>
            </div>

            <div className="space-y-2 p-4 overflow-hidden">
                    {users.map((item) => {

                        return (
                            <div 
                                key={item.id}
                                className="flex items-center rounded-md border border-yellow-600 bg-gradient-to-r 
                                from-[#2A2D3C] via-[#242735] to-[#1E212A] p-2 justify-between pt-3 transition-all 
                                duration-200 hover:scale-[1.02] hover:shadow-[0_0_15px_3px_rgba(252,211,77,0.3)]"
                            >
                                <div className="space-x-3 flex items-center">
                                    <div className="relative hidden md:block">
                                        <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                                            <User className="h-4 w-4 text-white" /> 
                                        </div>
                                        <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#1E212A] ${
                                            item.status === "online" ? "bg-yellow-400" : "bg-gray-500"
                                        }`} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-white font-electrolize">{item.firstName}</span>
                                        <span className={`text-sm font-electrolize ${
                                            item.status === "online" ? "text-yellow-400" : "text-gray-500"
                                        }`}>
                                            {item.status}
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
                    })}
            </div>
        </div>
    );
}