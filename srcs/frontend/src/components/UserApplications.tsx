import { useState, useEffect, useMemo } from 'react';
import AppCard from '@/components/ui/AppCard';
import { mainService } from '@/utils/Api';
import { useAuthStore } from '@/utils/ZuStand';
import { ToastContainer } from "react-toastify";
import Icon  from '@/components/ui/Icon'
import { Link } from 'react-router-dom';
import { AiChatButton } from '@/components/ui/AiChatButton'
import { Loading } from '@/components/Loading';

export function UserApplications() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [activeStatus, setActiveStatus] = useState('all');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const user = useAuthStore((state) => state.user);
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;
    const isAdminOrRecruiter = ["admin", "recruiter"].includes((user as any)?.role ?? "");

    const statusConfig = [
        { key: 'all', label: 'All' },
        { key: 'pending', label: 'Pending' },
        { key: 'inProgress', label: 'In Progress' },
        { key: 'accepted', label: 'Accepted' },
        { key: 'rejected', label: 'Rejected' },
        { key: 'withdrawn', label: 'Withdrawn' },
    ];

    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = { all: applications.length };
        applications.forEach((app: any) => {
            const key = app?.status || 'unknown';
            counts[key] = (counts[key] || 0) + 1;
        });
        return counts;
    }, [applications]);

    const visibleApplications = useMemo(() => {
        const filtered = activeStatus === 'all'
            ? applications
            : applications.filter((app: any) => app?.status === activeStatus);

        return [...filtered].sort((a: any, b: any) => {
            const aDate = new Date(a?.appliedAt || a?.createdAt || 0).getTime();
            const bDate = new Date(b?.appliedAt || b?.createdAt || 0).getTime();
            return sortOrder === 'newest' ? bDate - aDate : aDate - bDate;
        });
    }, [activeStatus, applications, sortOrder]);

    useEffect(() => {
        const fetchUserContent = async () => {
            if (!user?.id) {
                setIsLoading(false);
                return; 
            }

            try {
                setIsLoading(true);
                setErrorMessage('');
                const res = await mainService.get(`${env_main_api}/users/${user.id}/applications`);
                
                if (res.data?.data) {
                    setApplications(res.data.data.applications || []);
                }
            } catch (err) {
                setErrorMessage('Unable to load applications right now. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserContent();
    }, [user?.id, env_main_api]);

    return (
        <div className="w-full h-full p-4 md:p-6 flex flex-col gap-4 items-center transition-all overflow-y-auto custom-scrollbar">
            <ToastContainer />
            <div className="w-full max-w-[980px] rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Candidate Workspace</p>
                        <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">My Applications</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Track submitted roles and follow your process updates.</p>
                    </div>
                    <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Total</span>
                        <span className="ml-2 text-lg font-bold text-slate-900 dark:text-slate-100">{applications.length}</span>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap gap-2">
                        {statusConfig.map((status) => (
                            <button
                                key={status.key}
                                type="button"
                                onClick={() => setActiveStatus(status.key)}
                                className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    activeStatus === status.key
                                        ? 'border-slate-800 bg-slate-800 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                                }`}
                            >
                                {status.label} ({statusCounts[status.key] || 0})
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Sort</span>
                        <button
                            type="button"
                            onClick={() => setSortOrder('newest')}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${sortOrder === 'newest' ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
                        >
                            Newest
                        </button>
                        <button
                            type="button"
                            onClick={() => setSortOrder('oldest')}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${sortOrder === 'oldest' ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
                        >
                            Oldest
                        </button>
                    </div>
                </div>
            </div>

            {isLoading ? (
            <Loading label="Loading applications..." />
        ) : errorMessage ? (
            <div className="w-full max-w-[980px] rounded-xl border border-rose-200 bg-rose-50 p-5 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">{errorMessage}</p>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-3 rounded-md bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
                >
                    Retry
                </button>
            </div>
        ) : visibleApplications.length > 0 ? (
            <div className='flex w-full max-w-[980px] flex-col gap-3'>
                {visibleApplications?.map((app: any) => (
                    <div key={app.id} className='w-full'>
                        <AppCard app={app}/>
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center mt-20 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Icon name='Briefcase' className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-surface-main">
                    {activeStatus === 'all' ? 'No applications yet' : `No ${activeStatus} applications`}
                </h3>
                <p className="text-slate-500 dark:text-gray-400 max-w-xs mt-2">
                    {activeStatus === 'all'
                        ? "You haven't applied to any positions. Check out our open roles and start your journey!"
                        : 'Try another status filter or browse jobs to submit a new application.'}
                </p>
                <Link 
                    to="/Jobs" 
                    className="mt-6 px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95"
                >
                    Browse Jobs
                </Link>
            </div>
        )}
        {!isAdminOrRecruiter && (
            <AiChatButton />
        )}
        </div>
    );
}