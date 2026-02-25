import React, { useState } from 'react';
import { Timer, ChevronRight, Diamond, Loader2, AlertCircle } from 'lucide-react';

const TestTakingArea = ({ testData, candidateId, phaseId, onComplete }: any) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const questions = testData?.questions || [];
    const currentQuestion = questions[currentStep];
    const totalSteps = questions.length;

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
            const response = await fetch('/api/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const result = await response.json();
            console.log("Success:", result);

            // Move to next phase if callback exists
            if (onComplete) {
                onComplete(result);
            }

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

    if (!currentQuestion) return <div className="p-10 text-center">No questions available.</div>;

    return (
        <div className='flex flex-col gap-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm'>
            
            {/* Header: Progress & Timer */}
            <div className='flex justify-between items-center'>
                <div className='flex flex-col gap-1 w-2/3'>
                    <div className='flex justify-between text-xs font-bold text-slate-400 mb-1'>
                        <span>QUESTION {currentStep + 1} OF {totalSteps}</span>
                        <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
                    </div>
                    <div className='h-2 w-full bg-slate-100 rounded-full overflow-hidden'>
                        <div 
                            className='h-full bg-[#00adef] transition-all duration-500' 
                            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>
                <div className='flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg border border-red-100'>
                    <Timer size={18} />
                    <span className='font-mono font-bold'>14:59</span>
                </div>
            </div>

            <hr className='border-slate-100' />

            {error && (
                <div className='flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm'>
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {/* Question Body */}
            <div className='py-4'>
                <div className='flex gap-3 items-center mb-6'>
                    <span className='bg-black text-white px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase'>MCQ</span>
                    <span className='text-slate-400 text-sm font-medium'>Target: {testData.title}</span>
                </div>
                
                <h2 className='text-2xl font-bold text-slate-800 mb-8 leading-snug'>
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
                                    ${isSelected ? 'border-[#00adef] bg-blue-50/50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                            >
                                <span className={`font-semibold ${isSelected ? 'text-[#00adef]' : 'text-slate-700'}`}>
                                    {choice.text}
                                </span>
                                <div className={`h-6 w-6 rounded-full border-2 transition-all flex items-center justify-center
                                    ${isSelected ? 'border-[#00adef] bg-[#00adef]' : 'border-slate-200 group-hover:border-slate-300'}`}>
                                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer Actions */}
            <div className='flex justify-between items-center mt-4 border-t border-slate-50 pt-6'>
                <div className='flex items-center gap-2 text-slate-400'>
                    <Diamond size={16} className='text-yellow-500 fill-yellow-500' />
                    <span className='text-sm font-bold'>{currentQuestion.points || 0} Points</span>
                </div>

                <button 
                    disabled={!selectedAnswers[currentStep] || isSubmitting}
                    onClick={handleNext}
                    className="flex items-center gap-3 bg-black text-white px-10 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
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