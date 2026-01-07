
import { Divide, User } from "lucide-react";
import { useState, useEffect } from "react";
import { MessageSquareText } from 'lucide-react';

export function RecentActivity() {
    const [users, setUsers] = useState([
        {id:1, firstName:'abdellatif', lastName:'Elfagrouch', Offer:'Back-end', applicationPhase:'', status:'Rejected'},
        {id:2, firstName:'abdellatif', lastName:'Elfagrouch', Offer:'Front-end', applicationPhase:'',status:'Accepted'},
        {id:3, firstName:'abdellatif', lastName:'Elfagrouch', Offer:'Front-end', applicationPhase:'',status:'Accepted'},
        {id:4, firstName:'abdellatif', lastName:'Elfagrouch', Offer:'Front-end', applicationPhase:'',status:'Rejected'},
        {id:5, firstName:'abdellatif', lastName:'Elfagrouch', Offer:'Front-end', applicationPhase:'',status:'Accepted'},]);
      
    return (
        <div className="bg-transparent h-full w-full">
            <div className="flex items-center justify-between p-2 px-4 sticky top-0 bg-[#21252E] z-10">
                <h3 className="text-xl 2xl:text-2xl font-medium text-white">Recent Activity</h3>
            </div>

            <div className="space-y-2 p-4 overflow-hidden">
                    {users.map((item) => {
                        return (
                            <div 
                                key={item.id}
                                className="flex items-center  bg-transparent
                                p-2 justify-between pt-3 transition-all duration-200"
                            >
                                <div className="space-x-3 flex items-center w-full h-full">
                                    <div className="relative hidden md:flex">
                                        <div className="h-12 w-12 rounded-full bg-cover bg-center"
                                          style={{ backgroundImage: "url('../src/assets/icons/profile.png')" }}/>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-white font-bold">{item.firstName} {item.lastName} 
                                          <span className="text-gray-300 font-normal"> Was&nbsp;&nbsp; 
                                            <span className={`text-sm text-black font-semibold p-[2px] rounded-md ${
                                            item.status === "Accepted" ? "bg-green-500" : "bg-red-500"
                                            }`}>{item.status}</span>
                                            &nbsp;&nbsp;From
                                          </span> 
                                        </span>
                                        <span className="text-sm font-light text-white">
                                            {item.Offer} Developer
                                        </span>
                                        <span className="text-sm font-light text-gray-400">
                                            New posted in 6 days ago
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

