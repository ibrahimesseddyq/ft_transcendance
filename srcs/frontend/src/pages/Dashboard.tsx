import {OverviewStatistics} from "@/components/OverviewStatistics"
import { ActiveCondidates } from "@/components/ActiveCondidates";
import { RecentActivity } from "@/components/RecentActivity";
import { RecruitmentPieChart } from "@/components/RecruitmentPieChart";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from 'react'
import { mainService } from '@/utils/Api'
import { Loading } from '@/components/Loading'
import { BarChart3 } from 'lucide-react'

export function Dashboard() {

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const env_main_api = import.meta.env.VITE_MAIN_API_URL;
  const panelClassName = "rounded-xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900";

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

    if (!stats.length) {
      return (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-8 text-center text-sm font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          No statistics available yet.
        </div>
      );
    }

    return (
      <div className="grid h-full w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item: any) => (
          <div
            key={item.id}
            className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm transition-colors duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">{item.title}</p>
            <p className="mt-2 text-3xl font-bold leading-tight">{item.value}</p>
            <p className={`mt-1 text-xs font-semibold ${
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
    <div className="h-full w-full overflow-y-auto p-3 transition-colors duration-300 custom-scrollbar md:p-4">
      <ToastContainer />

      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4">
        <section className={`${panelClassName} relative overflow-hidden p-5 md:p-6`}>
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-500 via-slate-600 to-slate-500 opacity-90" />
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <BarChart3 size={18} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Dashboard Overview</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Recruitment performance and hiring activity at a glance.</p>
            </div>
          </div>
        </section>

        <section className="w-full place-content-center">
          <TotalStatistics />
        </section>

        <div className="flex flex-col gap-4 md:flex-row">
          <section className={`${panelClassName} h-[500px] w-full p-2`}>
            <OverviewStatistics data={dashboardData?.applicationsOverview} />
          </section>
          <section className={`${panelClassName} h-[500px] w-full p-2`}>
            <ActiveCondidates data={dashboardData?.activeCandidatesList} />
          </section>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <section className={`${panelClassName} h-[500px] w-full p-2`}>
            <RecentActivity activities={dashboardData?.recentActivity} />
          </section>
          <section className={`${panelClassName} h-[500px] w-full p-2 place-content-center`}>
            <RecruitmentPieChart data={dashboardData?.recruitmentStatus} />
          </section>
        </div>
      </div>
    </div>
  );
}