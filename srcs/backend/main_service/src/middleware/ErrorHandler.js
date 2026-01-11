const {CustomError} = require('../utils/httpExceptions');
const {Prisma} = require('../../generated/prisma');


const errorFactory = (err,res) =>
{
    if (err instanceof CustomError)
    {
        if (err.isLogging)
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
        return true;
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError)
    {
        console.log(JSON.stringify(err,null,2))
        res.statusCode(400).json({
            errors:['bad request']
        });
        return true;
    }
    return false;
}

const errorHandler = (err,req,res,next) =>
{
    const handled = errorFactory(err,res);
    if (handled) return;
        console.log('unhandled error',err);
    res.status(500).json({
        errors : ['internal server error']
    })

}

module.exports = errorHandler;