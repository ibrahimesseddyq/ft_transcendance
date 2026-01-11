const authService = require('../services/authService');
const env =  require('../config/env');

const cookieOptions = {
    httponly: true,
    maxAge:7 * 24 * 60 * 60 * 1000,
    sameSite: env.NODE_ENV === "production" ? 'none' : 'lax',
    secure: env.NODE_ENV === "production"
}

const login = async (req, res, next) =>
{
    try
    {
        const {user, accessToken, refreshToken} = await authService.login(req.body);
        res
        .cookie('jwt', refreshToken,cookieOptions)
        .status(200)
        .json(
            {
                message: 'login successful',
                data:{
                    user,
                    accessToken
                }
            }
        );
    }catch(error)
    {
        next(error);
    }
}

const register = async (req, res, next) =>
{
    try 
    {
        const {user , accessToken , refreshToken} = await authService.register(req.body);
        res
        .cookie('jwt',refreshToken,cookieOptions)
        .status(201)
        .json({
            message : 'user registered successfully',
            data:{
                user,
                accessToken
            }
        });
    }catch(error)
    {
        next(error)
    }
}

const refresh =  async (req, res, next) => 
{
    try 
    {
        const refreshToken = req.cookie.jwt;
        if (!refreshToken)
        {
            res
            .status(401)
            .json({
                error: 'refreshToken not provided'
            });
        }
        const {user, accessToken} = await  authService.refresh(refreshToken);
        res
        .status(200)
        .json({
            message: 'token refreshed successfully',
            data:{
                user,
                accessToken
            }
        });
    }catch(error)
    {
        next(error);
    }
}

const logout =  async (req, res, next) =>
{
    try
    {
        refreshToken = req.cookie.jwt;
        if (!refreshToken)
        {
            return res.sendStatus(204);
        }
        await authService.logout(refreshToken);
        res.clearCookie('jwt', cookieOptions).sendStatus(204);
    }catch(error)
    {
        res.clearCookie('jwt',cookieOptions).sendStatus(204);
        next(error);
    }
}

module.exports = {
    login,
    register,
    refresh,
    logout
}