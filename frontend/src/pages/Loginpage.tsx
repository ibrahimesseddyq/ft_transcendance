
import { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff } from "lucide-react";
// import eye from "@/assets/icons/eye.svg"
// import eyeOff from "@/assets/icons/eyeOff.svg"
// import { validate as validateEmail } from 'email-validator';



export function LoginPage(){
    const [activeAuth, setActiveAuth] = useState('signin');
    const getTabClasses = (tabName: String) => {
        const baseClasses = "h-[90%] w-[50%] rounded-full flex items-center justify-center transition-colors duration-300";
        return activeAuth === tabName 
            ? `${baseClasses} bg-[#44BC19] m-1` 
            : `${baseClasses} bg-transparent m-1`; 
    };
    
    const getTextColor = (tabName: String) => {
        const baseClasses = "`text-sm font-bold"
        return activeAuth === tabName
            ? `${baseClasses} text-white` 
            : `${baseClasses} text-[#A8A2A2]`; 
    };


//     const handleSignIn = async (e:any) => {
//     e.preventDefault(); 
//     const formData = new FormData(e.currentTarget);
//     const email = formData.get('email');
//     const password = formData.get('password');
//     console.log("email : " + email);
//     console.log("password : " + password);
//     alert("hello");

//     try {
//         const response = await fetch('http://localhost:3000/signin', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, password }),
//         });

//         const data = await response.json();
//         console.log("Response from server:", data);
//     } catch (error) {
//         console.error("Network error:", error);
//     }
// };

    const Signin = () => {
        const [type, setType] = useState('password');
        const [Icon, setIcon] = useState<any>(Eye);

        const handleToggle = ()=>{
            if (type === 'password'){
                setType('text');
                setIcon(Eye);
            }
            else{
                setType('password');
                setIcon(EyeOff);
            }
        }
        return(

            <div className="p-1 flex flex-col w-full h-full gap-2 items-center my-4">
                <div className="w-full ml-4">
                    <h2 className="text-[#FFCE22] font-electrolize text-sm ">Welcome Back!</h2>
                    <h1 className="text-md font-electrolize text-white">
                        We are happy to see you again. 
                    </h1>
                </div>
                <div className='flex mt-3 h-[60px] w-[90%] border border-[#405673] rounded-full bg-transparent items-center justify-between'>
                        <button 
                            onClick={() => {setActiveAuth('signin'); }}
                            className={getTabClasses('signin')}
                            >
                            <h1 className={getTextColor('signin')}>Sign In</h1>
                        </button>
                        <button 
                            onClick={() => {setActiveAuth('signup'); }}
                            className={getTabClasses('signup')}
                        >
                            <h1 className={getTextColor('signup')}>Sign Up</h1>
                        </button>
                </div>
                <div className="flex flex-col gap-2 h-full w-[90%] place-content-center">
                    <form action="http://localhost:3000/signin" method="POST">
                        <div className="flex justify-between items-center h-[50px] w-full mt-5 border border-[#405673]  rounded-full">
                            <input
                                placeholder="Enter your email"
                                type='email'
                                name='email'
                                
                                className="w-full h-full text-white outline-none placeholder-white pl-5 bg-transparent"
                                />
                            <Mail className="h-10 w-14 pr-5 text-white" />
                        </div>
                        <div className="flex justify-between items-center h-[50px] w-full mt-3  border border-[#405673]  rounded-full">
                            <input
                                placeholder="Enter your Password"
                                type={type}
                                name='password'
                                className="w-full h-full text-white outline-none placeholder-white pl-5 bg-transparent"
                                />
                            <Icon onClick={handleToggle} className='cursor-pointer h-10 w-14 pr-5 text-white'/>
                        </div>
                        <a href='#' className='pl-[70%]  text-[#44BC19] text-sm font-semibold hover:underline hover:cursor-pointer w-28 '>Forgot Password?</a>
                        <button type="submit"
                            className="text-white font-bold w-full mx-auto h-[50px] mt-5  rounded-full bg-[#44BC19]">
                            Log in
                        </button>
                    </form>
                    <a  href="http://localhost:3000/auth/google" 
                            className="h-[50px]  flex gap-5  rounded-full w-full mt-5 mx-auto border border-[#405673] bg-transparent text-white hover:text-black hover:bg-white items-center">
                        <img    className="h-8 w-8 ml-10" 
                                src="src/assets/icons/google1.png"
                                alt="Google icon"/>
                        <h1>Log in with Google </h1>
                    </a>
                </div>
            </div>
        );
    }
    const Signup = () => {
        const [selectValue, setSelectValue] = useState('');
        const [activeGender, setActiveGender] = useState('Male');
        const [formData, setformData] = useState({
            FirstName: '',
            LastName:'',
            Type: '',
            Number:'',
            Gender:'',
            email:'',
            password: ''
        });
        const handleChange = (e:any) => {
          const { name, value } = e.target;
                
          setformData((prevData) => ({
            ...prevData, 
            [name]: value
          }));
        };

        const handleSelectChange = (event:any) => {
            setSelectValue(event.target.value);
        };
        const getGender = (tabName: String) => {
            const baseClasses = "h-[90%] w-[50%] rounded-full flex items-center justify-center";
            return activeGender === tabName 
                ? `${baseClasses} bg-[#405673] m-1` 
                : `${baseClasses} bg-transparent m-1`; 
        };
    
        const getGenderTextColor = (tabName: String) => {
            return activeAuth === tabName ? 'text-white' : 'text-[#A8A2A2]';
        };
        return(
            <div className="p-1 flex flex-col w-full h-full gap-1 items-center my-4">
                <div className="w-full ml-4">
                    <h2 className="text-[#FFCE22] font-electrolize text-sm ">Welcome!</h2>
                    <h1 className="text-md font-electrolize text-white">
                        We are happy to have you. 
                    </h1>
                </div>
                <div className='flex mt-3 h-[60px] w-[90%] border border-[#405673] rounded-full bg-transparent items-center justify-between'>
                        <button type="button"
                            onClick={() => {setActiveAuth('signin');}}
                            className={getTabClasses('signin')}
                            >
                            <h1 className={`text-sm font-bold ${getTextColor('signin')}`}>Sign In</h1>
                        </button>
                        <button type="button"
                            onClick={() => {setActiveAuth('signup');}}
                            className={getTabClasses('signup')}
                        >
                            <h1 className={`text-sm font-bold ${getTextColor('signup')}`}>Sign Up</h1>
                        </button>
                </div>
                <div className="flex flex-col h-full w-[90%] items-center gap-2 place-content-center ">
                    <form action="#" method="POST" className='flex flex-col gap-2 w-full'>
                        <div className='flex gap-4 h-[50px] w-full '>
                            <input
                                placeholder="First Name"
                                type='text'
                                name='FirstName'
                                value={formData.FirstName}
                                onChange={handleChange}
                                className=" w-full lg:w-[60%] text-sm text-white outline-none placeholder-white mx-auto pl-3 border  border-[#405673] rounded-full  bg-transparent"
                                required/>
                            <input
                                placeholder="Last Name"
                                type='text'
                                name='LastName'
                                value={formData.LastName}
                                onChange={handleChange}
                                className=" w-full lg:w-[60%] text-sm text-white outline-none placeholder-white mx-auto pl-3 border border-[#405673] rounded-full  bg-transparent"
                                required/>
                        </div>
                        <div className='flex gap-4 h-[50px] w-full'>
                            <select value={selectValue} onChange={handleSelectChange}  name="User" id="User"
                                className=" w-full lg:w-[60%] text-sm text-white outline-none 
                                placeholder-white mx-auto pl-3 border  border-[#405673] rounded-full  bg-transparent">
                                    <option value="organization" className='text-black'>organization</option>
                                    <option value="Developer" className='text-black'>Developer</option>
                            </select>
                            <input
                                placeholder="Number"
                                type='tel'
                                name='Number'
                                value={formData.Number}
                                onChange={handleChange}
                                className="w-full lg:w-[60%] text-sm text-white outline-none placeholder-white mx-auto pl-3 border border-[#405673] rounded-full  bg-transparent"
                                required/>
                        </div>
                        <div className='flex h-[50px] w-full border border-[#405673] rounded-full bg-transparent items-center justify-between'>
                            <div 
                                onClick={() => {setActiveGender('Male');}}
                                className={getGender('Male')}
                                >
                                <h1 className={`cursor-pointer text-sm font-bold ${getGenderTextColor('Male')}`}>Male</h1>
                            </div>
                            <div 
                                onClick={() => {setActiveGender('Female');  }}
                                className={getGender('Female')}
                            >
                                <h1 className={`cursor-pointer text-sm font-bold ${getGenderTextColor('Female')}`}>Female</h1>
                            </div>
                        </div>
                        <input
                            placeholder="Enter Your Email"
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className="h-[50px] w-full text-sm text-white outline-none placeholder-white mx-auto pl-3 border border-[#405673] rounded-full  bg-transparent"
                            required/>
                        <input
                            placeholder="Enter Your Password"
                            type='password'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            className="h-[50px] w-full text-sm text-white outline-none placeholder-white mx-auto pl-3 border  border-[#405673] rounded-full  bg-transparent"
                            required/>
                        <button  type="submit"
                                className="text-white font-bold w-full mx-auto h-[50px] rounded-full bg-[#44BC19]">
                            Log in
                        </button>
                    </form>
                    <a href='http://localhost:3000/auth/google'
                            className="h-[50px] flex gap-5 rounded-full w-full mx-auto border border-[#405673] bg-transparent text-white hover:text-black hover:bg-white items-center">
                        <img    className="h-8 w-8 ml-10" 
                                src="src/assets/icons/google1.png"
                                alt="Google icon"/>
                        <h1>Log in with Google </h1>
                    </a>
                </div>
            </div>
        );
        
    }

    return(
        <div className={`h-[600px] w-full sm:p-5 sm:w-[500px] p-0 border border-[#5F88B8]  rounded bg-[#09122C] mx-auto flex items-center justify-center overflow-hidden`}>
            <div className="flex-grow  h-full w-full">
                {activeAuth === 'signin' ? <Signin /> : <Signup />}
            </div>
        </div>
    );
}