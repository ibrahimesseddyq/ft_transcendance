import UserCard from '@/components/ui/UserCard';
import { useNavigate } from 'react-router-dom';

interface Props {
  Title: string;
  applications: any;
}

const ApplicationContent = ({ Title, applications }: Props) => {
  const navigate = useNavigate();
  const normalizedTitle = Title.toLowerCase();

  const statusStyles: Record<string, { dot: string; badge: string }> = {
    pending: {
      dot: 'bg-amber-500',
      badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
    },
    'in progress': {
      dot: 'bg-sky-500',
      badge: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800',
    },
    accepted: {
      dot: 'bg-emerald-500',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
    },
    rejected: {
      dot: 'bg-rose-500',
      badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800',
    },
    withdrawn: {
      dot: 'bg-slate-500',
      badge: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    },
  };

  const theme = statusStyles[normalizedTitle] || statusStyles['in progress'];

  const handleSeeAll = () => {
    navigate('/AppAllCards', { 
      state: {
        title: Title, 
        applications,
        users: applications
      } 
    });
  };
  
  const limitedUsers = applications.slice(0, 6);
  const hasMore = applications.length > 6;
  
  return (
    <section className="relative flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
      
      <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${theme.dot}`} />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{Title}</h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${theme.badge}`}>
          {applications.length} Total
        </span>
      </header>

      <div className="p-5 md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {limitedUsers.length > 0 ? (
            limitedUsers.map((item:any) => (
              <div key={item.id} className="relative">
                <UserCard 
                  candidateId={item.candidateId}
                  applicationId={item.id}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center">
              <div className="mx-auto max-w-md rounded-2xl border border-dashed border-slate-300 bg-white/80 px-4 py-8 dark:border-slate-700 dark:bg-slate-900/70">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  No candidates in {Title.toLowerCase()}.
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  New applications will appear here automatically.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {hasMore && (
        <div className="flex items-center justify-end border-t border-slate-200 bg-white/80 px-6 py-3 dark:border-slate-700 dark:bg-slate-900/80">
          <button onClick={handleSeeAll}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
            View all ({applications.length - 6} more)
          </button>
        </div>
      )}
    </section>
  );
};

export default ApplicationContent;