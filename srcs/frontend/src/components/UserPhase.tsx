import TestTakingArea from '@/components/ui/TestTakingArea'
import Icon  from '@/components/ui/Icon'
import { useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/utils/ZuStand'
import { mainService } from '@/utils/Api'

export function UserPhase() {
    const { appId } = useParams();
    const [testData, setTestData] = useState(null); 
    const [startTest, setStartTest] = useState(false);
    const [phaseId, setPhaseId] = useState("");
    const [loading, setLoading] = useState(true);
    const user = useAuthStore((state) => state.user);
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;

    useEffect(() => {
        const fetchEverything = async () => {
            try {
                setLoading(true);
                const phaseResponse = await mainService.get(`${env_main_api}/applications/${appId}/phase`);
                const phaseResult = phaseResponse.data;
                
                if (phaseResult?.data) {
                    const fetchedPhaseId = phaseResult.data.id;
                    const fetchedTestId = phaseResult.data.jobPhase.testId;
                    
                    setPhaseId(fetchedPhaseId);
                    if (fetchedTestId) {
                        const testRes = await mainService.get(`${env_main_api}/quizzes/tests/${fetchedTestId}/start`, {
                            params: {
                                userId: user?.id,
                                applicationPhaseId: fetchedPhaseId
                            },
                        });
                        
                        const testResult = testRes.data;
                        if (testResult) {
                            setTestData(testResult.data.test.data);
                        }
                    }
                }
            } catch (err) {
                console.log("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (appId) {
            fetchEverything();
        } else {
            setLoading(false);
        }

    }, [appId, env_main_api, user?.id]); 

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Loading Test...
          </h3>
          <p className="text-gray-500 text-sm max-w-xs">
            Please wait just a moment while we get your questions ready.
          </p>
        </div>
      );
    }

    if (!loading && !testData) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 shadow-sm">
            <svg 
              className="w-8 h-8 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Test Already Submitted
          </h3>
          <p className="text-gray-500 max-w-sm">
            You have successfully completed this test. Sit tight and wait for your results!
          </p>
        </div>
      );
    }

    return (
        <div className='bg-surface-main dark:bg-secondary-darkbg p-8 rounded-2xl border items-center
            border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300'>

            {startTest ? (
            <TestTakingArea
                phaseId={phaseId}
                testData={testData}
                candidateId={user?.id}
            />
            ) : (
            <button
                onClick={() => setStartTest(!startTest)}
                className='flex items-center gap-3 bg-black dark:bg-surface-main text-surface-main dark:text-black
                px-10 py-3 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all
                disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600
                disabled:cursor-not-allowed'
            >
                Start Test
                <Icon name='ChevronRight' size={20} />
            </button>
            )}

        </div>
    );
}