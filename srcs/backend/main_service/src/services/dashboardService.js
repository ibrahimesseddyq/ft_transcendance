import * as dashboardRepository from '../repositories/dashboardRepository.js';
import { getLast30Days, getPrevious30Days, calcPercentChange } from '../utils/dateUtils.js';

let cache = null;
const CACHE_TTL = 86_400_000;

export const getRecruiterDashboard = async () => {
    if (cache && Date.now() - cache.ts < CACHE_TTL) return cache.data;

    const { start, end } = getLast30Days();
    console.log("Querying from:", start, "to:", end);
    const { start: pStart, end: pEnd } = getPrevious30Days();
    const [
        kpiCards,
        applicationsOverview,
        activeCandidatesList,
        recentActivity,
        hiringFunnel,
        recruitmentStatus
    ] = await Promise.all([
        buildKpiCards(start, end, pStart, pEnd),
        dashboardRepository.getApplicationsOverview(start, end),
        dashboardRepository.getActiveCandidates(10),
        dashboardRepository.getRecentActivity(10),
        dashboardRepository.getHiringFunnel(start, end),
        dashboardRepository.getRecruitmentStatusBreakdown(start, end),
    ]);
    console.log("DEBUG: applicationsOverview Result:", applicationsOverview);
    console.log("DEBUG: KPI Apps Count:", kpiCards.find(k => k.id === 'new_applications')?.value);

    const data = { 
        kpiCards, applicationsOverview, activeCandidatesList, 
        recentActivity, hiringFunnel, recruitmentStatus 
    };
    cache = { data, ts: Date.now() };
    return data;
};

async function buildKpiCards(start, end, pStart, pEnd) {
    const [
        jobs, cands, apps, pCands, pApps
    ] = await Promise.all([
        dashboardRepository.countActiveJobs(),
        dashboardRepository.countActiveCandidates(start, end),
        dashboardRepository.countNewApplications(start, end),
        dashboardRepository.countActiveCandidates(pStart, pEnd),
        dashboardRepository.countNewApplications(pStart, pEnd),
    ]);

    const cChange = cands - pCands;
    const aChange = calcPercentChange(apps, pApps);

    return [
        { id: 'active_jobs', title: 'Active Jobs', value: jobs, change: null, changeLabel: 'Currently open positions', changeType: 'neutral' },
        { id: 'active_candidates', title: 'Active Candidates', value: cands, change: cChange, changeLabel: `${cChange > 0 ? '+' : ''}${cChange} from last 30 days`, changeType: cChange >= 0 ? 'increase' : 'decrease' },
        { id: 'new_applications', title: 'New Applications', value: apps, change: aChange, changeLabel: `${aChange > 0 ? '+' : ''}${aChange}% from last 30 days`, changeType: aChange >= 0 ? 'increase' : 'decrease' },
    ];
}