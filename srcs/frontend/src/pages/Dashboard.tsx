import {OverviewStatistics} from "@/components/OverviewStatistics"
import { ActiveCondidates } from "@/components/ActiveCondidates";
import { RecentActivity } from "@/components/RecentActivity";
import { RecruitmentPieChart } from "@/components/RecruitmentPieChart";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from 'react'
import { mainService } from '@/utils/Api'
import { Loading } from '@/components/Loading'

export function Dashboard() {

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const env_main_api = import.meta.env.VITE_MAIN_API_URL;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const res = await mainService.get(`${env_main_api}/dashboard`);
        if (res.data?.success) {
          setDashboardData(res.data.data);
        }
      } catch (err) {

      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, [env_main_api]);


  const TotalStatistics = () => {
    const stats = dashboardData?.kpiCards || [];

    return (
      <div className="flex flex-col md:flex-row gap-2 items-center h-full w-full">
        {stats.map((item: any) => (
          <div
            key={item.id}
            className="w-full p-4 m-auto flex flex-col justify-between flex-1 overflow-hidden 
                       bg-surface-main dark:bg-slate-800 
                       text-black dark:text-surface-main 
                       border border-gray-200 dark:border-slate-700 
                       hover:border-[#1194b1] rounded-xl transition-colors duration-200"
          >
            <p className="text-xl font-bold">{item.title}</p>
            <p className="text-md opacity-80">{item.value}</p>
            <p className={`text-xs font-semibold ${
                item.changeType === 'increase' ? 'text-green-500' : 
                item.changeType === 'decrease' ? 'text-red-500' : 'text-[#1194b1]'
              }`}
            >
              {item.changeLabel}
            </p>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading){
    return <Loading label="Loading dashboard..." />;
  }

  return (
    <div className="w-full h-full p-2 flex flex-col gap-4 overflow-y-auto custom-scrollbar 
                     transition-colors duration-300">
      <ToastContainer />

      <div className="w-full h-fit p-2 place-content-center">
        <TotalStatistics />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="h-[500px] w-full bg-surface-main dark:bg-slate-800 rounded-xl border dark:border-slate-700">
          <OverviewStatistics data={dashboardData?.applicationsOverview} />
        </div>
        <div className="h-[500px] w-full bg-surface-main dark:bg-slate-800 rounded-xl border dark:border-slate-700">
          <ActiveCondidates data={dashboardData?.activeCandidatesList} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="h-[500px] w-full rounded-xl bg-surface-main dark:bg-slate-800 border dark:border-slate-700 ">
          <RecentActivity activities={dashboardData?.recentActivity} />
        </div>
        <div className="h-[500px] w-full rounded-xl bg-surface-main dark:bg-slate-800 border dark:border-slate-700 place-content-center">
          <RecruitmentPieChart data={dashboardData?.recruitmentStatus} />
        </div>
      </div>
    </div>
  );
}