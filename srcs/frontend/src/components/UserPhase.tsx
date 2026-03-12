import TestTakingArea from '@/components/ui/TestTakingArea'
import { ChevronRight } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/utils/ZuStand'
import { mainApi } from '@/utils/Api'
import { Loading } from './Loading';

export function UserPhase() {
    const { appId } = useParams();
    const [testId, setTestId] = useState("");
    const [testData, setTestData] = useState(null); 
    const [startTest, setStartTest] = useState(false);
    const [phaseId, setPhaseId] = useState("");
    const [loading, setLoading] = useState(true);
    const user = useAuthStore((state) => state.user);
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;

    console.log("appID = ", appId);
    useEffect(() => {
        const fetchPhase = async () => {
            try {
                setLoading(true);
                const response = await mainApi.get(`${env_main_api}/applications/${appId}/phase`);
                const result = response.data;
                if (result) {
                  console.log(result.data);
                  setPhaseId(result.data.id);
                  setTestId(result.data.jobPhase.testId);
                }
            } catch (err) {
                console.error("Failed to fetch phase:", err);
            } finally{
                setLoading(false);
            }
        };

        if (appId) fetchPhase();
    }, [appId, env_main_api]);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const res = await mainApi.get(`${env_main_api}/quizzes/tests/${testId}/start`, {
                  params: {
                    userId: user?.id,
                    applicationPhaseId: phaseId
                  },
                });
                const result = res.data;
                if (result) {
                  console.log("result.data = ", result.data.test);
                  setTestData(result.data.test.data);
                }
            } catch (err) {
                console.error("Failed to fetch test:", err);
            }
        };

        if (testId)
          fetchTest();
    }, [testId, env_main_api]);

    console.log("testData => ", testData, " phaseId => ", phaseId);

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

    if (!testData && phaseId) {
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

    const handleStartTest = () =>{
        setStartTest(!startTest);
    }

    return (
  <div className='bg-white dark:bg-slate-900 p-8 rounded-2xl border items-center
      border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300'>

    {startTest ? (
      <TestTakingArea
        phaseId={phaseId}
        testData={testData}
        candidateId={user?.id}
      />
    ) : (
      <button
        onClick={handleStartTest}
        className='flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black
        px-10 py-3 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all
        disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600
        disabled:cursor-not-allowed'
      >
        Start Test
        <ChevronRight size={20} />
      </button>
    )}

  </div>
);
}