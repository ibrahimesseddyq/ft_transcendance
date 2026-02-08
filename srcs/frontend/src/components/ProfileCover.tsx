import { Link } from 'react-router-dom';
import { ArrowDownFromLine } from 'lucide-react';

interface props{
  profile: any;
  user: any;
}
export function ProfileCover({ profile, user }: props) {
  const fields = [
    { label: 'First Name', value: user?.firstName },
    { label: 'Last Name', value: user?.lastName },
    { label: 'Email', value: user?.email },
    { label: 'Phone Number', value: user?.phone || 'Not provided' },
    { label: 'Position', value: user?.currentTitle || 'Full Stack Developer' }
  ];

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const resumeUrl = `${BACKEND_URL}${profile?.resumeUrl}`;
  const avatarUrl = `${BACKEND_URL}${user?.avatarUrl}`;
  console.log("user : ", user);
  console.log("resume Url = ", resumeUrl);

  return (
    <div className="relative flex flex-col gap-2 p-2  bg-white border rounded-lg items-center">
        <div style={{ backgroundImage: `url("${avatarUrl}")` }}
          className="absolute top-1 left-1/2 -translate-x-1/2 -translate-y-1/2
            h-32 w-32 rounded-full bg-cover bg-center border-2 border-[#161F32] shadow-2xl"
        />
        <h1 className='font-bold text-2xl text-black mt-16'>{user?.firstName}{user?.lastName}</h1>
        <h1 className='text-xl font-light text-black '>{user?.role}</h1>
        <div className='flex flex-wrap gap-4'>
          <h1 className='text-xl font-light text-black '>{user?.email}</h1>
          <h1 className='text-xl font-light text-black border-l-2 border-black rounded-sm pl-4'>{user?.numberPhone}</h1>
        </div>
        <div className='absolute bottom-2 flex gap-4 justify-between w-full px-2'>
          <div className='flex gap-4 h-10'>
            <Link target='_blank' to={resumeUrl} className='flex-1 flex items-center justify-center gap-2 border 
              border-[#00adef] rounded-md text-[#00adef] px-2'>
              <ArrowDownFromLine className='h-5 w-5'/>
              Download cv
            </Link>
            <button className='flex-1 bg-[#00adef] rounded-md text-white px-2'>
              Share Profile
            </button>
          </div>
          <Link to={'/Settings'}
            className='p-2 text-center bg-[#00adef] rounded-md text-white'>
            Edit Profile
          </Link>
        </div>
      {/* <h1 className="pramary-text text-xl flex items-center gap-2">My Information:</h1>
      <div className="flex flex-wrap lg:flex-col gap-3 place-content-center w-full">
        {fields.map((field, index) => (
          <div key={index} className="relative w-full max-w-64">
            <label className="absolute top-2 left-3 text-xs text-gray-400 font-medium">
              {field.label}
            </label>
            <div className="h-14 w-full pt-6 pb-2 pl-3 text-sm text-white border border-[#5F88B8] border-opacity-40 rounded bg-[#09122C] bg-opacity-20">
              {field.value}
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}