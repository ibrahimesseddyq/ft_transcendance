import TestTakingArea from '@/components/ui/TestTakingArea'
import { ChevronRight } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/utils/ZuStand'
import { mainApi } from '@/utils/Api'

export function UserPhase() {
    const { appId } = useParams();
    const [testId, setTestId] = useState("");
    const [testData, setTestData] = useState(null); 
    const [startTest, setStartTest] = useState(false);
    const [phaseId, setPhaseId] = useState("");
    const user = useAuthStore((state) => state.user);
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;

    console.log("appID = ", appId);
    useEffect(() => {
        const fetchPhase = async () => {
            try {
                const response = await mainApi.get(`${env_main_api}/applications/${appId}/phase`);
                const result = response.data;
                if (result) {
                  console.log(result.data);
                  setPhaseId(result.data.id);
                  setTestId(result.data.jobPhase.testId);
                }
            } catch (err) {
                console.error("Failed to fetch phase:", err);
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

    console.log(testData);
    if (!testData || !phaseId) 
      return <div>Loading Test...</div>;

    const handleStartTest = () =>{
        setStartTest(!startTest);
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
        onClick={handleStartTest}
        className='flex items-center gap-3 bg-black dark:bg-surface-main text-surface-main dark:text-black
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