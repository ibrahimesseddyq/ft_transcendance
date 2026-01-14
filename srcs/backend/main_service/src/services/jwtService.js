const jwt = require('jsonwebtoken');
const {httpExceptions} = require('../utils/httpExceptions');
const env = require('../config/env');

class JwtService {
   constructor()
   {
        this.accessTokenSecret = env.ACCESS_TOKEN_SECRET;
        this.accessTokenExpiry = env.ACCESS_TOKEN_EXPIRY;
        this.refreshTokenSecret = env.REFRESH_TOKEN_SECRET;
        this.refreshTokenExpiry = env.REFRESH_TOKEN_EXPIRY;
   }

   generateAuthTokens(payload)
   {
        const accessToken = this.sign(payload,this.accessTokenSecret,
            {
                expiresIn : this.accessTokenExpiry
            }
        )
        const refreshToken = this.sign(payload,this.refreshTokenSecret,
            {
                expiresIn: this.refreshTokenExpiry
            }
        ) 
        return {accessToken , refreshToken};  
    }

    async verify(token, secret)
    {
        return new Promise((resolve,reject) => {
            jwt.verify(token,secret, (err, decoded) =>
            {
                if(err)
                {
                    if (err.name === 'TokenExpiredError')
                        reject(new httpExceptions(401,'Token expired'));
                    else if (err.name === 'JsonWebTokenError')
                        reject(new httpExceptions(403,'Invalid token'));
                    else
                        reject(new httpExceptions(403,'Forbidden'));

                }
                else
                    resolve(decoded);
            })
        })
    }

    verifyAccessToken(token)
    {
        return this.verify(token,this.accessTokenSecret);
    }
    
    verifyRefreshToken(token)
    {
        return this.verify(token , this.refreshTokenSecret);
    }

    sign(payload , secret , options = {})
    {
        return jwt.sign(payload,secret,options);
    }

    decode(token)
    {
        return jwt.decode(token)
    }

    async refreshAccessToken(refreshToken)
    {
        const decoded = await this.verifyRefreshToken(refreshToken);
        const { iat, exp, ...payload } = decoded;
        const accessToken = this.sign(payload, this.accessTokenExpiry, {
            expiresIn : this.accessTokenExpiry
        })
        return {accessToken};
    }
   
}
const jwtService = new JwtService()
module.exports = jwtService;