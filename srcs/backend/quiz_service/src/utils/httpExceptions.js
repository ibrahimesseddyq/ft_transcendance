export class CustomError extends Error {
    constructor(statusCode = 500, message ,errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors.length ? errors : [message];
    }
}

export class HttpException extends CustomError {
    constructor(statusCode = 500,message = 'Something went wrong') {
        super(statusCode,[message],message)
    }
}

export class HttpValidationException extends  CustomError {
    constructor(errors = ['Bad Request']) {
        super(400, errors);
    }
}