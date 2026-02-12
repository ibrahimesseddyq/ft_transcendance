export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[200px] bg-transparent animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-16 h-16 bg-[#00adef]/20 rounded-full animate-ping"></div>
        <img 
          src="/logo.svg" 
          alt="Loading..." 
          className="w-12 h-12 object-contain animate-[spin_3s_linear_infinite]" 
        />
      </div>
    </div>
  );
};