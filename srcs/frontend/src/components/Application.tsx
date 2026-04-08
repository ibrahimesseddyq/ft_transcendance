import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ApplicationContent from '@/components/ui/ApplicationContent';
import { mainService } from '@/utils/Api';
import { Loading } from '@/components/Loading';

export function Application() {
    const { jobId } = useParams(); 
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;

    const statusSections = [
        { title: 'Pending', key: 'pending' },
        { title: 'In Progress', key: 'inProgress' },
        { title: 'Accepted', key: 'accepted' },
        { title: 'Rejected', key: 'rejected' },
        { title: 'Withdrawn', key: 'withdrawn' },
    ];

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setIsLoading(true);
                const res = await mainService.get(`${env_main_api}/jobs/${jobId}/applications`);
                setApplications(res.data.data || []);
            } catch (err) {

            } finally {
                setIsLoading(false);
            }
        };
    
        if (jobId) fetchApplications();
    }, [jobId]);

    const filteredApplications = (targetStatus: string) => {
        if (!applications)
            return [];
        return applications.filter((app: any) => {
            const currentStatus = app.status?.toLowerCase() || "";
            return currentStatus === targetStatus.toLowerCase();
        });
    };

    return (
        <div className="w-full h-full overflow-y-auto custom-scrollbar p-4 md:p-6">
            <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-600 dark:text-sky-300">
                                Recruiter Workspace
                            </p>
                            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Applications Pipeline
                            </h1>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Review and manage all candidates for this position from one place.
                            </p>
                        </div>
                        <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-800/70">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                Total Applications
                            </span>
                            <span className="ml-3 text-xl font-extrabold text-slate-900 dark:text-slate-100">
                                {applications.length}
                            </span>
                        </div>
                    </div>
                </section>

                {isLoading ? (
                    <Loading label="Loading applications..." />
                ) : (
                    statusSections.map((section) => (
                        <ApplicationContent
                            key={section.key}
                            Title={section.title}
                            applications={filteredApplications(section.key)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}