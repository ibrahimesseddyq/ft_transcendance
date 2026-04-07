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
        <div className="w-full h-full p-4 flex flex-col gap-4 items-center transition-all overflow-y-auto custom-scrollbar">
            
            {isLoading ? (
                <Loading label="Loading applications..." />
            ) : (
                <>
                    <ApplicationContent Title="Pending" applications={filteredApplications("pending")} />
                    <ApplicationContent Title="InProgress" applications={filteredApplications("inProgress")} />
                    <ApplicationContent Title="Accepted" applications={filteredApplications("accepted")} />
                    <ApplicationContent Title="Rejected" applications={filteredApplications("rejected")} />
                    <ApplicationContent Title="Withdrawn" applications={filteredApplications("withdrawn")} />
                </>
            )}
            
        </div>
    );
}