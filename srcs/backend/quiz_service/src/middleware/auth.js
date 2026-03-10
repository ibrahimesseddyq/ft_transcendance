import {HttpException} from '../utils/httpExceptions.js';
import * as jwtService from '../services/jwtService.js';

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;
        if (!token) throw new HttpException(401, "Unauthorized");
        const decoded = await jwtService.verifyAccessToken(token);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };
        next();
    } catch (error) {
        next(error);
    }
};

export const verifyRoles =  (...allowedRoles) => {
    return (req, res, next) =>
    {
        if(!req.user || !req.user.role)
            throw new HttpException(403, "Forbidden");
        if(!allowedRoles.includes(req.user.role))
            throw new HttpException(403,"Forbidden");
        next();
    }
}


export const verifyOwnership = (req, res, next) => {
    if (!req.user)
        throw new HttpException(401, "Unauthorized");
    const resourceUserId = req.params.id || req.params.userId;
    if (String(req.user?.id) !== String(resourceUserId) && req.user.role !== 'admin')
        throw new HttpException(403, 'Forbidden:  You can only access your own resources');
    next();
}
