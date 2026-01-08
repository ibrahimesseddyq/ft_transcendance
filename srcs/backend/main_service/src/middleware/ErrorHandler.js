const {customError} = require('../utils/httpExceptions');
const {prisma} = require('@prisma/client');


const errorFactory = (err,res) =>
{
    if (err instanceof customError)
    {
        if (err.isLoging)
        {
            console.log(JSON.stringify(
                {
                    statusCode : err.statusCode,
                    errors: err.errors,
                    stack : err.stack,
                },
                null,
                2
            ));
        }
        res.status(err.statusCode).json({
            errors : err.errors
        });
    }
    if (err instanceof prisma.PrismaClientKnownRequestError)
    {
        console.log(JSON.stringify(err,null,2))
        res.statusCode(400).json({
            errors:['bad request']
        });
    }
    return null;
}

const errorHandler = (err,req,res,next) =>
{
    const handled = errorFactory(err,res);
    if (!handled)
        console.log('unhandled error',err);
    res.status(500).json({
        errors : ['internal server error']
    })

}

module.exports = errorHandler;