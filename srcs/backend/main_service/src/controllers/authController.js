const env =  require('../config/env');
const authService = require('../services/authService');

const cookieOptions = {
    httpOnly: true,
    maxAge:7 * 24 * 60 * 60 * 1000,
    sameSite: env.NODE_ENV === "production" ? 'none' : 'lax',
    secure: env.NODE_ENV === "production"
}

const login = async (req, res, next) =>
{
    console.log("kan hna");
    try
    {
        const {user, accessToken, refreshToken} = await authService.login(req.body);
        res
        .cookie('jwt', refreshToken ,cookieOptions)
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
        const user = await authService.register(req.body)
        res
        .status(201)
        .json({
            message : 'user registered successfully',
            data:user
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
        const refreshToken = req.cookies.jwt;
        if (!refreshToken)
        {
            return res
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
        const refreshToken = req.cookies.jwt;
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

const getAuthStatus = (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ loggedIn: true, user: req.user });
    } else {
        res.status(401).json({ loggedIn: false });
    }
};

const googleCallback = (req, res) => {
    res.redirect('http://localhost:5173/dashboard');
};

const verifyEmail = async (req, res, next) => {
    try {
        const token = req.params.token;
        console.log("token = " , token)
        await authService.verifyEmail(token);
      res.redirect(`${env.FRONTEND_URL}`);
    } catch (error) {
        next(error);
    }
};

const resendVerification = async (req, res, next) => {
    try {
        const email = req.body.email;
        const message = await authService.resendVerification(email);
        res.status(200).json({ message });
    } catch (error) {
        next(error);
    }
};  


module.exports = {
    getAuthStatus,
    googleCallback,
    login,
    register,
    refresh,
    logout,
    verifyEmail,
    resendVerification
}


