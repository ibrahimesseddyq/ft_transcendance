import Icon  from '@/components/ui/Icon'

const TestCard = ({ test, onDelete }: { test: any; onDelete: (id: string) => void }) => {
  return (
    <div className="group bg-surface-main dark:bg-secondary-darkbg flex flex-col gap-3 border border-gray-200 dark:border-gray-800 px-4 py-4 rounded-xl mt-3 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300">
      
      <div className='flex gap-3 items-start'>
        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
          test.difficulty === 'EASY' ? 'bg-green-500' : 
          test.difficulty === 'MEDIUM' ? 'bg-yellow-500' : 'bg-red-500'
        }`} title={test.difficulty} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              ID: {test.id.toString().slice(-4)}
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-slate-100 dark:bg-slate-800 text-gray-500">
              {test.category || "General"}
            </span>
          </div>
          
          <h1 className="text-sm font-bold text-black dark:text-surface-main leading-tight mt-1 break-words">
            {test.question}
          </h1>
        </div>

        <div className="flex flex-col gap-2">
           <button 
             onClick={() => onDelete(test.id)}
             className='p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 rounded-lg transition-all'
           >
             <Icon name='Trash2' size={16} />
           </button>
        </div>
      </div>

      <div className='flex gap-2 justify-between items-center pt-2 border-t border-gray-50 dark:border-gray-800/50'>
        <div className='flex gap-2 items-center'>
          <Icon name='CopyCheck' className='text-primary w-4 h-4'/>
          <span className='text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase'>
            {test.choices?.length || 0} Choices
          </span>
        </div>
        
        {test.passingScore && (
           <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded">
             <Icon name='Sparkle' size={10} className="text-yellow-600" />
             <span className="text-[10px] font-bold text-yellow-700">{test.passingScore} PT</span>
           </div>
        )}
      </div>
    </div>
  );
};

export default TestCard;