import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Save } from 'lucide-react';
import ProfessionalInformations from '@/components/ProfitionalInformations';

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    firstName: 'Abdellatif',
    lastName: 'El Fagrouch',
    email: 'elfagrouch3@gmail.com',
    phone: '+212589466009',
    position: 'UX/UI Designer'
  });

  const handleChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-transparent">
      <div className="flex flex-col gap-4 pl-10">
        <h1 className="font-bold text-white text-lg">My Information:</h1>
        <div className="flex flex-col gap-2">
          <div className="relative w-[70%]">
            <label className="absolute top-2 left-3 text-xs text-gray-400">First Name</label>
            <input 
              type='text' 
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              className="h-14 w-full pt-5 pb-2 pl-3 text-sm text-white outline-none bg-transparent border border-[#5F88B8] rounded"
            />
          </div>
          
          <div className="relative w-[70%]">
            <label className="absolute top-2 left-3 text-xs text-gray-400">Last Name</label>
            <input 
              type='text' 
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              className="h-14 w-full pt-5 pb-2 pl-3 text-sm text-white outline-none bg-transparent border border-[#5F88B8] rounded"
            />
          </div>
          <div className="relative w-[70%]">
            <label className="absolute top-2 left-3 text-xs text-gray-400">Email</label>
            <input 
              type='text' 
              name='email'
              value={formData.email}
              onChange={handleChange}
              className="h-14 w-full pt-5 pb-2 pl-3 text-sm text-white outline-none bg-transparent border border-[#5F88B8] rounded"
            />
          </div>
          <div className="relative w-[70%]">
            <label className="absolute top-2 left-3 text-xs text-gray-400">Phone Number</label>
            <input 
              type='text' 
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              className="h-14 w-full pt-5 pb-2 pl-3 text-sm text-white outline-none bg-transparent border border-[#5F88B8] rounded"
            />
          </div>
          <div className="relative w-[70%]">
            <label className="absolute top-2 left-3 text-xs text-gray-400">Position</label>
            <input 
              type='text' 
              name='position'
              value={formData.position}
              onChange={handleChange}
              className="h-14 w-full pt-5 pb-2 pl-3 text-sm text-white outline-none bg-transparent border border-[#5F88B8] rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Profile(){
  const [editIcon, setEditIcon] = useState(true);
  const [skills, setSkills] = useState([
    {id:1, type:'HTML/CSS'},
    {id:2, type:'Figma'},
    {id:3, type:'Adobe XD'},
    {id:4, type:'ProtoTyping'},
    {id:5, type:'Framing'}
  ]);

  const [education, setEducation] = useState([
    {id:1, month:'02', year:'2019', school:'1337', type:'Master', category:'webDev'},
    {id:2, month:'02', year:'2019', school:'1337', type:'Master', category:'webDev'},
    {id:3, month:'02', year:'2019', school:'1337', type:'Master', category:'webDev'},
    {id:4, month:'02', year:'2019', school:'1337', type:'Master', category:'webDev'},
    {id:5, month:'02', year:'2019', school:'1337', type:'Master', category:'webDev'},
  ]);

  const [career, setCareer] = useState([
    {
      id: 1,
      company: "UX Designer, innovate Studio",
      lucation:'Casablanca, MA',
      start:'1 Jan - 2023',
      end:'1 Jan - 2026',
    },
    {
       id: 2,
      company: "UX Designer, innovate Studio",
      lucation:'Casablanca, MA',
      start:'1 Jan - 2023',
      end:'1 Jan - 2026',
    },
    {
      id: 3,
      company: "UX Designer, innovate Studio",
      lucation:'Casablanca, MA',
      start:'1 Jan - 2023',
      end:'1 Jan - 2026',
    }
  ]);

  const [description, setDescription] = useState("I am a UX/UI designer with a strong focus on user-centered design, usability, and visual clarity. I enjoy researching user needs, creating wireframes and prototypes, and designing clean, intuitive interfaces that enhance user experience. My goal is to solve real problems through thoughtful and accessible design");
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const handleAddSkill = () => {
    const newSkill = prompt("Enter new skill:");
    if (newSkill && newSkill.trim()) {
      setSkills([...skills, {id: Date.now(), type: newSkill.trim()}]);
    }
  };

  const handleDeleteSkill = (id:Number) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const handleAddEducation = () => {
    const type = prompt("Enter degree type (e.g., Master, Bachelor):");
    if (!type || !type.trim()) return;
    
    const category = prompt("Enter category (e.g., webDev, CS):");
    if (!category || !category.trim()) return;
    
    const school = prompt("Enter school name:");
    if (!school || !school.trim()) return;
    
    const month = prompt("Enter month (e.g., 02):");
    if (!month || !month.trim()) return;
    
    const year = prompt("Enter year (e.g., 2019):");
    if (!year || !year.trim()) return;

    setEducation([...education, {
      id: Date.now(),
      month: month.trim(),
      year: year.trim(),
      school: school.trim(),
      type: type.trim(),
      category: category.trim()
    }]);
  };

  const handleDeleteEducation = (id:Number) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const handleAddCareer = () => {
    const company = prompt("Enter company name(e.g., 1337, youcode):");
    if (!company || !company.trim()) return;
    
    const lucation = prompt("Enter lucation (e.g., Khouribga, MA):");
    if (!lucation || !lucation.trim()) return;
    
    const start_date = prompt("Enter start date:");
    if (!start_date || !start_date.trim()) return;
    
    const end_date = prompt("Enter end date:");
    if (!end_date || !end_date.trim()) return;
    
    setCareer([...career, {
      id: Date.now(),
      company: company.trim(),
      lucation: lucation.trim(),
      start: start_date.trim(),
      end: end_date.trim()
    }]);
  };

  const handleDeleteCareer = (id:Number) => {
    setCareer(career.filter(career => career.id !== id));
  };

  const handleDescIcon = ()=>{
    if (editIcon === true){
      setEditIcon(false);
    }else{
      setEditIcon(true);
    }
  }
  const handleEditDescription = () => {
    setIsEditingDescription(true);
  };

  const handleSaveDescription = () => {
    setIsEditingDescription(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-3 p-2 gap-4 w-full h-full ">
      <div className="col-span-1 row-span-3">
        <div className='flex flex-col h-full w-full border border-[#5F88B8] rounded justify-between 
              overflow-y-scroll
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-green-500
              [&::-webkit-scrollbar-thumb]:rounded-full'>
          <div className='flex flex-col gap-5 py-5'>
            <div className="h-28 w-28 mx-auto overflow-hidden rounded-full bg-gray-700">
              {/* <img className='h-full w-full bg-cover flex items-center justify-center rounded-full' src='../src/assets/profile.png'></img> */}
              <div className="h-full w-full flex items-center justify-center text-white text-4xl">
                AE
              </div>
            </div>
            <ProfileForm/>
          </div>
          <div className='flex flex-wrap gap-10 mx-auto mb-10 justify-center'>
            <button className='w-[130px] h-[40px] text-white font-semibold bg-[#09122C] hover:bg-green-600 border border-[#5F88B8] rounded'>Save Change</button>
            <button className='w-[130px] h-[40px] text-white border border-[#5F88B8] rounded'>Cancel</button>
          </div>
        </div>
      </div>
      <div className="col-span-2 row-span-1 flex border border-[#5F88B8] rounded h-full w-full">
        <div className='w-full h-full grid grid-cols-1 grid-rows-5 gap-4'>
          <div className='col-span-1 row-span-1 flex justify-between items-center p-2'>
            <h1 className='font-bold text-white text-lg pl-3'>Description:</h1>
            <button 
              onClick={isEditingDescription ? handleSaveDescription : handleEditDescription}
              className='text-white hover:text-green-500 transition-colors pt-5 '
            >
              <button onClick={handleDescIcon}>
                {editIcon ? <Pencil/> : <Save/>}
              </button>
            </button>
          </div>
          <div className='col-span-1 row-span-4 mx-10 overflow-hidden'>
            {isEditingDescription ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='h-full w-full font-medium text-white text-base bg-transparent
                  border border-[#5F88B8] rounded p-4 outline-none resize-none
                  overflow-auto
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-green-400
                  [&::-webkit-scrollbar-thumb]:rounded-full'
              />
            ) : (
              <p className='h-full w-full font-medium text-white  break-words p-4
                  overflow-auto
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-green-400
                  [&::-webkit-scrollbar-thumb]:rounded-full'>
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="col-span-1 lg:col-span-2 lg:row-span-2 flex border border-[#5F88B8] rounded h-full w-full p-4">
        <div className='grid grid-cols-1  lg:grid-cols-5 lg:grid-rows-9 gap-4 rounded h-full w-full'>
            <div className='col-span-1 lg:col-span-5 lg:row-span-1 flex justify-between items-center p-2'>
                    <h1 className='font-bold text-white text-lg'>Professional Informations:</h1>
                    <button 
                      onClick={handleAddCareer}
                      className='text-white hover:text-green-500 transition-colors '
                    >
                      <Plus size={20} />
                    </button>
              </div>
            <div className='col-span-1 lg:col-span-3 lg:row-span-8 gap-2 h-full  w-full'>
                <ProfessionalInformations career={career} del={handleDeleteCareer}/>
            </div>
            <div className='col-span-1 lg:col-span-2 lg:row-span-8 flex flex-col gap-2 h-full w-full'>
              <div className='w-full h-[170px] flex flex-col gap-4 border border-[#5F88B8] rounded'>
                  <div className='flex justify-between items-center p-2'>
                    <h1 className='font-bold text-white text-lg'>Skills:</h1>
                    <button 
                      onClick={handleAddSkill}
                      className='text-white hover:text-green-500 transition-colors '
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className='px-3 flex gap-2 h-full flex-wrap overflow-auto
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:bg-transparent
                      [&::-webkit-scrollbar-thumb]:bg-green-500
                        [&::-webkit-scrollbar-thumb]:rounded-full'>
                      {skills.map((item) => {
                        return (
                          <div
                          key={item.id}
                          className="relative group rounded h-[35px] w-[85px] bg-[#5F88B8] border border-[#5F88B8] flex items-center justify-center overflow-hidden">
                              <p className='text-sm text-white'>{item.type}</p>
                              <button 
                                onClick={() => handleDeleteSkill(item.id)}
                                className='absolute top-1 right-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500'
                              >
                                <Trash2 size={14} />
                              </button>
                          </div>
                        );
                      })}
                  </div>
              </div>
              <div className='w-full h-[170px] flex flex-col gap-4 border border-[#5F88B8] rounded'>
                  <div className='flex justify-between items-center p-2'>
                    <h1 className='font-bold text-white text-lg'>Education:</h1>
                    <button 
                      onClick={handleAddEducation}
                      className='text-white hover:text-green-500 transition-colors'
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className='px-3 flex flex-col h-full overflow-auto
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:bg-transparent
                      [&::-webkit-scrollbar-thumb]:bg-green-500
                        [&::-webkit-scrollbar-thumb]:rounded-full'>
                      {education.map((item) => {
                        return (
                          <div
                          key={item.id}
                          className="relative group rounded h-auto w-full items-center place-content-center  mb-2">
                              <p className='text-white font-light pr-6'>{item.type} in {item.category} from {item.school} school, at {item.month} {item.year}.</p>
                              <button 
                                onClick={() => handleDeleteEducation(item.id)}
                                className='absolute top-0 right-0 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500'
                              >
                                <Trash2 size={16} />
                              </button>
                          </div>
                        );
                      })}
                  </div>
              </div>
            </div>
        </div>
      </div>
    </div>    
  );
}