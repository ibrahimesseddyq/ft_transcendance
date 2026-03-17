import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mainService } from '@/utils/Api';
import { useAuthStore } from '@/utils/ZuStand'

export function ApplicationDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [details, setDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user} = useAuthStore();
  const isAdminOrRecruiter = ["admin", "recruiter"].includes(user?.role ?? "");
  const env_main_api = import.meta.env.VITE_MAIN_API_URL;

  useEffect(() => {
    const fetchDetailsAndUser = async () => {
      try {
        setIsLoading(true);
        const appRes = await mainService.get(`${env_main_api}/applications/${id}`);
        const appData = appRes.data.data || appRes.data;

        if (appData?.candidateId) {
          try {
            const userRes = await mainService.get(`${env_main_api}/users/${appData.candidateId}`);
            appData.candidate = userRes.data.data || userRes.data;
            console.log("appData => ", appData);
          } catch (userErr) {
            console.log("Failed to fetch candidate details:", userErr);
          }
        }
        setDetails(appData);

      } catch (err) {
        console.log("Failed to fetch application details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchDetailsAndUser();
  }, [id]);

  const handleRejectCandidate = async () => {
    if (!window.confirm("Are you sure you want to reject this candidate?")) return;
    try {
      await mainService.patch(`${env_main_api}/applications/${id}/reject`);
      alert("Candidate has been rejected.");
      navigate(-1);
    } catch (error) {
      console.log("Failed to reject:", error);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-slate-500">Loading details...</div>;
  if (!details) return <div className="p-10 text-center text-red-500">Application not found.</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <button onClick={() => navigate(-1)} className="text-primary hover:underline mb-6 flex items-center gap-2">
        ← Back to Board
      </button>

      <div className="bg-surface-main dark:bg-secondary-darkbg rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-10 transition-colors">
        
        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {details.job?.title || `Job ID: ${details.jobId}`}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">App ID: {id}</p>
          </div>
          {details.status === 'rejected' 
            ?
              <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-danger-hover">
                {details.status}
              </span>
            :
              <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {details.status || "Pending"}
              </span>
          }
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">Candidate Info</h2>
            <div className="space-y-3 text-slate-600 dark:text-slate-400">
              <p><strong className="text-slate-800 dark:text-slate-200">Name: </strong> 
                {details.candidate?.firstName ? 
                    `${details.candidate.firstName} ${details.candidate.lastName}` : 
                    details.candidateId}
              </p>
              
              <p><strong className="text-slate-800 dark:text-slate-200">Email: </strong> 
                {details.candidate?.email || "No email data provided"}
              </p>
              
              <p><strong className="text-slate-800 dark:text-slate-200">Applied On: </strong>
                {new Date(details.appliedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">Phase Info</h2>
            <div className="space-y-3 text-slate-600 dark:text-slate-400">
              <p><strong className="text-slate-800 dark:text-slate-200">Current Phase: </strong> 
                {details.currentPhase?.name || details.currentPhaseId || 'None'}
              </p>
              
              <p><strong className="text-slate-800 dark:text-slate-200">Total Phases: </strong> 
                {details.applicationPhases?.length || 0}
              </p>
            </div>
          </div>
        </div>


        {isAdminOrRecruiter
          ?
            <div className="mt-10 flex gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
              <button onClick={handleRejectCandidate} className="px-6 py-2 border border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-surface-main transition-colors font-medium">
                Reject Candidate
              </button>
            </div>
          : null
        }

      </div>
    </div>
  );
}