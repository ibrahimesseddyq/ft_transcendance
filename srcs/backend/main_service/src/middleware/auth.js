import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import {HttpException} from '../utils/httpExceptions.js';
import * as jwtServicefrom from '../services/jwtService.js';
import { getPermissionsByRole } from '../config/permissions.js';

export const verifyToken = async (req, res, next) => {
    try {
        const {authorization} = req.headers;
        if (!authorization)
            throw new HttpException(401,"Unauthorized");
        const [type, token] = authorization.split(" ");
        if (type !== "Bearer") throw new HttpException(401,"Unauthorized");
        const decoded = await jwtServicefrom.verifyAccessToken(token);
        req.user = {
            id : decoded.id,
            email : decoded.email,
            role:decoded.role
        }
        next()
    } catch (error) {
        next(error);
    }
   
}

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

export const verifyPermissions = (permission) => {
    return (req, res, next) => {
        if(!req.user || !req.user.role)
            throw new HttpException(403,"Forbidden");
        const userPermissions = getPermissionsByRole(req.user.role);
        if (!userPermissions || !userPermissions.includes(permission))
            throw new HttpException(403, `You are forbidden to ${permission}`);
        next();
    }
}

export const optionalAuth = async (req, res, next) => {
    try {
        const {authorization} = req.headers;
        if (authorization) {
            const {type, token} = authorization.split(' ');
            if (type === "Bearer") {
                const decoded = jwtService.verifyAccessToken(token);
                req.user = {
                    id : decoded.id,
                    email : decoded.email,
                    role: decoded.role
                }
            }

        }
        next();
    } catch (error) {
        next();
    }
}

export const verifyOwnership = (req, res, next) => {
    if (!req.user)
        throw new HttpException(401, "Unauthorized");
    const resourceUserId = req.params.id || req.params.userId;
    if (req.user.id !== resourceUserId && req.user.role !== 'admin')
        throw new HttpException(403, 'Forbidden:  You can only access your own resources');
    next();
}
