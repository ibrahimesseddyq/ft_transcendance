import React, { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface Student {
  name: string;
  category: string;
  lucation: string;
  type: string;
  accepted: string;
  time: string;
  id: number;
}

const Etudients: Student[] = [
  {id:1, name:'Abdellatif EL Fagrouch', category:'Devops Developer', lucation:'Morocco, Khouribga', type:'Full-time', accepted:'yes', time:', oct 16, 2025'},
  {id:2, name:'Abdellatif EL Fagrouch', category:'Devops Developer', lucation:'Morocco, Khouribga', type:'Full-time', accepted:'yes', time:', oct 16, 2025'},
  {id:3, name:'Abdellatif EL Fagrouch', category:'Devops Developer', lucation:'Morocco, Khouribga', type:'Full-time', accepted:'yes', time:', oct 16, 2025'},
  {id:4, name:'Abdellatif EL Fagrouch', category:'Devops Developer', lucation:'Morocco, Khouribga', type:'Full-time', accepted:'yes', time:', oct 16, 2025'}
];
function Studentcard(object:Student) {
  return (
      <div className='flex flex-col w-[80%] h-[120px] rounded-md bg-[#09122C]'>
        <div className='flex gap-2'>
          <img
            src="../src/assets/icons/profile.png"
            alt="student logo"
            className="h-10 w-10 rounded-full bg-cover bg-center"
          />
          <div className='flex flex-col items-center'>
            <h1 className='text-white font-light text-sm'>{object.name}</h1>
            <p className='text-gray-400 font-light text-sm'>{object.category}</p>
          </div>
        </div>
        <p className='text-white font-light text-sm'>{object.lucation}</p>
        <p className='text-white font-light text-sm'>{object.type}</p>
        <div className='flex justify-between'>
          <p className={object.accepted === 'yes' ? 'text-green-500' : 'text-red-500'}>
            {object.accepted === 'yes' ? 'accepted' : 'rejected'}
          </p>
          <p className='text-white font-light text-xs'>{object.time}</p>
          <button className='text-white font-medium text-xs'>See Profile</button>
        </div>
      </div>
  );
}
export function Condidates(){
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-4 gap-2 w-full h-full  border border-[#5F88B8] rounded-md ">
      <div className='col-span-2 row-span-1 px-5'>
        <div className='flex flex-col gap-2 h-full w-[50%] justify-between px-10 py-3'>
          <div className='flex gap-2'>
              <img
                src="../src/assets/icons/profile.png"
                alt="rh logo"
                className="h-20 w-20 rounded-full bg-cover bg-center"
                />
                <div className='flex flex-col'></div>
          </div>
          <div className='flex gap-5 '>
            <div className='h-6 w-20 border border-[#5F88B8] rounded'></div>
            <div className='h-6 w-20 border border-[#5F88B8] rounded'></div>
            <div className='h-6 w-20 border border-[#5F88B8] rounded'></div>
            <div className='h-6 w-20 border border-[#5F88B8] rounded'></div>
          </div>          
        </div>
        <div className='flex gap-2 h-full w-[50%]'>

        </div>
      </div>
      <div className='col-span-2 row-span-3 border border-[#5F88B8] rounded-md overflow-hidden'>
        <div className='w-full h-full grid grid-cols-5 divide-x divide-[#5F88B8]'>
          <div className='h-full w-full items-center '>
            <p className='w-full h-[10%] text-white font-bold '>Pending (3)</p>
            {Etudients.map((item) => {
              return (
                <div
                  className="flex flex-col h-[90%] w-full p-2 pt-4 gap-3 items-center overflow-auto"
                >
                  <Studentcard key={item.id} {...item} />
                </div>
              );
            })}
          </div>
          <div className='h-full w-full'></div>
          <div className='h-full w-full'></div>
          <div className='h-full w-full'></div>
          <div className='h-full w-full'></div>
        </div>
      </div>
    </div>    
  );
}