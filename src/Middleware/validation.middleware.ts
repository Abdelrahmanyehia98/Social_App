import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { BadRequestException } from "../Utils";

type RequsetKeyType = keyof Request;
type SchemaType = Partial<Record<RequsetKeyType, ZodType>>;
type ValidationErrorType = {
  key: RequsetKeyType;
  issues: {
    path: PropertyKey[];
    message: string;
  }[];
};

export const ValidatonMiddleware = (schema: SchemaType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const reqKeys: RequsetKeyType[] = ["body", "params", "query", "headers"];
    
    const validationErrors: ValidationErrorType[] = [];
    for (const key of reqKeys) {
      if (schema[key]) {
        const result = schema[key].safeParse(req[key]);
        if (!result?.success) {
          const issues = result.error?.issues?.map((issue) => ({
            path: issue.path,
            message: issue.message,
          }));
          validationErrors.push({ key, issues });
        }
      }
    }

    if (validationErrors.length)
      throw new BadRequestException("validation failed", { validationErrors });
    next();
  };
};