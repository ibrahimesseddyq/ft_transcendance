
const JobCards = (props:any) => {
    return (
        <div className="h-full w-full flex flex-col items-center gap-5 px-4 mb-24">
            {props.jobsArray.length > 0 ? (
              props.jobsArray.map((item:any) => (
                <div 
                key={item.id} 
                className="flex flex-col w-full max-w-[600px] border border-gray-800 bg-gray-900/50 p-6 gap-3 rounded-lg hover:border-gray-600 transition-all"
                >
                  <p className="text-white text-center font-medium bg-[#44BC19] w-20 px-2 rounded-sm text-xs truncate">
                    {item.department}
                  </p>
                  <p className="text-white font-bold text-xl truncate">{item.title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed truncate">{item.description}</p>
                  <div className="flex justify-between text-[#6E6E6E] text-xs sm:text-sm mt-2 font-medium">
                      <span className="truncate">{item.createdAt}</span>
                      <span className="truncate">{item.location}</span>
                      <span className="text-green-500 truncate">${item.salaryMin}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 mt-10 italic">No jobs posted yet.</div>
            )}
        </div>
    );
}

export default JobCards;