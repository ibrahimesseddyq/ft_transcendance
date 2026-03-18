import { CustomError } from '../utils/httpExceptions.js';
import handlePrismaError from '../utils/prismaErrorHandler.js';
import env from '../config/env.js';

const errorHandler = (err, req, res, next) => {
    // if (env.NODE_ENV === 'development')
    // {
        console.log("START ERROR");
        console.error(err);
        console.log("END ERROR");
    // }
    let processedError = err;
    if (err.name === 'PrismaClientKnownRequestError') {
        processedError = handlePrismaError(err) || err;
    }
    if (processedError instanceof CustomError) {
        return res.status(processedError.statusCode).json({
            success: false,
            errors: processedError.errors
        });
    }
    return res.status(500).json({
        success: false,
        errors: ['internal server error']
    });
};

export default errorHandler;