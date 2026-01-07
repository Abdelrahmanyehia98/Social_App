interface IMetaResponse {
  status: number;
  success: boolean;
}

interface IDataResponse {
  message: string;
  data?: unknown;
}

interface IErrorDataResponse {
  message: string;
  context?: object | undefined;
}

interface ISuccessResponse {
  meta: IMetaResponse;
  data?: IDataResponse;
}

interface IFailureResponse {
  meta: IMetaResponse;
  error: IErrorDataResponse;
}
export  {IMetaResponse,IDataResponse,IErrorDataResponse,IFailureResponse,ISuccessResponse }