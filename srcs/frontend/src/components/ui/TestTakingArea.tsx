import { useState, useCallback } from 'react';
import { mainApi } from '@/utils/Api';
import Icon from '@/components/ui/Icon';
import { useNavigate } from 'react-router-dom';

const TestTakingArea = ({ phaseId, testData, candidateId }: any) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const questions = testData?.mcqs || [];
    const currentQuestion = questions[currentStep];
    const totalSteps = questions.length;
    const isLastQuestion = currentStep === totalSteps - 1;
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;

    console.log("questions : ", questions);

    const getLetter = (index: number) => String.fromCharCode(65 + index);

    const handleSelect = (letterId: string) => {
        setError(null);
        const currentSelected = selectedAnswers[currentStep] || [];
        
        let newSelection: string[];
        if (currentSelected.includes(letterId)) {
            newSelection = currentSelected.filter(id => id !== letterId);
        } else {
            newSelection = [...currentSelected, letterId];
        }

        setSelectedAnswers({ 
            ...selectedAnswers, 
            [currentStep]: newSelection 
        });
    };

    const handleSubmit = useCallback(async () => {
        setIsSubmitting(true);
        setError(null);

        const formattedAnswers = Object.keys(selectedAnswers).map((key) => {
            const index = Number(key);
            return {
                questionId: questions[index].id,
                selectedIds: selectedAnswers[index] 
            };
        });

        const payload = {
            applicationPhaseId: phaseId,
            userId: candidateId,
            answers: formattedAnswers,
            completedAt: new Date().toISOString()
        };

        try {
            await mainApi.post(`${env_main_api}/quizzes/tests/${testData.id}/submit`, payload);
            navigate('/Applications', { replace: true });
        } catch (err: any) {
            setError("Submission failed. Please check your connection.");
            setIsSubmitting(false);
        }
    }, [testData?.id, phaseId, candidateId, selectedAnswers, questions, env_main_api, navigate]);

    const handleNext = () => {
        if (!isLastQuestion) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    if (!currentQuestion) return null;

    return (
        <div className='flex flex-col gap-6'>
            <div className='flex justify-between items-center'>
                <div className='flex flex-col gap-1 w-2/3'>
                    <div className='flex justify-between text-xs font-bold text-slate-400 dark:text-slate-500 mb-1'>
                        <span>QUESTION {currentStep + 1} OF {totalSteps}</span>
                        <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
                    </div>
                    <div className='h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden'>
                        <div 
                            className='h-full bg-primary transition-all duration-500' 
                            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            <hr className='border-slate-100 dark:border-slate-800' />

            {error && (
                <div className='flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 
                    border border-red-200 dark:border-red-900/50 text-red-600 dark:text-danger-hover rounded-lg text-sm'>
                <Icon name='AlertCircle' size={16} /> {error}</div>)}

            <div className='py-4'>
                <h2 className='text-2xl font-bold text-slate-800 dark:text-surface-main mb-8'>
                    {currentQuestion.question}
                </h2>

                <div className='grid grid-cols-1 gap-4'>
                    {currentQuestion.choices.map((choice: any, index: number) => {
                        const letterId = getLetter(index);
                        const isSelected = (selectedAnswers[currentStep] || []).includes(letterId);
                        
                        return (
                            <button 
                                key={index} 
                                onClick={() => handleSelect(letterId)}
                                disabled={isSubmitting}
                                className={`group flex items-center justify-between p-5 rounded-xl border-2 transition-all
                                    ${isSelected 
                                        ? 'border-primary bg-blue-50/50 dark:bg-blue-950/20' 
                                        : 'border-slate-100 dark:border-slate-700 bg-surface-main dark:bg-slate-800/50'}`}
                            >
                                <div className="flex gap-4 items-center">
                                    <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-slate-400'}`}>
                                        {letterId}.
                                    </span>
                                    <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>
                                        {choice.text}
                                    </span>
                                </div>
                                
                                <div className={`h-6 w-6 rounded border-2 flex items-center justify-center transition-all
                                    ${isSelected ? 'border-primary bg-primary' : 'border-slate-200 dark:border-slate-600'}`}>
                                    {isSelected && <Icon name='Check' size={14} className="text-white" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className='flex justify-between items-center mt-4 border-t pt-6'>
                <span className='text-sm font-bold text-slate-400'>{currentQuestion.points || 0} Points</span>
                
                <button 
                    disabled={!(selectedAnswers[currentStep]?.length > 0) || isSubmitting}
                    onClick={handleNext}
                    className="flex items-center gap-3 bg-black dark:bg-surface-main text-surface-main dark:text-black px-10 py-3 rounded-xl font-bold disabled:opacity-50"
                >
                    {isSubmitting ? 'Sending...' : (isLastQuestion ? 'Submit Results' : 'Next Question')}
                </button>
            </div>
        </div>
    );
};

export default TestTakingArea;