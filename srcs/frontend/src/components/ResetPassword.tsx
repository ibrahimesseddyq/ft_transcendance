
export function ResetPassword(){

    const Reset = () => {
        return(
            <div className="p-5 flex flex-col w-full h-full gap-10 items-center justify-center  ">
                <img src={"icons/passwordreset.svg"} alt="auth image" 
                    className='h-28 w-28'/>
                <div className='flex flex-col gap-1 items-center '>
                    <h1 className='font-bold text-surface-main text-2xl'>Reset you password</h1>
                    <h1 className='font-light text-surface-main text-lg'>Enter the 6-digit code sent to you email. This code is valid for the next 10 minutes</h1>
                </div>
                <form action="/" method="" className='w-full flex flex-col gap-10'>
                    <div className='Inputs flex justify-between '>
                        <input type="text" maxLength={1} required
                            className='h-20 w-16 text-7xl text-surface-main shadow-lg hover:shadow-[0px_0px_25px_-1px_#44bc19]
                                bg-transparent border border-[#5F88B8]  rounded-lg  text-center outline-none'/>
                        <input type="text" maxLength={1} required
                            className='h-20 w-16 text-7xl text-surface-main shadow-lg hover:shadow-[0px_0px_25px_-1px_#44bc19]
                                bg-transparent border border-[#5F88B8]  rounded-lg  text-center outline-none'/>
                        <input type="text" maxLength={1} required
                            className='h-20 w-16 text-7xl text-surface-main shadow-lg hover:shadow-[0px_0px_25px_-1px_#44bc19]
                                bg-transparent border border-[#5F88B8]  rounded-lg  text-center outline-none'/>
                        <input type="text" maxLength={1} required
                            className='h-20 w-16 text-7xl text-surface-main shadow-lg hover:shadow-[0px_0px_25px_-1px_#44bc19]
                                bg-transparent border border-[#5F88B8]  rounded-lg  text-center outline-none'/>
                        <input type="text" maxLength={1} required
                            className='h-20 w-16 text-7xl text-surface-main shadow-lg hover:shadow-[0px_0px_25px_-1px_#44bc19]
                                bg-transparent border border-[#5F88B8]  rounded-lg  text-center outline-none'/>
                        <input type="text" maxLength={1} required
                            className='h-20 w-16 text-7xl text-surface-main shadow-lg hover:shadow-[0px_0px_25px_-1px_#44bc19]
                                bg-transparent border border-[#5F88B8]  rounded-lg  text-center outline-none'/>
                    </div>
                    <div className='flex flex-col gap-2 items-center'>
                        <button type='submit' className='w-full h-14 bg-[#44BC19] rounded-lg font-extrabold text-surface-main'>Reset password</button>
                        <h1 className='font-light text-surface-main text-lg'>Didn't get the code?<a href='#' className='text-surface-main font-bold text-lg underline cursor-pointer'>Resent code</a></h1>
                    </div>
                </form>
            </div>
        );
    }
  
    
    return(
        <div className={`h-[600px] w-full sm:p-5 sm:w-[500px] p-0 border border-[#5F88B8]  rounded bg-[#09122C] mx-auto flex items-center justify-center overflow-hidden`}>
            <div className="flex-grow  h-full w-full">
                {<Reset />}
            </div>
        </div>
        
    );
}