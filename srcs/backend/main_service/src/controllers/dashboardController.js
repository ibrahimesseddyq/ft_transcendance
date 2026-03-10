import * as dashboardService from '../services/dashboardService.js';
import asyncHandler from '../utils/asyncHandler.js'

export const getRecruiterDashboard =  asyncHandler(async (req, res, next) => {
    const data = await dashboardService.getRecruiterDashboard(); 
    res
    .status(200)
    .json({
        success: true,
        data: data
    })
})