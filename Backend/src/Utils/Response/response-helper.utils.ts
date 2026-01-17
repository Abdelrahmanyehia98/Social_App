import type {
  IFailureResponse,
  ISuccessResponse,
} from "../../Common";

export function SuccessResponse<T>(
  message = "Your Request is processed successfully",
  status = 200,
  data?: T
): ISuccessResponse {
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

export function FailedResponse(
  message = "Your Request is failed",
  status = 500,
  error?: object
): IFailureResponse {
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