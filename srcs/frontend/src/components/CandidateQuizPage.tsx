import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TestTakingArea from '@/components/ui/TestTakingArea';
import { mainApi, quizApi } from '@/utils/Api'; 
import Notification from "@/utils/TostifyNotification";

export function CandidateQuizPage() {
    const { applicationId } = useParams();
    const navigate = useNavigate();
    
    const [phases, setPhases] = useState<any[]>([]);
    const [currentTest, setCurrentTest] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;
    const env_quiz_api = import.meta.env.VITE_QUIZ_API_URL;

    const loadAssessmentData = async () => {
        try {
            setIsLoading(true);
            const appRes = await mainApi.get(`${env_main_api}/applications/${applicationId}`);
            const application = appRes.data.data;
            const allPhases = application.job.jobPhases.sort((a: any, b: any) => a.orderIndex - b.orderIndex);
            setPhases(allPhases);

            const currentPhase = allPhases.find((p: any) => p.id === application.currentPhaseId);

            if (!currentPhase) {
                Notification("All assessments completed!", "success");
                navigate('/Jobs');
                return;
            }
            if (currentPhase.phaseType === 'test' && currentPhase.testId) {
                const testRes = await quizApi.get(`${env_quiz_api}/tests/${currentPhase.testId}`);
                setCurrentTest({
                    ...testRes.data,
                    phaseId: currentPhase.id,
                    phaseName: currentPhase.name
                });
            } else {
                Notification(`Next step is: ${currentPhase.name}. HR will contact you.`, "info");
                navigate('/Jobs');
            }

        } catch (err) {
            console.error("Quiz Fetch Error:", err);
            Notification("Could not load assessment step", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (applicationId) loadAssessmentData();
    }, [applicationId]);

    const handleTestComplete = async (score: number) => {
        try {
            const res = await mainApi.post(`/api/main/applications/${applicationId}/submit-test`, {
                score: score,
                phaseId: currentTest.phaseId
            });

            Notification(`${currentTest.phaseName} Completed!`, "success");

            if (res.data.hasNextPhase && res.data.nextPhaseType === 'test') {
                loadAssessmentData();
            } else {
                Notification("Assessment sequence finished!", "success");
                navigate('/Jobs'); 
            }
        } catch (err) {
            Notification("Error saving results", "error");
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc] dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-[#00adef] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 dark:text-slate-400 animate-pulse">Preparing your assessment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto no-scrollbar w-full h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300">
            <div className='grid grid-cols-4 h-full w-full lg:divide-x-2 divide-gray-200 dark:divide-slate-800'>
                
                <div className="col-span-4 lg:col-span-1 bg-[#e9e9e9] dark:bg-slate-900 h-full p-6 transition-colors duration-300">
                    <div className="mb-8">
                        <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Recruitment Journey</h2>
                        <h1 className="text-xl font-bold text-black dark:text-white">Job Phases</h1>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        {phases.map((phase, index) => (
                            <QuizSidebarItem 
                                key={phase.id} 
                                phase={phase} 
                                isSelected={phase.id === currentTest?.phaseId} 
                                number={index + 1}
                            />
                        ))}
                    </div>
                </div>
                
                {/* Main Area */}
                <div className="col-span-4 lg:col-span-3 h-full p-4 lg:p-10 flex flex-col items-center bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300">
                    <div className='max-w-4xl w-full'>
                        {currentTest ? (
                            <TestTakingArea 
                                testData={currentTest} 
                                onComplete={handleTestComplete} 
                            />
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-slate-500">No active test content.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const QuizSidebarItem = ({ phase, isSelected, number }: any) => {
    return (
        <div className={`p-4 rounded-xl border-2 transition-all flex items-center gap-4 
                ${isSelected 
                    ? 'bg-white dark:bg-slate-800 border-[#00adef] shadow-md scale-105' 
                    : 'bg-transparent border-transparent opacity-60'}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm
                ${isSelected ? 'bg-[#00adef] text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-500'}`}>
                {number}
            </div>
            <div>
                <h3 className="font-semibold text-sm text-black dark:text-white">
                    {phase.name}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">
                    {phase.phaseType} {isSelected && "• Active"}
                </p>
            </div>
        </div>
    );
};