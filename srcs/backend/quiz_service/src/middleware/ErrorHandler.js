import {CustomError} from '../utils/httpExceptions';
import {Prisma} from '../../generated/prisma/index.js';
import handlePrismaError from '../utils/prismaErrorHandler.js'

const errorFactory = (err,res) => {
    if (err instanceof CustomError) {
        if (err.isLogging) {
            console.log(JSON.stringify({
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
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return handlePrismaError(err,res);
    }
    return false;
}

const errorHandler = (err,req,res,next) => {
    console.log("START ERROR")
    console.log(err);
    console.log("END ERROR")

    const handled = errorFactory(err,res);
    if (handled) return;

    res.status(500).json({
        errors : ['internal server error']
    })

}

export default  errorHandler;