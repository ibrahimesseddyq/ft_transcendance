
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
        <div className="bg-[#1E212A]">
            <div className="flex items-center justify-between p-2 px-4 sticky top-0 bg-[#1E212A] z-10">
                <h3 className="text-xl 2xl:text-2xl font-medium text-white">Active Job Status</h3>
            </div>

            <div className="space-y-2 p-4 overflow-hidden">
                    {users.map((item) => {

                        return (
                            <div 
                                key={item.id}
                                className="flex items-center rounded-md  bg-[#09122C]
                                p-2 justify-between pt-3 transition-all duration-200
                                hover:scale-[1.02] hover:shadow-[0_0_15px_3px_rgba(0,128,0,0.3)]"
                            >
                                <div className="space-x-3 flex items-center">
                                    <div className="relative hidden md:flex">
                                        <div className="h-12 w-12 rounded-full bg-cover bg-center"
                                          style={{ backgroundImage: "url('../src/assets/icons/profile.png')" }}/>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-white font-bold">{item.firstName} {item.lastName}</span>
                                        <span className="text-sm font-light text-gray-500">
                                            {item.profil} Developer
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-1 items-center">
                                  <div className={`h-3 w-3 rounded-full ${
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
