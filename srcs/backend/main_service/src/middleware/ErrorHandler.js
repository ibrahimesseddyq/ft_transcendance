import {CustomError} from '../utils/httpExceptions.js';
import { Prisma } from '../../generated/prisma/client.js'
import { ZodError } from 'zod';

const errorFactory = (err,res) => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).json({
            success: false,
            errors : err.errors
        });
        return true;
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(400).json({
            success: false,
            errors:['bad request']
        });
        return true;
    }
    if (err instanceof ZodError) {
        res.status(400).json({
            success: false,
            errors: err.issues.map((issue) => issue.message)
        });
        return true;
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
        success: false,
        errors : ['internal server error']
    })

}

export  default  errorHandler;