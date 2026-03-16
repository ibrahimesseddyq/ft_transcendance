import { prisma } from '../config/prisma.js';

export const countActiveJobs = async () => {
    return await prisma.job.count({
        where: { status: 'open' }
    });
};

export const countActiveCandidates = async (start, end) => {
    const result = await prisma.application.findMany({
        where: {
            status: { in: ['pending', 'inProgress'] },
            appliedAt: { gte: start, lte: end },
        },
        select: { candidateId: true },
        distinct: ['candidateId'],
    });
    return result.length;
};

export const countNewApplications = async (start, end) => {
    return await prisma.application.count({
        where: {
            appliedAt: { gte: start, lte: end } 
        }
    });
};

export const getApplicationsOverview = async (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error("Invalid dates passed to getApplicationsOverview:", { start, end });
        return { labels: [], datasets: { received: [], processed: [] } };
    }

    const applications = await prisma.application.findMany({
        where: { 
            appliedAt: { 
                gte: startDate, 
                lte: endDate 
            } 
        },
        select: { appliedAt: true, status: true }
    });
    
    const dayMap = {};

    applications.forEach(app => {
        const date = new Date(app.appliedAt);
        const key = date.toISOString().split('T')[0]; 
        const label = date.toLocaleString('en-US', { month: 'short', day: 'numeric' });
        
        if (!dayMap[key]) {
            dayMap[key] = { label, received: 0, processed: 0 };
        }
        
        dayMap[key].received++;
        if (app.status !== 'pending') dayMap[key].processed++;
    });

    const sorted = Object.entries(dayMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, v]) => v);

    return {
        labels: sorted.map(m => m.label),
        datasets: {
            received: sorted.map(m => m.received),
            processed: sorted.map(m => m.processed)
        },
    };
};

export const getActiveCandidates = async (limit = 10) => {
    const applications = await prisma.application.findMany({
        where: { status: { in: ['pending', 'inProgress'] } },
        select: {
            id: true,
            status: true,
            updatedAt: true,
            candidate: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                    profile: { select: { currentTitle: true } }
                }
            },
            job: { select: { title: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit * 2
    });

    const seen = new Set();
    return applications
        .filter(app => {
            if (seen.has(app.candidate.id)) return false;
            seen.add(app.candidate.id);
            return true;
        })
        .slice(0, limit)
        .map(app => ({
            id: app.candidate.id,
            firstName: app.candidate.firstName,
            lastName: app.candidate.lastName,
            avatarUrl: app.candidate.avatarUrl, 
            currentTitle: app.candidate.profile?.currentTitle,
            jobTitle: app.job.title,
            applicationStatus: app.status
        }));
};

export const getRecentActivity = async (limit = 10) => {
    return prisma.application.findMany({
        select: {
            id: true,
            status: true,
            appliedAt: true,
            updatedAt: true,
            candidate: { select: { firstName: true, lastName: true } },
            job: { select: { title: true } }
        },
        orderBy: { updatedAt: 'desc' },
        take: limit
    });
};

export const getHiringFunnel = async (recruiterId, start, end) => {
    const baseWhere = { appliedAt: { gte: start, lte: end } };

    const [applied, screening] = await Promise.all([
        prisma.application.count({ where: baseWhere }),
        prisma.applicationPhase.count({
            where: {
                application: baseWhere,
                status: { in: ['inProgress', 'completed'] },
                jobPhase: { phaseType: 'test' },
            },
        }),
    ]);

    return { applied, screening };
};

export const getRecruitmentStatusBreakdown = async (start, end) => {
    const groupings = await prisma.application.groupBy({
        by: ['status'],
        _count: { _all: true },
        where: { appliedAt: { gte: start, lte: end } }
    });
    // console.log('groupings ', groupings)

    const countsMap = groupings.reduce((acc, curr) => {
        acc[curr.status] = curr._count._all;
        return acc;
    }, {});

    const statuses = ['pending', 'inProgress', 'accepted', 'rejected', 'withdrawn'];
    const total = groupings.reduce((sum, curr) => sum + curr._count._all, 0);

    return statuses.map(status => {
        const count = countsMap[status] || 0;
        return {
            status,
            count,
            percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
        };
    });
};