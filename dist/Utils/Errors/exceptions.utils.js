"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedException = exports.NotFoundException = exports.ConfilctException = exports.BadRequestException = void 0;
const http_exception_utils_1 = require("./http-exception.utils");
class BadRequestException extends http_exception_utils_1.HttpException {
    constructor(message, error) {
        super(message, 400, error);
        this.error = error;
    }
}
exports.BadRequestException = BadRequestException;
class ConfilctException extends http_exception_utils_1.HttpException {
    constructor(message, error) {
        super(message, 409, error);
        this.error = error;
    }
}
exports.ConfilctException = ConfilctException;
class NotFoundException extends http_exception_utils_1.HttpException {
    constructor(message, error) {
        super(message, 404, error);
        this.error = error;
    }
}
exports.NotFoundException = NotFoundException;
class UnauthorizedException extends http_exception_utils_1.HttpException {
    constructor(message, error) {
        super(message, 401, error);
        this.error = error;
    }
}
exports.UnauthorizedException = UnauthorizedException;
