
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
        <div className="h-full w-full border maincard overflow-auto custom-scrollbar ">
            <div className="flex items-center justify-between 
                p-5 pl-5 sticky top-0 z-10 bg-[#131D34]">
                <h3 className="header-title">Recent Activity</h3>
            </div>

            <div className="space-y-2 p-4 overflow-hidden">
                    {users.map((item) => {
                        return (
                            <div 
                                key={item.id}
                                className="flex items-center  childcard
                                p-2 justify-between pt-3 duration-200 ">
                                <div className="flex gap-4 items-center w-full h-full scale-95 ">
                                    <div className="relative">
                                        <div className="h-12 w-12 rounded-full bg-cover bg-center"
                                          style={{ backgroundImage: "url('../src/assets/icons/profile.png')" }}/>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-white font-bold">{item.firstName} {item.lastName} 
                                          <span className="flex text-gray-300 font-normal "> Was&nbsp;&nbsp; 
                                            <span className={`text-sm text-black font-semibold h-6 px-3 rounded-md place-content-center ${
                                                item.status === "Accepted" ? "bg-green-500" : "bg-red-500"
                                            }`}>
                                                {item.status}
                                            </span>
                                            &nbsp;&nbsp;From
                                            <span className="flex text-sm font-light text-white">
                                                &nbsp;{item.Offer}
                                            </span>
                                          </span> 
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

