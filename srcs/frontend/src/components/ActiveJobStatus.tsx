
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { MessageSquareText } from 'lucide-react';

export function ActiveJobStatus() {
    const [users, setUsers] = useState([
        {id:1, firstName:'abdellatif', lastName:'Elfagrouch', profil:'Back-end', status:'Online'},
        {id:2, firstName:'abdellatif', lastName:'Elfagrouch', profil:'Front-end', status:'Offline'},
        {id:3, firstName:'abdellatif', lastName:'Elfagrouch', profil:'Front-end', status:'Online'},
        {id:4, firstName:'abdellatif', lastName:'Elfagrouch', profil:'Front-end', status:'Online'},
        {id:5, firstName:'abdellatif', lastName:'Elfagrouch', profil:'Front-end', status:'Online'},]);


    return (
        <div className="flex flex-col h-full w-full border  maincard overflow-hidden">
            <header className="flex items-center justify-between
                h-full w-full max-h-16 sticky top-0 z-20">
                <h3 className="header-title ml-5 m-3">Active Job Status</h3>
            </header>

            <div className="flex flex-col gap-2 
                p-3 overflow-auto custom-scrollbar">
                    {users.map((item) => {

                        return (
                            <div 
                                key={item.id}
                                className="flex items-center childcard
                                p-2 justify-between pt-3 duration-200
                                hover:scale-[1.02]"
                            >
                                <div className=" flex gap-3 items-center">
                                    <div className="">
                                        <div className="h-12 w-12 rounded-full bg-cover bg-center"
                                          style={{ backgroundImage: "url('../src/assets/icons/profile.png')" }}/>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs xl:text-sm text-white font-bold">{item.firstName} {item.lastName}</span>
                                        <span className="text-xs xl:text-sm font-light text-gray-100">
                                            {item.profil} Developer
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-1 items-center">
                                  <div className={`h-3 w-3 rounded-full hidden xl:block ${
                                            item.status === "Online" ? "bg-green-400" : "bg-gray-500"
                                    }`} />
                                  <h3 className={`text-sm font-semibold ${
                                      item.status === "Online" ? "text-green-400" : "text-gray-500"
                                  }`}>{item.status}</h3> 
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
