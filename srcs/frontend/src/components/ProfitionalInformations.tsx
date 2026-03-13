import Icon  from '@/components/ui/Icon'

export default function ProfessionalInformations({career, del}:any){
  return (
    
        <div className='flex flex-col gap-2 h-full w-full overflow-auto custom-scrollbar'>
                  {career.map((item:any) => {
                    return (
                      <div className='relative flex-shrink-0 h-[100px] w-full rounded border border-[#5F88B8] overflow-hidden'>
                        <button 
                                onClick={() => del(item.id)}
                                className='absolute top-2 right-2 text-surface-main  group-hover:opacity-100 transition-opacity hover:text-red-500'
                              >
                              <Icon name='Trash2' size={14} />
                        </button>
                        <div
                          key={item.id}
                          className="flex flex-col gap-2 h-full w-full place-content-center"
                          >
                          <div className='font-extrabold text-surface-main text-xl pl-6'>{item.company}</div>
                          <div className='flex flex-col'> 
                            <div className='font-semibold text-gray-400 text-sm pl-6'>{item.lucation}</div>
                            <div className='flex justify-between'>
                              <div className='font-semibold text-gray-400 text-sm pl-6'>{item.start}</div>
                              <div className='font-semibold text-gray-400 text-sm pl-6 pr-6'>{item.end}</div>
                            </div>
                          </div>

                        </div>
                    </div>
                    );
                  })}   
        </div>
  );
}