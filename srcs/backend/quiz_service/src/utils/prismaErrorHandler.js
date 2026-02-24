import {prisma} from '../../generated/prisma/index.js'

const handlePrismaError = (err, res) => {
    if (!(err instanceof prisma.PrismaClientKnownRequestError)) {
        return false;
    }

    const { code, meta } = err;
    let status = 500;
    let message = 'Database operation failed';
    let details = null;

    switch (code) {
        case 'P2025': {
            // Record not found
            const model = meta?.modelName || 'Record';
            const cause = meta?.cause || 'it does not exist';
            status = 404;
            message = `${model} not found`;
            details = cause;
            break;
        }

        case 'P2002': {
            // Unique constraint violation
            const fields = meta?.target || ['field'];
            const fieldList = Array.isArray(fields) ? fields.join(', ') : fields;
            status = 409;
            message = `A record with this ${fieldList} already exists`;
            details = `Unique constraint failed on: ${fieldList}`;
            break;
        }

        case 'P2003': {
            // Foreign key constraint failed
            const field = meta?.field_name || 'field';
            status = 400;
            message = `Invalid ${field} provided`;
            details = `The referenced ${field} does not exist`;
            break;
        }

        case 'P2014': {
            // Required relation violation
            const relation = meta?.relation_name || 'relation';
            status = 400;
            message = `Invalid ${relation} relationship`;
            details = 'The change violates a required relationship';
            break;
        }

        case 'P2015': {
            // Related record not found
            status = 404;
            message = 'Related record not found';
            details = 'Cannot find the related data for this operation';
            break;
        }

        case 'P2016': {
            // Query interpretation error
            status = 400;
            message = 'Invalid query parameters';
            details = meta?.details || 'The provided query could not be processed';
            break;
        }

        case 'P2021': {
            // Table does not exist
            const table = meta?.table || 'table';
            status = 500;
            message = 'Database schema error';
            details = `Table '${table}' does not exist`;
            break;
        }

        case 'P2022': {
            // Column does not exist
            const column = meta?.column || 'column';
            status = 500;
            message = 'Database schema error';
            details = `Column '${column}' does not exist`;
            break;
        }

        case 'P2000': {
            // Value too long
            const column = meta?.column_name || 'field';
            status = 400;
            message = `Value for ${column} is too long`;
            details = `Maximum length exceeded for ${column}`;
            break;
        }

        case 'P2001': {
            // Record does not exist (in where condition)
            const model = meta?.model_name || 'record';
            status = 404;
            message = `${model} not found in the database`;
            break;
        }

        case 'P2011': {
            // Null constraint violation
            const constraint = meta?.constraint || 'field';
            status = 400;
            message = `Missing required field: ${constraint}`;
            details = `${constraint} cannot be null`;
            break;
        }

        case 'P2012': {
            // Missing required value
            const path = meta?.path || 'field';
            status = 400;
            message = `Missing required value for ${path}`;
            break;
        }

        case 'P2013': {
            // Missing required argument
            const argument = meta?.argument_name || 'field';
            status = 400;
            message = `Missing required field: ${argument}`;
            break;
        }

        case 'P2023': {
            // Inconsistent column data
            const column = meta?.column || 'field';
            status = 400;
            message = `Invalid data format for ${column}`;
            break;
        }

        default: {
            status = 500;
            message = 'Database operation failed';
            details = `Error code: ${code}`;
        }
    }

    // Log for debugging (exclude in production or use proper logger)
    console.error(JSON.stringify({
        code,
        message,
        meta,
        timestamp: new Date().toISOString()
    }, null, 2));

    // Send user-friendly response
    const response = {
        errors: [message]
    };

    // Include details in development only
    if (process.env.NODE_ENV === 'development' && details) {
        response.details = details;
        response.errorCode = code;
    }

    res.status(status).json(response);
    return true;
};

export default handlePrismaError;