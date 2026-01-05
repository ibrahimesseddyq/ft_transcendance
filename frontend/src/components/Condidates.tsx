import { BadgeCheck, History, ChartNoAxesCombined, Plus, ChevronDown , MapPin, BadgeDollarSign, CalendarDays  } from 'lucide-react';
import { useState } from 'react';

interface Student {
  id: number;
  name: string;
  category: string;
  lucation: string;
  type: string;
  accepted: string;
  time: string;
}

const RH_data = {name:'', lucation:'', };

function Studentcard(object:Student) {
  return (
      <div className='flex flex-col  rounded-md bg-[#09122C] p-2'>
        <div className='flex gap-2'>
          <div className="flex justify-center items-center">
                  <img 
                    src="../src/assets/icons/profile.png" 
                    alt="student logo" 
                    className="h-10 w-10 rounded-full object-cover" 
                  />
                </div>
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
          <button className='text-white font-medium text-xs hover:underline'>See Profile</button>
        </div>
      </div>
  );
}
export function Condidates(){
  const Student = {
  name: 'Abdellatif EL Fagrouch',
  category: 'Devops Developer',
  lucation: 'Morocco, Khouribga',
  type: 'Full-time',
  accepted: 'yes',
  time: ', oct 16, 2025'
};
  const [tags, setTags] = useState([
    {id:1, icon:BadgeCheck, name:'Open'},
    {id:2, icon:History, name:'Full-time'},
    {id:3, icon:ChartNoAxesCombined, name:'Senior'}
  ]);
  const [panding, setPanding] = useState<Student[]>(
  Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    ...Student
  }))
  );
  const [reviewed, setReviewed] = useState<Student[]>(
  Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    ...Student
  }))
  );
  const [testTask, setTestTask] = useState<Student[]>(
  Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    ...Student
  }))
  );
  const [iterview, setIterview] = useState<Student[]>(
  Array.from({ length: 2 }, (_, i) => ({
    id: i + 1,
    ...Student
  }))
  );
  const [hired, setHired] = useState<Student[]>(
  Array.from({ length: 1 }, (_, i) => ({
    id: i + 1,
    ...Student
  }))
  );
  const handleAddTags = () => {
    const newTags = prompt("Enter new Tags:");
    if (newTags && newTags.trim()) {
      setTags([...tags, {id: Date.now(), icon:BadgeCheck, name: newTags.trim()}]);
    }
  };

  const handleDeleteTag = (id:Number) => {
    setTags(tags.filter(tags => tags.id !== id));
  };
  

  const Panding = ()=>{
    return(
      <div className='h-full w-full flex flex-col scrollbar-hide overflow-auto'>
        <p className='py-4 text-white font-bold text-center'>
              Pending (3)
        </p>
        <div className='flex-1 flex flex-col gap-4 overflow-y-auto p-2 scrollbar-hide
            [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-green-500
              [&::-webkit-scrollbar-thumb]:h-5
              [&::-webkit-scrollbar-thumb]:rounded-full'>
             {panding.map((item) => (
              <div key={item.id} className="w-full flex justify-center">
                <Studentcard {...item} />
              </div>
            ))}
        </div>
      </div>
    );
  }
  const Reviewed = ()=>{
    return(
      <div className='h-full w-full flex flex-col scrollbar-hide overflow-auto'>
        <p className='py-4 text-white font-bold text-center'>
              Reviewed <span>({reviewed.length})</span>
        </p>
        <div className='flex-1 flex flex-col gap-4 overflow-y-auto p-2 scrollbar-hide
            [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-green-500
              [&::-webkit-scrollbar-thumb]:h-5
              [&::-webkit-scrollbar-thumb]:rounded-full'>
             {reviewed.map((item) => (
              <div key={item.id} className="w-full flex justify-center">
                <Studentcard {...item} />
              </div>
            ))}
        </div>
      </div>
    );
  }
  const TestTask  = ()=>{
    return(
      <div className='h-full w-full flex flex-col scrollbar-hide overflow-auto'>
        <p className='py-4 text-white font-bold text-center'>
              Test Task <span>({testTask.length})</span>
        </p>
        <div className='flex-1 flex flex-col gap-4 overflow-y-auto p-2 scrollbar-hide
            [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-green-500
              [&::-webkit-scrollbar-thumb]:h-5
              [&::-webkit-scrollbar-thumb]:rounded-full'>
             {testTask.map((item) => (
              <div key={item.id} className="w-full flex justify-center">
                <Studentcard {...item} />
              </div>
            ))}
        </div>
      </div>
    );
  }
  const Iterview = ()=>{
    return(
      <div className='h-full w-full flex flex-col scrollbar-hide overflow-auto'>
        <p className='py-4 text-white font-bold text-center'>
              Iterview <span>({iterview.length})</span>
        </p>
        <div className='flex-1 flex flex-col gap-4 overflow-y-auto p-2 scrollbar-hide
            [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-green-500
              [&::-webkit-scrollbar-thumb]:h-5
              [&::-webkit-scrollbar-thumb]:rounded-full'>
             {iterview.map((item) => (
              <div key={item.id} className="w-full flex justify-center">
                <Studentcard {...item} />
              </div>
            ))}
        </div>
      </div>
    );
  }
  const Hired = ()=>{
    return(
      <div className='h-full w-full flex flex-col scrollbar-hide overflow-auto'>
        <p className='py-4 text-white font-bold text-center'>
              Hired <span>({hired.length})</span>
        </p>
        <div className='flex-1 flex flex-col gap-4 overflow-y-auto p-2 scrollbar-hide
            [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-green-500
              [&::-webkit-scrollbar-thumb]:h-5
              [&::-webkit-scrollbar-thumb]:rounded-full'>

            {hired.map((item) => (
              <div key={item.id} className="w-full flex justify-center">
                <Studentcard {...item} />
              </div>
            ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-4 gap-2 w-full h-full  border border-[#5F88B8] rounded-md ">
      <div className='flex flex-col justify-between col-span-2 row-span-1 px-5 '>
        <div className='flex items-center my-auto'>
          <div className='flex gap-2'>
                <div className="flex justify-center items-center">
                  <img 
                    src="../src/assets/icons/profile.png" 
                    alt="rh logo" 
                    className="h-20 w-20 rounded-full object-cover" 
                  />
                </div>
                <div className='flex flex-col'>
                  <div className='flex'>
                    <h1 className='text-xl text-white font-bold '>RH Offer</h1>
                    <ChevronDown  className='h-8 w-8 text-white'/>
                  </div>
                  <div className='flex gap-1'>
                    <MapPin className='h-5 w-5 text-white'/>
                    <h1 className='text-sm text-white font-light '>Morocco, Khouribga</h1>
                  </div>
                  <div className='flex gap-1'>
                    <BadgeDollarSign className='h-5 w-5 text-white'/>
                    <h1 className='text-sm text-white font-light '>10 000, 15 000</h1>
                  </div>
                  <div className='flex gap-1'>
                    <CalendarDays className='h-5 w-5 text-white'/>
                    <h1 className='text-sm text-white font-light '>Posted, oct 16, 2025</h1>
                  </div>
                </div>
          </div>
          <div className='flex gap-10 mx-auto'>
            <div className='h-20 w-28 bg-green-900 border border-[#5F88B8] rounded items-center'>
              <div className='flex flex-col gap-1 mx-auto my-auto'>
                <p className='text-center text-sm text-white font-light '>Total condidates</p>
                <p className='text-center text-5xl font-bold text-black [text-stroke:1px_white] [-webkit-text-stroke:1px_white]'>20</p>
              </div>
            </div>
            <div className='h-20 w-28 border border-[#5F88B8] rounded items-center'>
              <div className='flex flex-col gap-1 mx-auto my-auto'>
                <p className='text-center text-sm text-white font-light '>In pipeline</p>
                <p className="text-center text-5xl font-bold text-black [text-stroke:1px_white] [-webkit-text-stroke:1px_white]" 
                    >30</p>
              </div>
            </div>
            <div className='h-20 w-28 border border-[#5F88B8] rounded items-center'>
              <div className='flex flex-col gap-1 mx-auto my-auto'>
                <p className='text-center text-sm text-white font-light '>Hired</p>
                <p className='text-center text-5xl font-bold text-black [text-stroke:1px_white] [-webkit-text-stroke:1px_white]'>5</p>
              </div>
            </div>
            <div className='h-20 w-28 border border-[#5F88B8] rounded items-center'>
              <div className='flex flex-col gap-1 mx-auto my-auto'>
                <p className='text-center text-sm text-white font-light '>Rejected</p>
                <p className='text-center text-5xl font-bold text-black [text-stroke:1px_white] [-webkit-text-stroke:1px_white] '>3</p>
              </div>
            </div>
          </div>          
        </div>
        <div className='flex gap-2 items-center'>
            {tags.map((item)=>{
            return (
              <div key={item.id} className='flex h-10 w-24 border border-[#5F88B8] rounded items-center overflow-hidden'>
                <div className='flex gap-1 mx-auto'>
                  <item.icon className='w-6 h-6 text-white'/>
                  <p className='text-center text-white font-normal '>{item.name}</p>
                </div>
              </div>
            )})}
            <div className='flex h-10 w-24 items-center'>
              <button onClick={handleAddTags} className="group flex items-center gap-1 mx-auto text-white hover:text-green-500 transition-colors">
                <Plus className="w-6 h-6 stroke-current" />
                <p className="font-normal">Add tags</p>
              </button>
            </div>
        </div>
      </div>
      <div className='col-span-2 row-span-3 border border-[#5F88B8] rounded-md overflow-hidden mx-5'>
        <div className='w-full h-full grid grid-cols-5 divide-x divide-[#5F88B8]'>
          <Panding/>
          <Reviewed/>
          <TestTask/>
          <Iterview/>
          <Hired/>
        </div>
      </div>
    </div>    
  );
}