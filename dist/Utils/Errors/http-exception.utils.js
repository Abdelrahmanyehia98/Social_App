"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpException = void 0;
class HttpException extends Error {
    constructor(message, statusCode, error) {
        super();
        this.message = message;
        this.statusCode = statusCode;
        this.error = error;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.HttpException = HttpException;
