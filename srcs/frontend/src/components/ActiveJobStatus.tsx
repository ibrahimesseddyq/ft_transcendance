import { useState} from "react";

export function ActiveJobStatus() {
    const [users] = useState([
        {id:1, firstName:'abdellatif', lastName:'Elfagrouch', profil:'Back-end', status:'Online'},
        {id:2, firstName:'abdellatif', lastName:'Elfagrouch', profil:'Front-end', status:'Offline'},
        {id:3, firstName:'abdellatif', lastName:'Elfagrouch', profil:'Front-end', status:'Online'},
        {id:4, firstName:'abdellatif', lastName:'Elfagrouch', profil:'Front-end', status:'Online'},
        {id:5, firstName:'abdellatif', lastName:'Elfagrouch', profil:'Front-end', status:'Online'},]);


    return (
      <div className="flex flex-col w-full h-full overflow-hidden">
        <header className="flex items-center justify-between h-full w-full max-h-16 sticky top-0 z-20 border-b border-gray-50 dark:border-slate-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white ml-5 m-3">
            Active Job Status
          </h3>
        </header>

        <div className="flex flex-col gap-2 p-3 overflow-auto custom-scrollbar">
          {users.map((item) => {
            return (
              <div 
                key={item.id}
                className="flex items-center border border-gray-100 dark:border-slate-800 rounded-xl
                  p-3 justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all"
              >
                <div className="flex gap-3 items-center">
                  <div className="relative">
                    <div 
                      className="h-11 w-11 rounded-full bg-slate-100 dark:bg-slate-800 bg-cover bg-center border-2 border-white dark:border-slate-900 shadow-sm"
                      style={{ backgroundImage: "url('../src/assets/icons/profile.png')" }}
                    />
                    <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 xl:hidden ${
                      item.status === "Online" ? "bg-green-400" : "bg-gray-500"
                    }`} />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs xl:text-sm text-black dark:text-white font-bold">
                      {item.firstName} {item.lastName}
                    </span>
                    <span className="text-[11px] xl:text-xs font-medium text-gray-500 dark:text-gray-400">
                      {item.profil} Developer
                    </span>
                  </div>
                </div>

                <div className="flex gap-1.5 items-center">
                  <div className={`h-2 w-2 rounded-full hidden xl:block ${
                    item.status === "Online" ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" : "bg-gray-400"
                  }`} />
                  <h3 className={`text-xs xl:text-sm font-bold tracking-tight ${
                    item.status === "Online" ? "text-green-500 dark:text-green-400" : "text-gray-500"
                  }`}>
                    {item.status.toUpperCase()}
                  </h3> 
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
}
