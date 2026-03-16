import { CustomError } from '../utils/httpExceptions.js';
import handlePrismaError from '../utils/prismaErrorHandler.js';

const errorHandler = (err, req, res, next) => {
    console.log("START ERROR");
    console.error(err);
    console.log("END ERROR");
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