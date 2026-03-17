import { Prisma } from '../../generated/prisma/client.js';
import { CustomError, HttpException, HttpValidationException } from './httpExceptions.js';

const handlePrismaError = (err) => {
    if (!(err instanceof Prisma.PrismaClientKnownRequestError)) {
        return null;
    }

    const { code, meta } = err;

    switch (code) {
        case 'P2025': {
            // Record not found -> 404 Not Found
            const model = meta?.modelName || 'Record';
            const cause = meta?.cause || 'it does not exist';
            return new CustomError(404, `${model} not found`, [cause]);
        }

        case 'P2002': {
            // Unique constraint violation -> 409 Conflict
            const fields = meta?.target || ['field'];
            const fieldList = Array.isArray(fields) ? fields.join(', ') : fields;
            return new CustomError(409, 'Resource conflict', [`A record with this ${fieldList} already exists`]);
        }

        case 'P2003': {
            // Foreign key constraint failed -> 400 Bad Request
            const field = meta?.field_name || 'field';
            return new HttpValidationException([`Invalid ${field} provided. The referenced record does not exist.`]);
        }

        case 'P2014': {
            // Required relation violation -> 400 Bad Request
            const relation = meta?.relation_name || 'relation';
            return new HttpValidationException([`Invalid ${relation} relationship. The change violates a required relationship.`]);
        }

        case 'P2015': {
            // Related record not found -> 404 Not Found
            return new CustomError(404, 'Related record not found', ['Cannot find the related data for this operation']);
        }

        case 'P2016': {
            // Query interpretation error -> 400 Bad Request
            return new HttpValidationException([meta?.details || 'The provided query could not be processed']);
        }

        case 'P2021': {
            // Table does not exist -> 500 Internal Server Error
            const table = meta?.table || 'table';
            return new HttpException(500, `Database schema error: Table '${table}' does not exist`);
        }

        case 'P2022': {
            // Column does not exist -> 500 Internal Server Error
            const column = meta?.column || 'column';
            return new HttpException(500, `Database schema error: Column '${column}' does not exist`);
        }

        case 'P2000': {
            // Value too long -> 400 Bad Request
            const column = meta?.column_name || 'field';
            return new HttpValidationException([`Value for ${column} is too long. Maximum length exceeded.`]);
        }

        case 'P2001': {
            // Record does not exist (in where condition) -> 404 Not Found
            const model = meta?.model_name || 'record';
            return new CustomError(404, `${model} not found in the database`);
        }

        case 'P2011': {
            // Null constraint violation -> 400 Bad Request
            const constraint = meta?.constraint || 'field';
            return new HttpValidationException([`Missing required field: ${constraint} cannot be null.`]);
        }

        case 'P2012': {
            // Missing required value -> 400 Bad Request
            const path = meta?.path || 'field';
            return new HttpValidationException([`Missing required value for ${path}`]);
        }

        case 'P2013': {
            // Missing required argument -> 400 Bad Request
            const argument = meta?.argument_name || 'field';
            return new HttpValidationException([`Missing required field: ${argument}`]);
        }

        case 'P2023': {
            // Inconsistent column data -> 400 Bad Request
            const column = meta?.column || 'field';
            return new HttpValidationException([`Invalid data format for ${column}`]);
        }

        default: {
            return new CustomError(500, 'Database operation failed', [`Error code: ${code}`]);
        }
    }
};

export default handlePrismaError;