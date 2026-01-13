const {jwt} =  require('jsonwebtoken');
const env  = require('../config/env')
const {HttpException} = require('../utils/httpExceptions');
const {jwtService} = require('../services/jwtService');
const { getPermissionsByRole } = require('../config/permissions');

const verifyToken = async (req, res, next) => {
    try {
        const {authorization} = req.headers;
        if (!authorization) throw new HttpException(401,"Unauthorized");
        const {type, token} = authorization.split(" ");
        if (type !== "Bearer") throw new HttpException(401,"Unauthorized");
        const decoded = await jwtService.verifyAccessToken(token);
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

const verifyRoles = async (allowedRoles) => {
    return (req, res, next) =>
    {
        if(!req.user || !req.user.role)
            throw new HttpException(403, "Forbidden");
        if(!allowedRoles.includes(req.user.role))
            throw new HttpException(403,"Forbidden");
        next();
    }
}

const verifyPermissions = (permission) => {
    return (req, res, next) =>
    {
        if(!req.user || !req.user.role)
            throw new HttpException(403,"Forbidden");
        const userPermissions = getPermissionsByRole(req.user.role);
        if (!userPermissions || !userPermissions.includes(permission))
            throw new HttpException(403, `You are forbidden to ${permission}`);
        next();
    }
}

const optionalAuth = async (req, res, next) => {
    try {
        const {authorization} = req.headers;
        if (authorization)
        {
            const {type, token} = authorization.split(' ');
            if (type === "Bearer")
            {
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

const verifyOwnership = (req, res, next) =>
{
    if (!req.user)
        throw new HttpException(401, "Unauthorized");
    const resourceUserId = req.params.id || req.params.userId;
    if (user.id !== resourceUserId && req.user.role !== 'admin')
    {
           throw new HttpException(403, 'Forbidden:  You can only access your own resources');
    }
    next();
}


module.exports = {
  verifyToken,
  verifyRoles,
  verifyPermissions,
  optionalAuth,
  verifyOwnership,
  authenticate: verifyToken,
  authorize: verifyRoles,
};
