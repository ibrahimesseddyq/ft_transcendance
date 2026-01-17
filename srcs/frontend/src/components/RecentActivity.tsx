import { useState, useEffect } from "react";

export function RecentActivity() {
    const [users, setUsers] = useState([
        {id:1, firstName:'abdellatif', lastName:'Elfagrouch', Offer:'Back-end', applicationPhase:'', status:'Rejected'},
        {id:2, firstName:'abdellatif', lastName:'Elfagrouch', Offer:'Front-end', applicationPhase:'',status:'Accepted'},
        {id:3, firstName:'abdellatif', lastName:'Elfagrouch', Offer:'Front-end', applicationPhase:'',status:'Accepted'},
        {id:4, firstName:'abdellatif', lastName:'Elfagrouch', Offer:'Front-end', applicationPhase:'',status:'Rejected'},
        {id:5, firstName:'abdellatif', lastName:'Elfagrouch', Offer:'Front-end', applicationPhase:'',status:'Accepted'},]);
      
    return (
        <div className="flex flex-col h-full w-full border maincard overflow-hidden">
            <header className="flex items-center justify-between
                h-full w-full max-h-16 sticky top-0 z-20">
                <h3 className="header-title ml-5 m-3">Recent Activity</h3>
            </header>

            <div className="flex flex-col gap-2 p-3
                overflow-auto custom-scrollbar">
                    {users.map((item) => {
                        return (
                            <div 
                                key={item.id}
                                className="w-full h-full flex items-center  childcard
                                 justify-between pt-3 duration-200
                                hover:scale-[1.02]">
                                <div className="w-full h-full flex gap-2 items-center scale-95 ">
                                    <div className=" ">
                                        <div className="h-12 w-12 rounded-full bg-cover bg-center"
                                          style={{ backgroundImage: "url('../src/assets/icons/profile.png')" }}/>
                                    </div>
                                    <div className="flex flex-col justify-between">
                                        <span className="text-sm text-white font-bold">{item.firstName} {item.lastName}</span>

                                        <span className="flex flex-wrap text-gray-300 font-normal "> Was&nbsp;&nbsp; 
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

