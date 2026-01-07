"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessResponse = SuccessResponse;
exports.FailedResponse = FailedResponse;
function SuccessResponse(message = "Your Request is processed successfully", status = 200, data) {
    return {
        meta: {
            status,
            success: true,
        },
        data: {
            message,
            data,
        },
    };
}
function FailedResponse(message = "Your Request is failed", status = 500, error) {
    return {
        meta: {
            status,
            success: false,
        },
        error: {
            message,
            context: error,
        },
    };
}
