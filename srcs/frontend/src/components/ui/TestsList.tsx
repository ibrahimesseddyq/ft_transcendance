import { useState, useEffect } from 'react'
import { mainApi } from '@/utils/Api';
import TestCard from '@/components/ui/TestCard';
import Notification from "@/utils/TostifyNotification";

const TestsList = () => {
    const [tests, setTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUserContent = async () => {
        try {
            const res = await mainApi.get(`/api/tests`);
            setTests(res.data?.data || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserContent();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this test?")) return;
        
        try {
            await mainApi.delete(`/api/tests/${id}`);
            setTests(prev => prev.filter(test => test.id !== id));
            Notification("Test deleted successfully", "success");
        } catch (err) {
            console.error(err);
            Notification("Failed to delete test", "error");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <p className="text-sm font-medium text-gray-500 animate-pulse">Loading tests...</p>
            </div>
        );
    }

    return (
        <div className='h-full w-full overflow-y-auto no-scrollbar'>
            {tests.length > 0 ? (
                <div className="flex flex-col">
                    {tests.map((item: any) => (
                        <TestCard 
                            key={item.id} 
                            test={item} 
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center p-10 border-2 border-dashed rounded-xl border-gray-200 dark:border-gray-800">
                    <p className='text-gray-400 text-sm'>No Tests Available</p>
                </div>
            )}
        </div>
    );
}

export default TestsList;