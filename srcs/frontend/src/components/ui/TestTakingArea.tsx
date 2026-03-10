import { useState } from 'react';
import { mainApi } from '@/utils/Api';
import { Timer, ChevronRight, Diamond, Loader2, AlertCircle } from 'lucide-react';

const TestTakingArea = ({ testData, candidateId, phaseId }: any) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const questions = testData?.questions || [];
    const currentQuestion = questions[currentStep];
    const totalSteps = questions.length;
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;

    const handleSelect = (choiceText: string) => {
        setError(null);
        setSelectedAnswers({ ...selectedAnswers, [currentStep]: choiceText });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        const payload = {
            candidateId,
            phaseId,
            testId: testData.id,
            responses: Object.entries(selectedAnswers).map(([index, answer]) => ({
                questionId: questions[Number(index)].id,
                selectedOption: answer
            })),
            completedAt: new Date().toISOString()
        };

        try {
            const response = await mainApi.post(`${env_main_api}/test`, payload);

            const result = response.data;
            console.log("Success:", result);

        } catch (err: any) {
            setError(err.message || "Submission failed. Please check your connection.");
            console.error("Fetch Error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    if (!currentQuestion) 
        return <div className="text-back dark:text-white p-10 text-center">No questions available.</div>;

    return (
        <div className='flex flex-col gap-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300'>

            {/* Header: Progress & Timer */}
            <div className='flex justify-between items-center'>
                <div className='flex flex-col gap-1 w-2/3'>
                    <div className='flex justify-between text-xs font-bold text-slate-400 dark:text-slate-500 mb-1'>
                        <span>QUESTION {currentStep + 1} OF {totalSteps}</span>
                        <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
                    </div>
                    <div className='h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden'>
                        <div 
                            className='h-full bg-[#00adef] transition-all duration-500' 
                            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>
                <div className='flex items-center gap-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg border border-red-100 dark:border-red-900/50'>
                    <Timer size={18} />
                    <span className='font-mono font-bold'>14:59</span>
                </div>
            </div>

            <hr className='border-slate-100 dark:border-slate-800' />

            {error && (
                <div className='flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-sm'>
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {/* Question Body */}
            <div className='py-4'>
                <div className='flex gap-3 items-center mb-6'>
                    <span className='bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase'>MCQ</span>
                    <span className='text-slate-400 dark:text-slate-500 text-sm font-medium'>Target: {testData.title}</span>
                </div>

                <h2 className='text-2xl font-bold text-slate-800 dark:text-white mb-8 leading-snug'>
                    {currentQuestion.question}
                </h2>

                <div className='grid grid-cols-1 gap-4'>
                    {currentQuestion.choices.map((choice: any, i: number) => {
                        const isSelected = selectedAnswers[currentStep] === choice.text;
                        return (
                            <button 
                                key={i} 
                                onClick={() => handleSelect(choice.text)}
                                disabled={isSubmitting}
                                className={`group flex items-center justify-between p-5 rounded-xl border-2 transition-all text-left
                                    ${isSelected 
                                        ? 'border-[#00adef] bg-blue-50/50 dark:bg-blue-950/20' 
                                        : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 bg-white dark:bg-slate-800/50'}`}
                            >
                                <span className={`font-semibold ${isSelected ? 'text-[#00adef]' : 'text-slate-700 dark:text-slate-200'}`}>
                                    {choice.text}
                                </span>
                                <div className={`h-6 w-6 rounded-full border-2 transition-all flex items-center justify-center
                                    ${isSelected 
                                        ? 'border-[#00adef] bg-[#00adef]' 
                                        : 'border-slate-200 dark:border-slate-600 group-hover:border-slate-300 dark:group-hover:border-slate-500'}`}>
                                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer Actions */}
            <div className='flex justify-between items-center mt-4 border-t border-slate-100 dark:border-slate-800 pt-6'>
                <div className='flex items-center gap-2 text-slate-400 dark:text-slate-500'>
                    <Diamond size={16} className='text-yellow-500 fill-yellow-500' />
                    <span className='text-sm font-bold'>{currentQuestion.points || 0} Points</span>
                </div>

                <button 
                    disabled={!selectedAnswers[currentStep] || isSubmitting}
                    onClick={handleNext}
                    className="flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-10 py-3 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Sending...</span>
                        </>
                    ) : (
                        <>
                            <span>{currentStep === totalSteps - 1 ? 'Submit Results' : 'Next Question'}</span>
                            <ChevronRight size={20} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default TestTakingArea;