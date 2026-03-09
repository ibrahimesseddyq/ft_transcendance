import {HttpException} from '../utils/httpExceptions.js';
import * as jwtService from '../services/jwtService.js';
import { getPermissionsByRole } from '../config/permissions.js';

export const verifyToken = async (req, res, next) => {
    try {
        // Prefer cookie (web app), fall back to Authorization Bearer header (iframe / API clients)
        let token = req.cookies?.accessToken;
        if (!token) {
            const authHeader = req.headers?.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7);
            }
        }
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
        const roles = allowedRoles.flat()
        if(!roles.includes(req.user.role))
            throw new HttpException(403,"Forbidden");
        next();
    }
}

export const verifyPermissions = (permission) => {
    return (req, res, next) => {
        if(!req.user || !req.user.role)
            next(new HttpException(403,"Forbidden"));
        const userPermissions = getPermissionsByRole(req.user.role);
        if (!userPermissions || !userPermissions.includes(permission))
            next(new HttpException(403, `You are forbidden to ${permission}`));
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
